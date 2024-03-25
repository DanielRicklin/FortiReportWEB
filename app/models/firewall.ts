import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Company from './company.js'
import FirewallType from './firewall_type.js'

export default class Firewall extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare companyId: number

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>

  @column()
  declare firewallTypeId: number

  @belongsTo(() => FirewallType)
  declare firewallType: BelongsTo<typeof FirewallType>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}