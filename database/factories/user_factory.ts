import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { CompanyFactory } from './company_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()