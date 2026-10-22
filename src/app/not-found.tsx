import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-center px-4">
            <h2 className="font-serif text-6xl text-red-900 mb-4">404</h2>
            <p className="text-xl text-gray-600 mb-8">Oups ! Cette cuvée semble épuisée (page introuvable).</p>
            <Link
                href="/"
                className="px-8 py-3 bg-stone-900 text-white uppercase tracking-widest text-sm hover:bg-amber-600 transition-colors"
            >
                Retourner à l'accueil
            </Link>
        </div>
    )
}
