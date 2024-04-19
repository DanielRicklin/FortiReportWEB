import Firewall_Types from '#enums/firewall_types'
import Roles from '#enums/roles'
import Company from '#models/company'
import Firewall from '#models/firewall'
import User from '#models/user'
import FirewallPolicy from '#policies/firewall_policy'
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

    async home({auth, view} : HttpContext){
        if(auth.user?.roleId === Roles.ADMIN){
            const firewall = await Firewall.all()
            return view.render('pages/firewall/home', {firewall})
        } else {
            const user = await User.query().where('id', Number(auth.user?.id)).preload('company', query => {
                query.preload('firewalls')
            }).first()
            return view.render('pages/firewall/home', {user})
        }
    }

    async delete({auth, params, view, response, bouncer} : HttpContext){
        const firewall = await Firewall.findBy('id', params.id)
        if(await bouncer.with(FirewallPolicy).denies('belongToUser', firewall)){
            return response.redirect().toRoute('firewall.home')
        }
        await firewall?.delete()

        return response.redirect().toRoute('firewall.home')
    }

    async show({} : HttpContext){

    }
}