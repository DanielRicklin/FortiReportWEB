import User from '#models/user'
import ValidationToken from '#models/validation_token'
import env from '#start/env'
import { loginUserValidator, registerUserValidator } from '#validators/auth'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'

export default class AuthController {

    register({view} : HttpContext){
        return view.render('pages/auth/register')
    }

    async handleRegister({request, session, response} : HttpContext){
        const {first_name, last_name, email} = await request.validateUsing(registerUserValidator)
        
        if(await User.query().where('email', email).where('is_validated', 0).first()){
            session.flash('success', "You need to validate your account with the email you'll receive before login !")
            return response.redirect().toRoute('auth.login')
        }
        if(await User.query().where('email', email).where('is_validated', 1).first()){
            session.flash('success', "Try login !")
            return response.redirect().toRoute('auth.login')
        }

        const user = await User.create({email, firstName:first_name, lastName:last_name})

        const token = stringHelpers.generateRandom(64)
        const url = `${env.get('PROTOCOL')}://${env.get('HOST')}:${env.get('PORT')}/email-validation?token=${token}`
        ValidationToken.create({
            token,
            userId: user.id,
        })

        await mail.send((message) => {
            message
                .to(email)
                .from('no-reply@forti-report.com')
                .subject('Email validation')
                .htmlView('emails/email_validation', {user, url})
        })

        session.flash('success', "You need to validate your account with the email you'll receive before login !")
        return response.redirect().toRoute('auth.login')
    }

    login({view} : HttpContext){
        return view.render('pages/auth/login')
    }

    async handleLogin({request, response, auth, session} : HttpContext){
        const {email, password} = await request.validateUsing(loginUserValidator)

        const userObj = await User.findBy('email', email)

        if(userObj?.isValidated === 0){
            await session.flash('error', 'Please validate your account with the mail you received')
            return response.redirect().toRoute('auth.login')
        }

        if(userObj?.password != ''){
            const user = await User.verifyCredentials(email, password)
            await auth.use('web').login(user)
            return response.redirect().toRoute('home')
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