import type { HttpContext } from '@adonisjs/core/http'
import { createHash } from 'crypto'

export default class HomeController {
    home({view, auth} : HttpContext){
        let icon = 'https://gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'
        if (auth.isAuthenticated) {
            console.log(auth.user)
            const hash = createHash('sha256').update((auth.user!.email).toLocaleLowerCase()).digest('hex')
            icon = `https://gravatar.com/avatar/${hash}`
        }
        view.share({icon})
        return view.render('pages/home')
    }
}