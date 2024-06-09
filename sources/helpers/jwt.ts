import jwt, { Secret } from 'jsonwebtoken';

interface JwtPayload {
    userId: number
}

export const generateToken = (userId: number): string => {
    return jwt.sign(
        { userId }, 
        process.env.JWT_SECRET as Secret, 
        { expiresIn: '30d' } // Token expires in 1 month
    );
}

export const verifyToken = (token: string): number => {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;

    return userId;
}