import User from '#models/user'
import { loginUserValidator, registerUserValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {

    register({view} : HttpContext){
        return view.render('pages/auth/register')
    }

    async handleRegister({request, session, response} : HttpContext){
        const {first_name, last_name, email, password} = await request.validateUsing(registerUserValidator)
        await User.create({email, firstName:first_name, lastName:last_name, password})
        session.flash('success', 'You can now login !')
        return response.redirect().toRoute('auth.login')
    }

    login({view} : HttpContext){
        return view.render('pages/auth/login')
    }

    async handleLogin({request, response, auth, session} : HttpContext){
        const {email, password} = await request.validateUsing(loginUserValidator)

        const socialUser = await User.findBy('email', email)
        if(socialUser?.password != ''){
            const user = await User.verifyCredentials(email, password)
            await auth.use('web').login(user)
        } else {
            await session.flash('error', 'Please try connecting with Github')
        }

        return response.redirect().toRoute('auth.login')
    }

    async logout({response, auth} : HttpContext){
        await auth.use("web").logout()
        return response.redirect().toRoute('auth.login')
    }
}