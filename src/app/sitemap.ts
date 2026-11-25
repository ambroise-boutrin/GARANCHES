import { MetadataRoute } from 'next';
import { GENERIC_PATHS } from '@/data/architecture';
import { getCarnets } from '@/sanity/lib/queries';
import { getGammes } from '@/lib/wines';
import { cuveeHref } from '@/lib/wineSlug';
import { SITE_URL } from '@/lib/site';
import { lienLangue } from '@/lib/langue';
import { pagesSansTexte } from '@/lib/pagesVides';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL;
    const [carnets, wines, vides] = await Promise.all([getCarnets(), getGammes(), pagesSansTexte()]);

    // Chaque page existe en français (/…) et en anglais (/en/…) : les deux adresses sont listées,
    // chacune avec le lien vers l'autre langue, pour que Google montre la bonne version à chacun.
    // Pas de date de modification inventée : Google ne retient que des dates fiables (ici, celles des Carnets).
    const entrees = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'yearly', lastModified?: Date) => {
        const fr = `${baseUrl}${path === '/' ? '' : path}`;
        const en = `${baseUrl}${lienLangue(path, 'en')}`;
        const alternates = { languages: { 'fr-FR': fr, 'en-GB': en, 'x-default': fr } };
        return [fr, en].map((url, i) => ({
            url,
            ...(lastModified && { lastModified }),
            changeFrequency,
            // La version anglaise un peu en retrait : le français reste la version principale.
            priority: i === 0 ? priority : Math.round(priority * 8) / 10,
            alternates,
        }));
    };

    return [
        ...entrees('/', 1),
        ...GENERIC_PATHS.filter((path) => !vides.has(path)).flatMap((path) => entrees(`/${path}`, path.includes('/') ? 0.7 : 0.9, path === 'les-vins/cuvees' ? 'monthly' : 'yearly')),
        ...wines.flatMap((wine: any) => entrees(cuveeHref(wine), 0.7, 'monthly')),
        // Les Carnets n'entrent dans le plan du site qu'avec un premier carnet publié.
        ...(carnets.length ? entrees('/carnets', 0.8, 'weekly') : []),
        ...carnets.flatMap((c: any) => entrees(`/carnets/${c.slug}`, 0.6, 'yearly', c.date ? new Date(c.date) : undefined)),
        ...entrees('/contact', 0.6),
        ...entrees('/mentions-legales', 0.3),
        ...entrees('/cgv', 0.3),
        ...entrees('/politique-confidentialite', 0.3),
    ];
}
