import { MetadataRoute } from 'next';
import { siteConfig } from '@/data/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/dashboards-bi',
    '/data-engineering',
    '/data-modeling',
    '/training',
    '/legal',
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return routes;
}

