import type { APIRoute } from 'astro'

export const prerender = true

const siteUrl = 'https://mentasolar.hu'
const publicRoutes = [
  '/',
  '/napelem',
  '/napelem/uj-rendszer',
  '/napelem/rendszer-bovites',
  '/klima',
  '/auto-tolto',
  '/gyik',
  '/kapcsolat',
]

export const GET: APIRoute = () => {
  const urls = publicRoutes
    .map((route) => `  <url><loc>${new URL(route, siteUrl).toString()}</loc></url>`)
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
