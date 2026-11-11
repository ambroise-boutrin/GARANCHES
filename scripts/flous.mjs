// Génère src/data/flous.ts : un aperçu flou minuscule de chaque photo utilisée dans le site.
// Il s'affiche à la place de la photo le temps qu'elle arrive (pas d'animation, la photo le remplace d'un coup).
// À relancer après un ajout ou un changement de photo : npm i --no-save sharp && node scripts/flous.mjs
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const lister = (dir) => readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? lister(p) : [p];
});

// Photos citées dans le code (bandeaux, blocs, cartes).
const sources = lister("src").filter((f) => /\.(tsx?|mjs)$/.test(f) && !f.endsWith("flous.ts"));
const chemins = new Set();
for (const f of sources) {
    for (const m of readFileSync(f, "utf8").matchAll(/["'`](\/images\/[^"'`]+?\.(?:jpe?g|png|webp))["'`]/gi)) chemins.add(m[1]);
}

const flous = {};
for (const chemin of [...chemins].sort()) {
    const fichier = join("public", chemin);
    if (!existsSync(fichier) || chemin.includes("/bouteilles/") || chemin.includes("logo")) continue;
    const b = await sharp(fichier).resize(12, 12, { fit: "inside" }).webp({ quality: 50 }).toBuffer();
    flous[chemin] = `data:image/webp;base64,${b.toString("base64")}`;
}

writeFileSync("src/data/flous.ts", `// Fichier généré par scripts/flous.mjs : ne pas modifier à la main.
// Aperçu flou de chaque photo, affiché le temps que la vraie photo charge.
export const FLOUS: Record<string, string> = ${JSON.stringify(flous, null, 4)};

// Props à passer à <Image> : aperçu flou si la photo en a un, rien sinon.
export function flou(src: string): { placeholder?: "blur"; blurDataURL?: string } {
    const blurDataURL = FLOUS[src];
    return blurDataURL ? { placeholder: "blur", blurDataURL } : {};
}
`);
console.log(Object.keys(flous).length, "aperçus");
