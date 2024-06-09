import { Prisma, Session, User } from "@prisma/client"
import { SessionResponse } from "../models/session/session_response"
import { SessionWithIncludes } from "../helpers/orm"
import { TrackState } from "../models/session/track/track_state"

export const mapSession = (
    session: SessionWithIncludes, 
    requester: User
): SessionResponse => {
    return {
        id: session.id,
        isOwner: session.ownerId === requester.id,
        previousTracks: session.tracks.filter((track) => track.state === TrackState.played),
        queuedTracks: session.tracks.filter(track => track.state === TrackState.queued),
        currentTrack: session.tracks.filter(track => track.state === TrackState.playing)[0],
        name: session.name,
        state: session.state,
        owner: session.owner,
        users: session.users.map(user => user.user),
        createdAt: session.createdAt,
        ownerId: session.ownerId
    }
}