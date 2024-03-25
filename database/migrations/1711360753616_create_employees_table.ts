import Employees from '#enums/employee_roles'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'employees'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.integer('company_id').unsigned().references('companies.id').notNullable()
      table.integer('employee_role_id').unsigned().references('employee_roles.id').notNullable().defaultTo(Employees.USER)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}