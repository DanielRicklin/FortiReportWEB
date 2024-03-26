import app from '@adonisjs/core/services/app'
import { defineConfig, formatters, loaders } from '@adonisjs/i18n'

const i18nConfig = defineConfig({
  defaultLocale: 'en',
  formatter: formatters.icu(),
  loaders: [
    loaders.fs({
      location: app.languageFilesPath()
    })
  ],
  supportedLocales: ['en', 'fr'],
  fallbackLocales: {
    'fr-FR': 'fr',
    'fr-CH': 'fr',
    'en-US': 'en',
    'en-UK': 'en',
  }
})

export default i18nConfig