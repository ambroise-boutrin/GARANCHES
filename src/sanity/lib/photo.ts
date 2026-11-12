import { urlFor } from './image';
import type { PhotoSanity } from './queries';

// Photo choisie dans le studio : adresse à la bonne largeur, cadrage d'après le point d'intérêt
// (le rond qu'on place sur la photo dans Sanity) et aperçu flou pendant le chargement.
// Chaque nouvelle photo a sa propre adresse : pas de souci avec le cache de 7 jours.
export function photoSanity(photo: PhotoSanity | undefined, largeur: number) {
    if (!photo?.asset) return null;
    return {
        src: urlFor(photo).width(largeur).fit('max').url(),
        position: photo.hotspot ? `${Math.round(photo.hotspot.x * 100)}% ${Math.round(photo.hotspot.y * 100)}%` : undefined,
        blur: photo.lqip,
    };
}
