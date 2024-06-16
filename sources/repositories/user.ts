import prisma, { PublicUser } from "../helpers/orm";
import { UserCreationPayload } from "../models/user/UserCreationPayload";
import { GuestCreationPayload } from "../models/user/guest_creation_payload";

export const createUser = async (payload: UserCreationPayload): Promise<PublicUser> => {
    return await prisma.user.create({
        data: {
            type: "REGULAR",
            ...payload
        },
    });
}

export const createGuest = async (payload: GuestCreationPayload): Promise<PublicUser> => {
    return await prisma.user.create({
        data: {
            type: "GUEST",
            nickname: payload.deviceName
        }
    })
}