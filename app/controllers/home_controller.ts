import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { createHash } from 'crypto'

export default class HomeController {
    async home({view, auth} : HttpContext){
        let icon = 'https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
        if (auth.isAuthenticated) {
            const hash = createHash('sha256').update((auth.user!.email).toLocaleLowerCase()).digest('hex')
            icon = `https://gravatar.com/avatar/${hash}`
        }
        view.share({icon})

        // const users = await User.query().preload('company').preload('role')

        return view.render('pages/home')
    }
}