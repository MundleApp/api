import { Track } from "@prisma/client"
import { PublicUser } from "../../helpers/orm"

export interface SessionResponse {
    id: number,
    name: string,
    state: string,
    isOwner: boolean
    previousTracks: Track[],
    queuedTracks: Track[],
    currentTrack: Track | null,
    owner: PublicUser,
    ownerId: number,
    users: PublicUser[],
    createdAt: Date
}
