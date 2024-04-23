import Employee_Roles from "#enums/employee_roles";
import Roles from "#enums/roles";
import Company from "#models/company";
import Employee from "#models/employee";
import User from "#models/user";
import CompanyPolicy from "#policies/company_policy";
import { createCompanyValidator, editCompanyValidator } from "#validators/company";
import { HttpContext } from "@adonisjs/core/http";

export default class CompanyController {
    async home({auth, view} : HttpContext){
        if(auth.user?.roleId === Roles.ADMIN){
            const companies = await Company.all()
            return view.render('pages/company/home', {companies})
        } else {
            const companies = await User.findBy('id', auth.user?.id)
            await companies?.load('company')
            return view.render('pages/company/home', {companies:companies?.company})
        }
    }

    async show({view, params, bouncer}: HttpContext){
        const company = await Company.findBy('slug', params.slug)
        if(await bouncer.with(CompanyPolicy).denies('belongToUser', company)){
            return view.render('pages/errors/not_found')
        }

        await company?.load('firewalls')
        
        return view.render('pages/company/show', {company})
    }

    async create({auth, response, request} : HttpContext){
        const {company_name} = await request.validateUsing(createCompanyValidator)

        const newCompany = await Company.create({name:company_name})
        await Employee.create({
            userId: auth.user?.id,
            companyId: newCompany.id,
            employeeRoleId: Employee_Roles.ADMIN_R
        })
        return response.redirect().toRoute('company.show', { slug :  newCompany.slug})
    }

    async edit({bouncer, params, view, request, response} : HttpContext){
        const {name} = await request.validateUsing(editCompanyValidator)

        const company = await Company.findBy('slug', params.slug)
        if(await bouncer.with(CompanyPolicy).denies('belongToUser', company)){
            return view.render('pages/errors/not_found')
        }

        await company?.merge({name}).save()

        return response.redirect().toRoute('company.show', { slug :  company?.slug})
    }

    async delete({bouncer, params, view, response} : HttpContext){
        const company = await Company.findBy('slug', params.slug)
        if(await bouncer.with(CompanyPolicy).denies('belongToUser', company)){
            return view.render('pages/errors/not_found')
        }

        await company?.delete()

        return response.redirect().toRoute('company.home')
    }
}