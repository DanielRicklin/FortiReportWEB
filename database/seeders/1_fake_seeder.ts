import { CompanyFactory } from '#database/factories/company_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await CompanyFactory.with('users', 3).createMany(3)
  }
}