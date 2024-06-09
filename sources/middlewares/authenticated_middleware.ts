import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwt';
import prisma from '../helpers/orm';
import { User } from '@prisma/client';
import { mustBeIdentified } from '../helpers/api_error';

export interface AuthenticatedRequest extends Request {
    user?: User;
}

export const authenticatedMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        next(mustBeIdentified);
        return;
    }

    try {
        req.user = await prisma.user.findFirst({
            select: {
                id: true,
                nickname: true,
                phoneNumber: true
            },
            where: {
                id: verifyToken(token)
            }
        }) as User;

        next();
    } catch (e) {
        res.status(401)
            .json({
                message: "Unauthorized"
            });
    }
}
