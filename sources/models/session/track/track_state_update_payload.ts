import { object, InferType, mixed } from 'yup';
import { TrackState } from './track_state';

export const TrackStateUpdatePayloadScheme = object({
    newState: mixed<TrackState>().oneOf(Object.values(TrackState)).required(),
});

export type TrackStateUpdatePayload = InferType<typeof TrackStateUpdatePayloadScheme>;
