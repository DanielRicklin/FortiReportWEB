import factory from '@adonisjs/lucid/factories'
import Firewall from '#models/firewall'
import { CompanyFactory } from './company_factory.js'

export const FirewallFactory = factory
  .define(Firewall, async ({ faker }) => {
    return {
      name: faker.vehicle.fuel()
    }
  })
  .relation('company', CompanyFactory)
  .build()