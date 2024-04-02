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
import CompanyController from '#controllers/company_controller'
import ResetPasswordController from '#controllers/reset_password_controller'
import EmailValidationController from '#controllers/email_validation_controller'


router.get('/', [HomeController, 'home']).use(middleware.auth()).as('home')

router.group(() => {
    router.get('/register', [AuthController, 'register']).as('auth.register')
    router.post('/register', [AuthController, 'handleRegister'])
    router.get('/login', [AuthController, 'login']).as('auth.login')
    router.post('/login', [AuthController, 'handleLogin'])
    router.get('/github/redirect', [SocialsController, 'githubRedirect']).as('github.redirect')
    router.get('/github/callback', [SocialsController, 'githubCallback']).as('github.callback')
    router.get('/forgot-password', [ResetPasswordController, 'forgotPassword']).as('auth.forgot-password')
    router.post('/forgot-password', [ResetPasswordController, 'handleForgotPassword'])
    router.get('/reset-password', [ResetPasswordController, 'resetPassword'])
    router.post('/reset-password', [ResetPasswordController, 'handleResetPassword']).as('auth.handleResetPassword')
    router.get('/email-validation', [EmailValidationController, 'emailValidation'])
    router.post('/email-validation', [EmailValidationController, 'handleEmailValidation']).as('auth.handleEmailValidation')
}).use(middleware.guest())


router.group(() => {
    router.delete('/login', [AuthController, 'logout']).as('auth.logout')
    router.get('/company', [CompanyController, 'home']).as('company.home')
    router.post('/company/create', [CompanyController, 'create']).as('company.create')
    router.get('/company/:slug', [CompanyController, 'show']).as('company.show').where('slug', router.matchers.slug()) //.use(middleware.employee_in_company())
}).use(middleware.auth())