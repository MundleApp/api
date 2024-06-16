import { object, string, InferType } from 'yup';

export const GuestCreationPayloadSchema = object({
    deviceName: string().required(),
});

export type GuestCreationPayload = InferType<typeof GuestCreationPayloadSchema>;
