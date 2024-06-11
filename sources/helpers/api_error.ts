export class APIError extends Error {
    httpStatus: number;
    code: APIErrorCode | null

    constructor(
        httpStatus: number,
        code: APIErrorCode | null,
        message: string
    ) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }
}

enum APIErrorCode {
    unableToValidateAuthentication = "UNABLE_TO_VALIDATE_AUTHENTICATION"
}

export const invalidCredentials = new APIError(
    401,
    null,
    "Invalid credentials."
);

export const unableToVerifyToken = new APIError(
    401,
    APIErrorCode.unableToValidateAuthentication,
    "Unauthorized."
)

export const mustBeIdentified = new APIError(
    401,
    null,
    "Unauthorized."
)

export const sessionNotFound = new APIError(
    404,
    null,
    "Session not found."
)

export const alreadyRegisteredInSession = new APIError(
    500,
    null,
    "You are already registered in this session"
)

export const userIsNotBelongingToSession = new APIError(
    403,
    null,
    "You are not belonging to this session."
)

export const userMustOwnsTheSession = new APIError(
    403,
    null,
    "You are not owning this session."
)

export const trackNotFound = new APIError(
    404,
    null,
    "Track not found."
)