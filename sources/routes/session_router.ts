import { Router, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authenticated_middleware';
import { addUserToSession, createSession, findSession, isUserOwningSession, isUserRegisteredInSession, pushTrack, universalLinkJoinUrl, updateTrackState } from '../repositories/session';
import { mustBeIdentified, userIsNotBelongingToSession, userMustOwnsTheSession } from '../helpers/api_error';
import { SessionPushTrackPayload, SessionPushTrackPayloadScheme } from '../models/session/session_push_track_payload';
import { SessionCreationPayload, SessionCreationPayloadScheme } from '../models/session/session_creation_payload';
import { TrackStateUpdatePayload, TrackStateUpdatePayloadScheme } from '../models/session/track/track_state_update_payload';
import QRCode from 'qrcode';
import Jimp from 'jimp';
import path from 'path';

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

router.get("/:sessionId/sharing_qrcode", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw mustBeIdentified;
        }
        
        const sessionId = parseInt(req.params.sessionId)

        const isRegistered = await isUserRegisteredInSession(
            sessionId, 
            req.user
        );

        if (!isRegistered) {
            throw userIsNotBelongingToSession;
        }

        const url = universalLinkJoinUrl(sessionId);

        // Generate QR code
        const qrCodeDataURL = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H' });

        // Load QR code and logo images
        const qrCodeImage = await Jimp.read(Buffer.from(qrCodeDataURL.split(',')[1], 'base64'));
        const logoPath = path.join(__dirname, '../resources/support/en/logo.png');
        const logo = await Jimp.read(logoPath);

        // Calculate logo size and position
        const qrCodeWidth = qrCodeImage.bitmap.width;
        const qrCodeHeight = qrCodeImage.bitmap.height;
        const logoWidth = qrCodeWidth * 0.25;
        const logoHeight = qrCodeHeight * 0.25;
        const x = (qrCodeWidth - logoWidth) / 2;
        const y = (qrCodeHeight - logoHeight) / 2;

        // Resize logo and composite it onto the QR code
        logo.resize(logoWidth, logoHeight);
        qrCodeImage.composite(logo, x, y);

        // Get the final image as a buffer
        const finalImageBuffer = await qrCodeImage.getBufferAsync(Jimp.MIME_PNG);

        // Set the response header and send the image
        res.setHeader('Content-Type', 'image/png');
        res.send(finalImageBuffer);
        
    } catch (e) {
        next(e);
    }
});

export default router;