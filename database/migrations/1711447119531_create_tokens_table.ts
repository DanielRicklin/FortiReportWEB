import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tokens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token').notNullable().unique()
      table.integer('user_id').notNullable().unsigned().references('users.id')
      table.boolean('is_used').notNullable().defaultTo(false)
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}