import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — KIBO",
};

// Real content, 2 Sep 2026 — replaces the placeholder that stood here
// since the page was first built (owner priority-1 fix, after the "if
// I had to pick what's next" assessment: the site was live and
// collecting real names/emails/phone numbers through the enquiry and
// catalog-download forms while this page openly said "this is a
// placeholder"). Written directly from this codebase's actual data
// practices, not a generic downloaded template — see each section's
// own comment for exactly which file/behavior it describes. This is a
// solid starting point, not a substitute for a lawyer's review before
// treating it as final.
//
// Legal entity name confirmed by the owner, 3 Sep 2026: "OakRoutes
// Ventures LLP" — the one bracketed placeholder this page carried
// since it was written is now filled in below.
//
// Layout matches the Blog post page's own reading-width convention
// (`max-w-2xl`, `text-support leading-relaxed`) — this is long-form text
// meant to be read, not a short utility page.
export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 font-semibold text-charcoal">Privacy Policy</h1>
        <p className="text-micro text-charcoal/50">Last updated: 3 September 2026</p>
      </div>

      <div className="flex flex-col gap-6 text-support leading-relaxed text-charcoal/80">
        <p>
          This policy explains what personal information KIBO collects through
          this website, why, and what we do with it. It applies to
          wearkibo.com and every page on it.
        </p>
        <p className="text-micro text-charcoal/50">
          KIBO is operated by OakRoutes Ventures LLP. Everywhere this policy
          says &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;KIBO,&rdquo; it
          means that entity.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Information we collect</h2>
        <p>We collect personal information only when you choose to give it to us, through two forms on this site:</p>
        <ul className="list-disc pl-5">
          <li><strong>&ldquo;Talk to KIBO&rdquo; enquiry form:</strong> your name, email address, phone number, and (optionally) which product you&apos;re interested in.</li>
          <li><strong>&ldquo;Download Catalog&rdquo; form:</strong> your name and email address.</li>
        </ul>
        <p>
          We don&apos;t require you to create an account or a password anywhere
          on this site, and we don&apos;t process any payments here — this
          website shares information about KIBO&apos;s products and collects
          enquiries; it doesn&apos;t process orders or transactions directly.
        </p>

        <h2 className="text-body font-semibold text-charcoal">How we use it</h2>
        <p>
          We use the information you submit only to respond to your enquiry
          or send you the catalog you requested — for example, to get in
          touch by email, phone, or WhatsApp about a possible order. We don&apos;t
          use it for anything else, and we don&apos;t sell it to anyone.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Where it goes</h2>
        <p>
          Only KIBO can access your data, so our team can follow up with you.
          No third-party marketing company, ad network, or data broker
          receives this information.
        </p>
        <p>
          If you choose to contact us via the WhatsApp link on this site,
          that conversation happens on WhatsApp itself and is subject to
          WhatsApp&apos;s own privacy policy, not this one — clicking that link
          shares your phone number and message with us through WhatsApp, the
          same as messaging any other WhatsApp contact.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Cookies &amp; analytics</h2>
        <p>
          This site uses a privacy-friendly analytics tool to understand, in
          aggregate, how many people visit and which pages they view. It does
          not use cookies, does not collect your name or email, and does not
          track you across other websites — it can&apos;t identify you
          personally, only that &ldquo;a visit happened.&rdquo;
        </p>
        <p>
          Links to KIBO&apos;s LinkedIn and Instagram pages take you to
          third-party sites with their own separate privacy policies, which
          we don&apos;t control.
        </p>

        <h2 className="text-body font-semibold text-charcoal">How long we keep it</h2>
        <p>
          We keep the information you submit for as long as reasonably
          needed to respond to your enquiry and maintain a record of our
          business conversations — typically for the life of the business
          relationship, or until you ask us to delete it.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Your choices</h2>
        <p>
          You can ask us at any time to tell you what information we hold
          about you, to correct it, or to delete it. Contact us using the
          email address in the footer of this site to make any of these
          requests.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Children</h2>
        <p>
          This site is intended for businesses and professionals sourcing
          apparel, not for children, and we don&apos;t knowingly collect
          information from anyone under 18.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Where your data is stored</h2>
        <p>
          The tools we use to run this website and store enquiry details
          (our hosting provider and the spreadsheet service above) may store
          data on servers outside India, including in the United States. By
          using this site, you understand your information may be processed
          in those locations.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Changes to this policy</h2>
        <p>
          If we change how we collect or use your information, we&apos;ll
          update this page and change the &ldquo;Last updated&rdquo; date
          above. We encourage you to check back occasionally.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Contact us</h2>
        <p>
          Questions about this policy, or a request about your own data?
          Reach us using the contact email or WhatsApp number in the footer
          of this site.
        </p>
      </div>
    </div>
  );
}
