import { Router, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticated_middleware';
import { mustBeIdentified } from '../helpers/api_error';
import { findPreviousSessions, findLiveSession } from '../repositories/session';
import { SessionState } from '../models/session/session_state';

const router = Router();

router.get("/", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw mustBeIdentified;
        }

        res.json({
            liveSession: await findLiveSession(req.user),
            previousSessions: await findPreviousSessions(req.user),
            user: req.user
        });
    } catch (e) {
        next(e);
    }
});

export default router;