import User from '#models/user'
import Company from '#models/company'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Roles from '#enums/roles'

export default class CompanyPolicy extends BasePolicy {
    async before(user: User){
        if(user && user.roleId === Roles.ADMIN){
            return true
        }
    }

    async belongToUser(user: User, company: Company): AuthorizerResponse {
        if (!company) return false

        await user.preload('company', query => {
            query.where('slug', company.slug)
        })
        const res = user.company.filter(cmpn => cmpn.length != 0)
        return (res.length != 0) ? true : false
    }
}