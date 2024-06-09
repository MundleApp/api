import { Router, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticated_middleware';
import { addUserToSession, createSession, findSession, isUserOwningSession, isUserRegisteredInSession, pushTrack, updateTrackState } from '../repositories/session';
import { mustBeIdentified, userIsNotBelongingToSession, userMustOwnsTheSession } from '../helpers/api_error';
import { SessionPushTrackPayload, SessionPushTrackPayloadScheme } from '../models/session/session_push_track_payload';
import { SessionCreationPayload, SessionCreationPayloadScheme } from '../models/session/session_creation_payload';
import { TrackStateUpdatePayload, TrackStateUpdatePayloadScheme } from '../models/session/track/track_state_update_payload';

const router = Router();

router.post("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw mustBeIdentified;
        }
        const payload = await SessionCreationPayloadScheme.validate(req.body as SessionCreationPayload);
        const session = await createSession(req.user, payload);
        res.json(
            await findSession(session.id, req.user)
        );
    }
    catch (e) {
        next(e);
    }
});

router.post("/:sessionId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw mustBeIdentified;
        }
        res.json(await addUserToSession(parseInt(req.params.sessionId), req.user));
    } catch (e) {
        next(e);
    }
});

router.get("/:sessionId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw mustBeIdentified
        }

        const sessionId = parseInt(req.params.sessionId)

        const isRegistered = await isUserRegisteredInSession(
            sessionId, 
            req.user
        );

        if (!isRegistered) {
            throw userIsNotBelongingToSession;
        }

        res.json(await findSession(sessionId, req.user))
    } catch (e) {
        next(e);
    }
});

router.get("/:sessionId", )

router.put("/:sessionId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw mustBeIdentified;
        }
        const payload = await SessionPushTrackPayloadScheme.validate(req.body as SessionPushTrackPayload);
        const sessionId = parseInt(req.params.sessionId)

        res.json(
            await pushTrack(sessionId, req.user, payload.trackId)
        );
    } catch (e) {
        next(e);
    }
});

router.post("/:sessionId/:trackId", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw mustBeIdentified;
        }
        const payload = await TrackStateUpdatePayloadScheme.validate(req.body as TrackStateUpdatePayload);
        await updateTrackState(req.user, parseInt(req.params.trackId), payload.newState)
        res.status(200).send();
    } catch (e) {
        next(e);
    }
});

export default router;