import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../helpers/orm';
import { UserCreationPayload, UserCreationPayloadSchema } from '../models/user/UserCreationPayload';
import { UserCreationResponse } from '../models/user/UserCreationResponse';
import { generateToken } from '../helpers/jwt';
import { hashPassword } from '../helpers/hash';
import { createGuest, createUser } from '../repositories/user';
import { GuestCreationPayload, GuestCreationPayloadSchema } from '../models/user/guest_creation_payload';

const router = Router();

/*
** User creation endpoint
** Returning an authentication token
*/
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = await UserCreationPayloadSchema.validate(req.body as UserCreationPayload);
        payload.password = await hashPassword(payload.password);

        const user = await createUser(payload)
        
        res
          .status(200)
          .json({
            accessToken: generateToken(user.id)
          } as UserCreationResponse);    
    } catch (e) {
        next(e);
    }
});

router.post("/guest", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = await GuestCreationPayloadSchema.validate(req.body as GuestCreationPayload);

        const user = await createGuest(payload);

        res
        .status(200)
        .json({
          accessToken: generateToken(user.id)
        } as UserCreationResponse);
    } catch (e) {
        next(e);
    }
});

export default router;