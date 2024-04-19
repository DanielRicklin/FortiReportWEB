import User from '#models/user'
import Firewall from '#models/firewall'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import Roles from '#enums/roles'

export default class FirewallPolicy extends BasePolicy {
    async before(user: User){
        if(user && user.roleId === Roles.ADMIN){
            return true
        }
    }

    async belongToUser(user: User, firewall: Firewall): AuthorizerResponse {
        if (!firewall) return false

        await user.preload('company', query => {
            query.preload('firewalls', (firewallQuery: Firewall) => {
                firewallQuery.where('id', firewall.id)
            })
        })
        const company = user.company.filter(company => company.firewalls.length != 0)
        return (company.length != 0) ? true : false
    }
}