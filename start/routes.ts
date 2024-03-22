/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import HomeController from '#controllers/home_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import SocialsController from '#controllers/socials_controller'


router.get('/', [HomeController, 'home']).use(middleware.auth()).as('home')

router.group(() => {
    router.get('/register', [AuthController, 'register']).as('auth.register')
    router.post('/register', [AuthController, 'handleRegister'])
    router.get('/login', [AuthController, 'login']).as('auth.login')
    router.post('/login', [AuthController, 'handleLogin'])
    router.get('/github/redirect', [SocialsController, 'githubRedirect']).as('github.redirect')
    router.get('/github/callback', [SocialsController, 'githubCallback']).as('github.callback')
}).use(middleware.guest())


router.group(() => {
    router.delete('/login', [AuthController, 'logout']).as('auth.logout')
}).use(middleware.auth())