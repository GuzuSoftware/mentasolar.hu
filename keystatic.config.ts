import { config, fields, singleton } from '@keystatic/core'

const githubRepo = process.env.KEYSTATIC_GITHUB_REPO

export default config({
  storage: githubRepo
    ? { kind: 'github', repo: githubRepo }
    : { kind: 'local' },
  singletons: {
    site: singleton({
      label: 'Alapadatok és főoldal',
      path: 'src/content/site',
      format: 'json',
      schema: {
        heroEyebrow: fields.text({ label: 'Nyitó címke' }),
        heroTitle: fields.text({ label: 'Nyitó főcím' }),
        heroText: fields.text({ label: 'Nyitó szöveg', multiline: true }),
        phone: fields.text({ label: 'Telefonszám' }),
        email: fields.text({ label: 'E-mail-cím' }),
        address: fields.text({ label: 'Cím' }),
        facebook: fields.url({ label: 'Facebook' }),
        instagram: fields.url({ label: 'Instagram' })
      }
    })
  },
  ui: { brand: { name: 'MentaSolar tartalomkezelő' } }
})
