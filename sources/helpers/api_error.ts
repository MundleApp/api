export class APIError extends Error {
    code: number;

    constructor(
        code: number,
        message: string
    ) {
        super(message);
        this.code = code;
    }
}

export const invalidCredentials = new APIError(
    401, 
    "Invalid credentials."
);

export const unableToVerifyToken = new APIError(
    401,
    "Unauthorized."
)

export const mustBeIdentified = new APIError(
    401,
    "Unauthorized."
)

export const sessionNotFound = new APIError(
    404,
    "Session not found."
)

export const alreadyRegisteredInSession = new APIError(
    500,
    "You are already registered in this session"
)

export const userIsNotBelongingToSession = new APIError(
    403,
    "You are not belonging to this session."
)

export const userMustOwnsTheSession = new APIError(
    403,
    "You are not owning this session."
)

export const trackNotFound = new APIError(
    404,
    "Track not found."
)