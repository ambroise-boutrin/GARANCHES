// Passage d'une page à l'autre depuis la barre d'un univers (SousNav) :
// pas d'animation d'entrée ni de retour en haut, la page reste au même endroit.
let active = false;

export function marquerNavigationDouce() {
    active = true;
}

export function estNavigationDouce() {
    return active;
}

export function finNavigationDouce() {
    active = false;
}
