import factory from '@adonisjs/lucid/factories'
import Company from '#models/company'

export const CompanyFactory = factory
  .define(Company, async ({ faker }) => {
    const company_name = faker.company.name()
    return {
      name: company_name,
    }
  })
  .build()