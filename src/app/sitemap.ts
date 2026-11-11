import { MetadataRoute } from 'next';
import { GENERIC_PATHS } from '@/data/architecture';
import { getCarnets } from '@/sanity/lib/queries';
import { getWines } from '@/lib/wines';
import { cuveeHref } from '@/lib/wineSlug';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;
    const [carnets, wines] = await Promise.all([getCarnets(), getWines()]);

    // Pas de date de modification inventée : Google ne retient que des dates fiables (ici, celles des Carnets).
    const entry = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'yearly', lastModified?: Date) => ({
        url: `${baseUrl}${path}`,
        ...(lastModified && { lastModified }),
        changeFrequency,
        priority,
    });

    return [
        entry('', 1),
        ...GENERIC_PATHS.map((path) => entry(`/${path}`, path.includes('/') ? 0.7 : 0.9, path === 'les-vins/cuvees' ? 'monthly' : 'yearly')),
        ...wines.map((wine: any) => entry(cuveeHref(wine), 0.7, 'monthly')),
        entry('/carnets', 0.8, 'weekly'),
        ...carnets.map((c: any) => entry(`/carnets/${c.slug}`, 0.6, 'yearly', c.date ? new Date(c.date) : undefined)),
        entry('/contact', 0.6),
        entry('/mentions-legales', 0.3),
        entry('/cgv', 0.3),
        entry('/politique-confidentialite', 0.3),
    ];
}
