import { PrismaClient, Prisma, User, Session, Track } from '@prisma/client'

const prisma = new PrismaClient({
});

const userPublicIncludes = Prisma.validator<Prisma.UserDefaultArgs>()({
    select: { id: true, nickname: true },
  })

export const sessionIncludes =  Prisma.validator<Prisma.SessionInclude>()({
    users: {
        include: {
            user: userPublicIncludes
        }
    },
    tracks: {
        include: {
            requestedBy: userPublicIncludes
        }
    },
    owner: userPublicIncludes
});

export type SessionWithIncludes = Prisma.SessionGetPayload<{include: typeof sessionIncludes}>  

export type PublicUser = Prisma.UserGetPayload<typeof userPublicIncludes>;
  
export default prisma;
