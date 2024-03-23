import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
// import Company from '#models/company'
// import Role from '#models/role'
import { CompanyFactory } from './company_factory.js'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    // console.log(await Company.query().limit(1).pojo().first())
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      // company: faker.number.int({min:1,max:10}),
      // role: await Role.query().where('name', 'admin').limit(1).pojo().first(),
    }
  })
  .relation('company', () => CompanyFactory)
  .build()