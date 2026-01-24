import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://roadmap-app-eight.vercel.app/',
      lastModified: new Date(),
    },
  ]
}