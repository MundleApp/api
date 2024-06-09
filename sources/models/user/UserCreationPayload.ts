import { object, string, InferType } from 'yup';

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

export const UserCreationPayloadSchema = object({
    nickname: string().required(),
    phoneNumber: string().matches(phoneRegExp, 'Phone number is not valid').required(),
    password: string().required()
});

export type UserCreationPayload = InferType<typeof UserCreationPayloadSchema>;
