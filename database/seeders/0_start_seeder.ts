import Employee_Roles from '#enums/employee_roles'
import Roles from '#enums/roles'
import EmployeeRole from '#models/employee_role'
import Role from '#models/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        id: Roles.USER,
        name: 'user'
      },
      {
        id: Roles.ADMIN,
        name: 'admin'
      }
    ]),
    await EmployeeRole.createMany([
      {
        id: Employee_Roles.USER,
        name: 'user'
      },
      {
        id: Employee_Roles.ADMIN_R,
        name: 'admin_r'
      },
      {
        id: Employee_Roles.ADMIN_RW,
        name: 'admin_rw'
      },
    ])
  }
}