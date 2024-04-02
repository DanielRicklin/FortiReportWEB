import vine from '@vinejs/vine'

export const createCompanyValidator = vine.compile(
    vine.object({
        company_name: vine.string().unique(async (db, value) => {
            const companies = await db.from('companies').where('name', value).first()
            return !companies
        })
    })
)