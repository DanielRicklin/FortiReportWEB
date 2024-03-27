import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
    vine.object({
        first_name: vine.string().trim().alphaNumeric(),
        last_name: vine.string().trim().alphaNumeric(),
        email: vine.string().email().unique(async (db, value) => {
            const users = await db.from('users').where('email', value).where('is_validated', 1).first()
            return !users
        })
    })
)

export const loginUserValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(16)
    })
)

export const forgotPasswordValidator = vine.compile(
    vine.object({
        email: vine.string().email()
    })
)

export const resetPasswordValidator = vine.compile(
    vine.object({
        token: vine.string(),
        password: vine.string().minLength(16).confirmed()
    })
)

export const validationTokenValidator = vine.compile(
    vine.object({
        token: vine.string(),
        password: vine.string().minLength(16).confirmed()
    })
)