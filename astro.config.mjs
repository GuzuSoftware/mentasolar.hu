import { defineConfig } from 'astro/config'
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import markdoc from '@astrojs/markdoc'
import keystatic from '@keystatic/astro'

export default defineConfig({
  site: 'https://mentasolar.hu',
  output: 'server',
  adapter: netlify(),
  integrations: [react(), markdoc(), keystatic()],
})
