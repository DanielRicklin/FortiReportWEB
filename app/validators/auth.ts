import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
    vine.object({
        firstname: vine.string().trim().alphaNumeric(),
        lastname: vine.string().trim().alphaNumeric(),
        email: vine.string().email().unique(async (db, value) => {
            const users = await db.from('users').where('email', value).first()
            return !users
        }),
        password: vine.string().minLength(16).confirmed()
    })
)

export const loginUserValidator = vine.compile(
    vine.object({
        email: vine.string().email(),
        password: vine.string().minLength(16)
    })
)