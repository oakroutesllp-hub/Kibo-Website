import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — KIBO",
};

// Real content, 2 Sep 2026 — see privacy-policy/page.tsx's own comment
// for the full context (same owner-priority fix, same day, same
// "starting point, not a lawyer's final review" caveat). Deliberately
// scoped to what this WEBSITE actually does (share product info,
// collect enquiries) rather than inventing terms for order/shipping/
// payment processes this site doesn't perform — those would be
// negotiated directly with a buyer, not governed by a website's terms
// page.
export default function TermsConditionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-h2 font-semibold text-charcoal">Terms &amp; Conditions</h1>
        <p className="text-micro text-charcoal/50">Last updated: 2 September 2026</p>
      </div>

      <div className="flex flex-col gap-6 text-support leading-relaxed text-charcoal/80">
        <p>
          These terms cover your use of this website, wearkibo.com. By
          browsing this site or submitting a form on it, you agree to them.
          If you don&apos;t agree, please don&apos;t use the site.
        </p>

        <h2 className="text-body font-semibold text-charcoal">What this website is</h2>
        <p>
          This site presents KIBO&apos;s apparel product ranges, specifications,
          and catalog, and lets you get in touch about a possible order. It
          is not an online store — no purchase, payment, or order is placed
          through this website. Any actual order, pricing, minimum quantity,
          shipping term, or agreement is negotiated and confirmed directly
          between you and KIBO, separately from this site, and isn&apos;t
          governed by these terms.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Using this site</h2>
        <p>
          You agree to use this website only for legitimate business
          purposes — for example, researching our products or getting in
          touch about a genuine enquiry. You agree not to submit false
          information through our forms, attempt to disrupt or gain
          unauthorized access to the site, or copy its content for
          commercial use without our permission.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Product information</h2>
        <p>
          We aim to keep product descriptions, specifications, and images on
          this site accurate, but details like minimum order quantities,
          fabric options, and pricing are subject to change and to
          confirmation at the time of an actual order. Nothing on this site
          is a binding offer — it&apos;s information to help you decide
          whether to reach out.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Intellectual property</h2>
        <p>
          The KIBO name, logo, photography, and written content on this site
          belong to KIBO (or are used with permission) and may not be
          copied, reproduced, or reused without our written consent.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Third-party links</h2>
        <p>
          This site links out to KIBO&apos;s LinkedIn and Instagram pages and
          to WhatsApp. We don&apos;t control those platforms and aren&apos;t
          responsible for their content or their own terms and privacy
          practices.
        </p>

        <h2 className="text-body font-semibold text-charcoal">No warranty</h2>
        <p>
          This website is provided &ldquo;as is.&rdquo; While we try to keep
          it accurate and available, we don&apos;t guarantee it will be
          error-free, uninterrupted, or free of technical issues at all
          times.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, KIBO isn&apos;t liable for
          any loss or damage arising from your use of this website. This
          doesn&apos;t affect any liability that can&apos;t legally be
          excluded.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Governing law</h2>
        <p>
          These terms are governed by the laws of India, and any dispute
          relating to this website is subject to the courts of Mumbai,
          Maharashtra.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          site after a change means you accept the updated terms — we&apos;ll
          update the &ldquo;Last updated&rdquo; date above whenever we do.
        </p>

        <h2 className="text-body font-semibold text-charcoal">Contact us</h2>
        <p>
          Questions about these terms? Reach us using the contact email or
          WhatsApp number in the footer of this site.
        </p>
      </div>
    </div>
  );
}
