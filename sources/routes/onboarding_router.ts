import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../helpers/orm';
import { UserCreationPayload, UserCreationPayloadSchema } from '../models/user/UserCreationPayload';
import { UserCreationResponse } from '../models/user/UserCreationResponse';
import { generateToken } from '../helpers/jwt';
import { hashPassword } from '../helpers/hash';

const router = Router();

/*
** User creation endpoint
** Returning an authentication token
*/
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = await UserCreationPayloadSchema.validate(req.body as UserCreationPayload);
        payload.password = await hashPassword(payload.password);

        const user = await prisma.user.create({
            data: payload,
        });
    
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