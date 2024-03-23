import { CompanyFactory } from '#database/factories/company_factory'
import { UserFactory } from '#database/factories/user_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // await CompanyFactory.createMany(10)
    const user = await UserFactory.with('company', 3).create()
    console.log(user)
  }
}