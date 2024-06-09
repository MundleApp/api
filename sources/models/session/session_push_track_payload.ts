import { object, string, InferType } from 'yup';

export const SessionPushTrackPayloadScheme = object({
    trackId: string().required(),
});

export type SessionPushTrackPayload = InferType<typeof SessionPushTrackPayloadScheme>;
