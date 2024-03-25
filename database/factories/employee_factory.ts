import factory from '@adonisjs/lucid/factories'
import Employee from '#models/employee'
import { CompanyFactory } from './company_factory.js'
import { UserFactory } from './user_factory.js'

export const EmployeeFactory = factory
  .define(Employee, async () => {
    return {}
  })
  .relation('company', () => CompanyFactory)
  .relation('user', () => UserFactory)
  .build()