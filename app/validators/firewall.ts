import vine from '@vinejs/vine'

export const createFirewallValidator = vine.compile(
    vine.object({
        name: vine.string(),
        ip: vine.string(),
        port: vine.number(),
        api_key: vine.string(),
        company_id: vine.number()
    })
)