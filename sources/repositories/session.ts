import { Prisma, Session, Track, User } from "@prisma/client"
import prisma, { SessionWithIncludes, sessionIncludes } from "../helpers/orm";
import { SessionState } from "../models/session/session_state";
import { alreadyRegisteredInSession, sessionNotFound, trackNotFound, userIsNotBelongingToSession, userMustOwnsTheSession } from "../helpers/api_error";
import { SessionCreationPayload } from "../models/session/session_creation_payload";
import { TrackState } from "../models/session/track/track_state";
import { SessionResponse } from "../models/session/session_response";
import { mapSession } from "../mappers/session_mapper";
  
export const createSession = async (user: User, payload: SessionCreationPayload): Promise<SessionResponse> => {
    const createdSession = await prisma.session.create({
        data: {
            ownerId: user.id,
            name: payload.name,
            state: SessionState.active
        }
    });

    return await findSession(createdSession.id, user);
};

export const findSession = async (id: number, user: User): Promise<SessionResponse> => {
    const session = await prisma.session.findFirst({
            where: {
                id: id
            },
            include: sessionIncludes
        }
    );

    if (!session) {
        throw sessionNotFound
    }
    return mapSession(session, user);
};

export const isUserRegisteredInSession = async (sessionId: number, user: User) => {
    const session = await findSession(sessionId, user);

    if (isUserOwningSession(user, session)) {
        return true;
    }

    const registration = await prisma.usersInSessions.findFirst({
        where: {
            sessionId: sessionId,
            userId: user.id
        }
    })

    return registration !== null;
};

export const isUserOwningSession = (user: User, session: Session): boolean => {
    return session.ownerId === user.id;
}

export const addUserToSession = async (sessionId: number, user: User): Promise<SessionResponse> => {
    const session = await findSession(sessionId, user);
    if (await isUserRegisteredInSession(sessionId, user)) {
        throw alreadyRegisteredInSession;
    }
    await prisma.usersInSessions.create({
        data: {
            sessionId: session.id,
            userId: user.id
        }
    })
    return findSession(sessionId, user);
}

export const pushTrack = async (sessionId: number, requester: User, externalTrackId: string) => {
    if (!await isUserRegisteredInSession(sessionId, requester)) {
        throw userIsNotBelongingToSession;
    }
    const track = await prisma.track.create({
        data: {
            requestedById: requester.id,
            externalId: externalTrackId,
            sessionId: sessionId,
            state: TrackState.queued
        }
    })

    await prisma.session.update({
        where: {
            id: sessionId
        },
        data: {
            state: SessionState.active
        }
    });

    return track;
}

const findSessions = async (user: User, state: SessionState): Promise<SessionResponse[]> => {
    const sessions: SessionWithIncludes[] = await prisma.session.findMany({
            where: {
                OR: [
                    {
                        users: {
                            some: {
                                userId: user.id
                            }
                        }
                    },
                    {
                        ownerId: user.id
                    }
                ],
                state: state
            },
            include: sessionIncludes,
            orderBy: {
                createdAt: "desc"
            }
        }
    );
    return sessions.map(session => {
        return mapSession(
            session, 
            user 
        );
    });
}

export const findPreviousSessions = async (user: User): Promise<SessionResponse[]> => {
    return await findSessions(user, SessionState.inactive)
}

export const findLiveSession = async (user: User): Promise<SessionResponse | undefined> => {
    const sessions = await findSessions(user, SessionState.active)

    return sessions[0];
}

export const updateTrackState = async (user: User, trackId: number, state: TrackState): Promise<void> => {
    const track = await prisma.track.findFirst({
        where: {
            id: trackId
        },
        include: {
            Session: true
        }
    });

    if (!track) {
        throw trackNotFound
    }

    if (!isUserOwningSession(user, track.Session)) {
        throw userMustOwnsTheSession;
    }

    await prisma.track.update({
        where: {
            id: trackId
        },
        data: {
            state: state
        }
    })
}