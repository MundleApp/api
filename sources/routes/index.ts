import Express, { Router, Request, Response, NextFunction } from 'express';
import overviewRouter from './overview_router';
import authenticationRouter from './authentication_router';
import onboardingRouter from './onboarding_router';
import sessionRouter from './session_router';
import { authenticatedMiddleware } from '../middlewares/authenticated_middleware';
import { APIError } from '../helpers/api_error';
import path from "path";

const router: Router = Router();

/*
** Public routes
*/
router.use("/auth", authenticationRouter)
router.use("/onboarding", onboardingRouter)
router.use('/resources', Express.static(path.join(__dirname, "../resources")));

/*
** Private routes
*/
router.use("/overview", authenticatedMiddleware, overviewRouter)
router.use("/session", authenticatedMiddleware, sessionRouter)

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof APIError) {
        res.status(err.httpStatus).json({
            error: err.message,
            code: err.code
        });         
    } else {
        res.status(500).json({
            error: err.message
        });    
    }
});

export default router;