import Firewall_Types from '#enums/firewall_types'
import Company from '#models/company'
import Firewall from '#models/firewall'
import User from '#models/user'
import { createFirewallValidator } from '#validators/firewall'
import type { HttpContext } from '@adonisjs/core/http'

export default class FirewallController {
    async create({view, request, params, auth} : HttpContext){
        const companies = await User.query().where('id', Number(auth.user?.id)).first()
        await companies?.load('company')

        const result = companies?.company.filter(cp => cp.slug === params.slug)

        if(!result?.length){
            return view.render('pages/errors/not_found')
        }

        const company = await Company.findBy('slug', params.slug)
        return view.render('pages/firewall/create', {company})
    }

    async handleCreate({request, view} : HttpContext){
        const {name, ip, port, api_key, company_id} = await request.validateUsing(createFirewallValidator)

        await Firewall.create({
            name,
            ip,
            port,
            apiKey: api_key,
            companyId: company_id,
            firewallTypeId: Firewall_Types.FORTIGATE
        })

        const company = await Company.findBy('id', company_id)
        await company?.load('firewalls')
        
        return view.render('pages/company/show', {company})
    }
}