import factory from '@adonisjs/lucid/factories'
import Company from '#models/company'
import { UserFactory } from './user_factory.js'

export const CompanyFactory = factory
  .define(Company, async ({ faker }) => {
    return {
      name: faker.company.name()
    }
  })
  .relation('users', () => UserFactory)
  .build()