import { MetadataRoute } from 'next';
import { GENERIC_PATHS } from '@/data/architecture';
import { getCarnets } from '@/sanity/lib/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://domainedegaranches.com';
    const carnets = await getCarnets();

    const entry = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'yearly', lastModified = new Date()) => ({
        url: `${baseUrl}${path}`,
        lastModified,
        changeFrequency,
        priority,
    });

    return [
        entry('', 1),
        ...GENERIC_PATHS.map((path) => entry(`/${path}`, path.includes('/') ? 0.7 : 0.9, path === 'les-vins/cuvees' ? 'monthly' : 'yearly')),
        entry('/carnets', 0.8, 'weekly'),
        ...carnets.map((c: any) => entry(`/carnets/${c.slug}`, 0.6, 'yearly', c.date ? new Date(c.date) : new Date())),
        entry('/contact', 0.6),
        entry('/mentions-legales', 0.3),
        entry('/cgv', 0.3),
        entry('/politique-confidentialite', 0.3),
    ];
}
