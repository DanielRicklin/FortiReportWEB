import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
// import User from './user.js'

export default class Company extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  // @hasMany(() => User)
  // declare user: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}