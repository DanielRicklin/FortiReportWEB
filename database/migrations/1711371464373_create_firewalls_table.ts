import Firewall_Types from '#enums/firewall_types'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'firewalls'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('ip')
      table.integer('port')
      table.string('api_key')
      table.integer('company_id').unsigned().references('companies.id').notNullable().onDelete('CASCADE')
      table.integer('firewall_type_id').unsigned().references('firewall_types.id').notNullable().defaultTo(Firewall_Types.FORTIGATE)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}