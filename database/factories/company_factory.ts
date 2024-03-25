import factory from '@adonisjs/lucid/factories'
import Company from '#models/company'
import string from '@adonisjs/core/helpers/string'

export const CompanyFactory = factory
  .define(Company, async ({ faker }) => {
    const company_name = faker.company.name()
    return {
      name: company_name,
      slug: string.slug(company_name)
    }
  })
  .build()