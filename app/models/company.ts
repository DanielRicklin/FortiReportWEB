import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import Employee from './employee.js'
import string from '@adonisjs/core/helpers/string'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Firewall from './firewall.js'

export default class Company extends BaseModel {

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @hasMany(() => Employee)
  declare employees: HasMany<typeof Employee>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: "employees"
  })
  declare users: ManyToMany<typeof User>

  @hasMany(() => Firewall)
  declare firewalls: HasMany<typeof Firewall>

  @beforeCreate()
  static async slugify(company: Company){
    if(company.slug) return

    const slug = string.slug(company.name, {
      replacement: '-',
      lower: true,
      strict: true
    })

    const rows = await Company.query()
      .select('slug')
      .whereRaw('lower(??) = ?', ['slug', slug])
      // .orWhereRaw('lower(??) like ?', ['slug', `slug-%`])

    if(!rows.length){
      company.slug = slug
      return
    }

    const incrementors = rows.reduce<number[]>((result, row) => {
      const tokens = row.slug.toLowerCase().split(`${slug}-`)

      if (tokens.length < 2){
        return result
      }

      const increment = Number(tokens.at(1))

      if(!Number.isNaN(increment)){
        result.push(increment)
      }

      return result
    }, [])

    const increment = incrementors.length ? Math.max(...incrementors) + 1 : 1

    company.slug = `${slug}-${increment}`
  }
}