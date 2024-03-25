import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SocialsController {
    githubRedirect({ally} : HttpContext){
        ally.use('github').redirect((req) => {
            req.scopes(['user'])
        })
    }

    async githubCallback({ally, response, session, auth} : HttpContext){
        const gh = ally.use('github')

        /**
         * User has denied access by canceling
         * the login flow
         */
        if (gh.accessDenied()) {
            session.flash('error', 'You canceled the access')
            return response.redirect().toRoute('auth.login')
        }

        /**
         * OAuth state verification failed. This happens when the
         * CSRF cookie gets expired.
         */
        if (gh.stateMisMatch()) {
            session.flash('error', 'CSRF cookie is expired')
            return response.redirect().toRoute('auth.login')
        }

        /**
         * GitHub responded with some error
         */
        if (gh.hasError()) {
            session.flash('error', 'Access Error')
            return response.redirect().toRoute('auth.login')
        }

        /**
         * Access user info
         */
        const githubUser = await gh.user()
        const user = await User.findBy('email', githubUser.email)
        if(!user){
            const newUser = await User.create({firstName: githubUser.name.split(' ')[0], lastName: githubUser.name.split(' ')[1], email: githubUser.email, password: ''})
            await auth.use('web').login(newUser)
        } else {
            await auth.use('web').login(user!)
        }
        session.flash('success', 'Connected with Github')
        return response.redirect().toRoute('home')
    }
}