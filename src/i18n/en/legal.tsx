import ChoixLangue from "@/components/ChoixLangue";
import { UI } from "@/i18n/ui";

// Version anglaise des pages légales (mentions légales, CGV, confidentialité).
// Traduction de courtoisie : seule la version française fait foi (phrase affichée en haut de chaque page).
// Dans le studio (Pages légales), les champs « en anglais » remplacent ces textes s'ils sont remplis.

function Avertissement() {
    return <p className="text-sm text-stone-700 mb-8">{UI.en.versionFrancaiseFaitFoi} <ChoixLangue long className="underline underline-offset-2" />.</p>;
}

export function MentionsLegalesEn() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-red-900 mb-8">Legal notice</h1>
                <Avertissement />

                <h3>Site publisher</h3>
                <p>
                    <strong>GFA Domaine de Garanches</strong><br />
                    345 chemin de Garanches, 69460 Odenas, France<br />
                    Phone: <strong><a href="tel:+33661735667">+33 6 61 73 56 67</a> (Isabelle) · <a href="tel:+33658834680">+33 6 58 83 46 80</a> (Aurélie)</strong> · <a href="tel:+33782249436">+33 7 82 24 94 36</a> (Romain) · <a href="tel:+33609419702">+33 6 09 41 97 02</a> (Michel)<br />
                    Email: contact@domainedegaranches.com<br />
                    <br />
                    <strong>Legal form:</strong> Groupement foncier agricole (agricultural land group)<br />
                    <strong>SIREN:</strong> 400 409 173<br />
                    <strong>SIRET (head office):</strong> 400 409 173 00012<br />
                    <strong>Trade and companies register:</strong> 400 409 173 R.C.S. Villefranche-Tarare<br />
                    <strong>VAT number:</strong> FR95400409173<br />
                    <strong>Publication director:</strong> Ambroise Boutrin
                </p>

                <h3>Hosting</h3>
                <p>
                    This site is hosted by Vercel Inc.<br />
                    440 N Barranca Ave #4133, Covina, CA 91723, USA.<br />
                    Website: vercel.com · Contact: vercel.com/help
                </p>

                <h3>Photo credits</h3>
                <p>
                    Photographs: Vianney Tisseau and Domaine de Garanches.
                </p>
            </div>
        </main>
    );
}

export function CgvEn() {
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-wine-900 mb-8 border-b-2 border-wine-100 pb-4">General terms of sale</h1>
                <Avertissement />

                <p className="text-sm mb-8">Last updated: November 2026</p>

                <h3>1. Purpose</h3>
                <p>
                    These General Terms of Sale govern the sale of wines and related products by GFA Domaine de Garanches
                    (SIREN 400 409 173, R.C.S. Villefranche-Tarare), 345 chemin de Garanches, 69460 Odenas, France, contact@domainedegaranches.com,
                    to its private and professional customers. The site does not take online payments: orders are placed by email, by phone or at the estate.
                </p>

                <h3>2. Sale of alcohol to minors</h3>
                <p>
                    In accordance with Article L. 3342-1 of the French Public Health Code, the sale of alcohol to minors under 18 is prohibited.
                    By placing an order, you certify that you are at least 18 years old.
                </p>

                <h3>3. Prices</h3>
                <p>
                    Our prices are given in euros including all taxes, excluding handling and shipping costs.
                    Domaine de Garanches may change its prices at any time, but products are invoiced at the prices in force when the order is confirmed.
                </p>

                <h3>4. Orders and payment</h3>
                <p>
                    Any order implies acceptance of the prices and descriptions of the products available for sale.
                    Payment is due upon ordering. Payment can be made by bank card, cheque or bank transfer, as agreed.
                </p>

                <h3>5. Delivery</h3>
                <p>
                    Products are delivered to the delivery address given when ordering.
                    Delivery times are given as an indication. If shipping is delayed, we will email you to let you know of any impact on the delivery date.
                </p>
                <p>
                    It is the customer&apos;s responsibility to check the condition of the parcels and wines on receipt and to make any justified reservations and claims, or even to refuse the parcel if it may have been opened or shows signs of damage.
                </p>

                <h3>6. Right of withdrawal</h3>
                <p>
                    In accordance with Article L.221-18 of the French Consumer Code, you have 14 days from receipt of your products to exercise your right of withdrawal, without giving reasons or paying any penalty.
                    Returned products must be in their original condition and complete (unopened bottles). Return costs are borne by you.
                </p>

                <div className="bg-stone-50 p-6 border border-stone-200 my-6 not-prose">
                    <h4 className="font-bold text-wine-900 mb-4">Model withdrawal form:</h4>
                    <p className="text-sm mb-4">(Complete and return this form only if you wish to withdraw from the contract)</p>
                    <p className="text-sm">
                        To <strong>Domaine de Garanches</strong>,<br />
                        345 chemin de Garanches, 69460 Odenas, France<br />
                        Email: contact@domainedegaranches.com<br /><br />
                        I/We (*) hereby give notice that I/we (*) withdraw from my/our (*) contract of sale of the following goods (*)/for the provision of the following service (*):<br /><br />
                        Ordered on (*)/received on (*): ..........................................................................<br />
                        Name of consumer(s): ..........................................................................<br />
                        Address of consumer(s): ..........................................................................<br />
                        Signature of consumer(s) (only if this form is sent on paper):<br /><br />
                        Date: ..........................................................................<br />
                        <span className="text-xs">(*) Delete as appropriate.</span>
                    </p>
                </div>

                <h3>7. Legal guarantees</h3>
                <p>
                    Our wines benefit from the legal guarantee of conformity (Articles L.217-3 et seq. of the French Consumer Code) and the guarantee against hidden defects
                    (Articles 1641 et seq. of the French Civil Code). In case of a defect, contact us at contact@domainedegaranches.com: we will replace or refund the product concerned.
                </p>

                <h3>8. Consumer mediation (disputes)</h3>
                <p>
                    In accordance with Articles L.616-1 and R.616-1 of the French Consumer Code, we offer a consumer mediation scheme.
                    If a dispute is not resolved through a prior complaint to us, you may contact the competent consumer mediator.
                    <br /><br />
                    <strong>Consumer mediator:</strong><br />
                    Details to be provided shortly.
                </p>

                <h3>9. Applicable law</h3>
                <p>
                    These terms of distance selling are governed by French law.
                </p>
            </div>
        </main>
    );
}

export function ConfidentialiteEn() {
    const titre = "text-xl font-serif text-wine-800 mt-8 mb-4";
    return (
        <main className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 prose prose-stone">
                <h1 className="text-3xl font-serif text-wine-900 mb-8 border-b-2 border-wine-100 pb-4">Privacy policy</h1>
                <Avertissement />

                <p className="text-sm text-stone-700 mb-8">
                    Last updated: November 2026
                </p>

                <p>
                    This policy explains what personal data we receive through this site, why, how long we keep it and what your rights are.
                    This site contains no advertising and no tracking cookies, and you do not need to create an account.
                </p>

                <h2 className={titre}>1. Data controller</h2>
                <p>
                    <strong>GFA Domaine de Garanches</strong><br />
                    345 chemin de Garanches, 69460 Odenas, France<br />
                    SIREN 400 409 173<br />
                    Email: contact@domainedegaranches.com
                </p>

                <h2 className={titre}>2. Data we receive</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Your messages:</strong> the contact form sends us your name, your email address, your message and, if you provide them, your phone number and your company. It is sent through the Web3Forms service, which forwards the message to us by email. Nothing is stored by the site itself.</li>
                    <li><strong>Your orders and bookings:</strong> if you order bottles or book a visit, we keep the information needed (name, contact details, delivery address, order details).</li>
                    <li id="tranches-age" className="scroll-mt-28"><strong>Age check:</strong> when you enter the site, we ask for your date of birth to check that you are of legal age. This date is used only in your browser and is neither sent nor stored. Only your age group (18-24, 25-34, 35-44, 45-54, 55-64, 65 and over) is added to an anonymous monthly counter, without IP address or identifier. No data can identify you.</li>
                    <li><strong>Audience measurement:</strong> we use Plausible Analytics, a cookie-free European tool that counts page views anonymously, without following visitors from one site to another.</li>
                    <li><strong>Your browser&apos;s memory:</strong> the site keeps in your browser the fact that you have confirmed your age, your cookie choices and your choice of language, so it does not ask you again. This information stays on your device.</li>
                    <li><strong>Google Maps:</strong> on the Contact page, the map only loads if you click &quot;Show the map&quot;. Google then receives your IP address and may set its own cookies, under its own privacy policy.</li>
                </ul>

                <h2 className={titre}>3. Why, and on what legal basis</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Replying to your messages and visit requests: our legitimate interest in replying to you, or steps taken at your request before a contract.</li>
                    <li>Preparing, delivering and invoicing your orders: performance of the sales contract, and our accounting obligations.</li>
                    <li>Checking that visitors are of legal age: our legal obligation not to sell alcohol to minors.</li>
                    <li>Anonymous statistics (age, audience): our legitimate interest in improving the site. This data does not identify you.</li>
                    <li>Google Maps: your consent, given by clicking to show the map.</li>
                </ul>

                <h2 className={titre}>4. Who has access</h2>
                <p>
                    Only the people at the estate who handle your request. We also use technical service providers, who do not use your data for their own purposes:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Vercel Inc. (United States), which hosts the site. Transfers to the United States are covered by the Data Privacy Framework and the European Commission&apos;s standard contractual clauses.</li>
                    <li>Sanity (Norway), which stores the site&apos;s texts and photos as well as the anonymous age group counter.</li>
                    <li>Plausible Analytics (European Union), for anonymous audience measurement.</li>
                    <li>Web3Forms, which forwards contact form messages, our email provider, which receives your emails, and the carrier that delivers your order.</li>
                </ul>
                <p>We never sell or rent your data.</p>

                <h2 className={titre}>5. How long</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Messages and requests:</strong> at most 3 years after our last exchange.</li>
                    <li><strong>Orders and invoices:</strong> 10 years (accounting obligation).</li>
                    <li><strong>Your browser&apos;s memory:</strong> until you clear it, and at most 13 months for your cookie choices.</li>
                </ul>

                <h2 className={titre}>6. Your rights</h2>
                <p>
                    You can ask to access your data, correct it, erase it, restrict its use, receive a copy of it, or object to its use.
                    You can also tell us what we should do with your data after your death.
                </p>
                <p>
                    Write to us at <strong>contact@domainedegaranches.com</strong> or at 345 chemin de Garanches, 69460 Odenas, France. We reply within one month.
                    If you believe your rights are not being respected, you can complain to the CNIL, the French data protection authority (www.cnil.fr).
                </p>

                <h2 className={titre}>7. Security</h2>
                <p>
                    The site is served over HTTPS only, and access to the site management tool is restricted to people at the estate.
                </p>
            </div>
        </main>
    );
}
