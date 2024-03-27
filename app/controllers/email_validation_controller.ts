import User from '#models/user'
import ValidationToken from '#models/validation_token'
import { validationTokenValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class EmailValidationController {

    async emailValidation({request, session, response, view} : HttpContext){
        const token = request.input("token")

        const tokenObj = await ValidationToken.findBy('token', token)
        if(!tokenObj || tokenObj.isUsed === true){
            session.flash("error", "The link is not valid")
            return response.redirect().toRoute('auth.register')
        }

        return view.render('pages/auth/email_validation', {token})
    }

    async handleEmailValidation({request, session, response} : HttpContext){
        const {password, token} = await request.validateUsing(validationTokenValidator)

        const tokenObj = await ValidationToken.findBy('token', token)
        if(!tokenObj || tokenObj.isUsed == 1){
            session.flash("error", "The link is not valid")
            return response.redirect().toRoute('auth.register')
        }

        const user = await User.findBy('id', tokenObj.userId)
        if(!user){
            session.flash("error", "An error occured")
            return response.redirect().toRoute('auth.register')
        }

        await tokenObj.merge({isUsed: true}).save()
        await user.merge({password, isValidated: true}).save()

        session.flash("success", "Password reset !")
        return response.redirect().toRoute('auth.login')
    }
}