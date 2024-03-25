import Roles from "#enums/roles";
import Company from "#models/company";
import { HttpContext } from "@adonisjs/core/http";

export default class CompanyController {
    async home({auth, view} : HttpContext){
        if(auth.user?.roleId === Roles.ADMIN){
            const companies = await Company.all()
            return view.render('pages/company/home', {companies})
        } else {

        }
    }

    async show({view}: HttpContext){
        view.render('pages/company/show')
    }
}