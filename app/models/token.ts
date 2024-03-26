import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare token: string

  @column()
  declare userId: number

  @column()
  declare isUsed: boolean

  @column.dateTime()
  declare expiresAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}