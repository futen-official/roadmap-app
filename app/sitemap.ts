import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://roadmap-app-git-main-futen-officials-projects.vercel.app/',
      lastModified: new Date(),
    },
  ]
}