import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../helpers/orm';
import { generateToken } from '../helpers/jwt';
import { UserAuthenticationPayload, UserAuthenticationPayloadSchema } from '../models/user/UserAuthenticationPayload';
import { comparePassword, hashPassword } from '../helpers/hash';
import { invalidCredentials } from '../helpers/api_error';
import { UserAuthenticationResponse } from '../models/user/UserAuthenticationResponse';

const router = Router();

/*
** User authentication endpoint
** Returing an authentication token
*/
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = await UserAuthenticationPayloadSchema.validate(req.body as UserAuthenticationPayload);

        const matchingUser = await prisma.user.findFirst({
            where: {
                phoneNumber: payload.phoneNumber,
                type: "REGULAR"
            }
        });

        if (!matchingUser || !matchingUser.password) {
            throw invalidCredentials;
        }

        if (await comparePassword(matchingUser.password, payload.password)) {
            res.json({
                accessToken: generateToken(matchingUser.id)
            } as UserAuthenticationResponse)
        } else {
            throw invalidCredentials;
        }
    } catch (e) {
        next(e);
    }
});

export default router;