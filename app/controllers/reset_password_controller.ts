import User from '#models/user'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/auth'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import env from '#start/env'
import ResetToken from '#models/reset_token'

export default class ResetPasswordController {

    forgotPassword({view} : HttpContext){
        return view.render('pages/auth/forgot_password')
    }

    async handleForgotPassword({request, session, response} : HttpContext){
        const {email} = await request.validateUsing(forgotPasswordValidator)

        const user = await User.findBy('email', email)
        if(!user || user.password === null){
            session.flash("success", "If you are registered, you will receive an email soon")
            return response.redirect().toRoute('auth.login')
        }

        const token = stringHelpers.generateRandom(64)
        const url = `${env.get('PROTOCOL')}://${env.get('HOST')}:${env.get('PORT')}/reset-password?token=${token}`
        ResetToken.create({
            token,
            userId: user.id,
            expiresAt: DateTime.now().plus({minutes: 20})
        })

        await mail.send((message) => {
            message
                .to(user.email)
                .subject('Forgot Password')
                .htmlView('emails/forgot_password', {user, url})
        })

        session.flash("success", "If you are registered, you will receive an email soon")
        return response.redirect().toRoute('auth.login')
    }

    async resetPassword({request, session, response, view} : HttpContext){
        const token = request.input("token")

        const tokenObj = await ResetToken.findBy('token', token)
        if(!tokenObj || tokenObj.isUsed === true || DateTime.now() > tokenObj.expiresAt){
            session.flash("error", "The link as expires or invalid")
            return response.redirect().toRoute('auth.forgot-password')
        }

        return view.render('pages/auth/reset_password', {token})
    }

    async handleResetPassword({request, session, response} : HttpContext){
        const {password, token} = await request.validateUsing(resetPasswordValidator)

        const tokenObj = await ResetToken.findBy('token', token)
        if(!tokenObj || tokenObj.isUsed == 1 || DateTime.now() > tokenObj.expiresAt){
            session.flash("error", "The link as expires or invalid")
            return response.redirect().toRoute('auth.forgot-password')
        }

        const user = await User.findBy('id', tokenObj.userId)
        if(!user){
            session.flash("error", "An error occured")
            return response.redirect().toRoute('auth.forgot-password')
        }

        await tokenObj.merge({isUsed: true}).save()
        await user.merge({password}).save()

        session.flash("success", "Password reset !")
        return response.redirect().toRoute('auth.login')
    }
}