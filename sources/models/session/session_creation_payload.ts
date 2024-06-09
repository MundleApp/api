import { object, string, InferType } from 'yup';

export const SessionCreationPayloadScheme = object({
    name: string().required(),
});

export type SessionCreationPayload = InferType<typeof SessionCreationPayloadScheme>;
