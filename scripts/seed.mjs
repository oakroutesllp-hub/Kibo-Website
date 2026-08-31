// One-off sample-content seeding for the Phase 1 Sanity checkpoint.
// Requires .env.local with a real project + SANITY_API_WRITE_TOKEN set.
// Run with: node --env-file=.env.local scripts/seed.mjs
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN — set them in .env.local first.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const homepage = {
  _id: "homepage",
  _type: "homepage",
  heroHeading: "Men's Apparel for African Markets",
  heroSubheading: "Exported from India.",
  rangeHeading: "Start with the Range",
  rangeIntro:
    "T-shirts, polos, woven shirts, trousers and track pants — an example of capability, not a fixed catalogue.",
};

const products = [
  {
    _id: "product-classic-crew-t-shirt",
    _type: "product",
    title: "Classic Crew T-Shirt",
    slug: { _type: "slug", current: "classic-crew-t-shirt" },
    category: "T-Shirts",
    shortDescription: "Everyday cotton crew neck, built for volume orders.",
    specifications: [
      { _key: "fabric", label: "Fabric", value: "180 GSM combed cotton" },
      { _key: "fit", label: "Fit", value: "Regular" },
    ],
  },
  {
    _id: "product-oxford-woven-shirt",
    _type: "product",
    title: "Oxford Woven Shirt",
    slug: { _type: "slug", current: "oxford-woven-shirt" },
    category: "Woven Shirts",
    shortDescription: "Structured woven shirt for office and smart-casual wear.",
    specifications: [
      { _key: "fabric", label: "Fabric", value: "Oxford cotton blend" },
      { _key: "fit", label: "Fit", value: "Slim / Regular" },
    ],
  },
];

const articles = [
  {
    _id: "article-why-we-started-by-listening",
    _type: "article",
    title: "Why We Started by Listening to the African Market",
    slug: { _type: "slug", current: "why-we-started-by-listening" },
    excerpt:
      "Before building a range, KIBO commissioned market research to understand what African importers actually need.",
    publishedAt: new Date().toISOString(),
    body: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Sample article body — edit via the Studio." },
        ],
      },
    ],
  },
];

const run = async () => {
  const tx = client.transaction();
  tx.createOrReplace(homepage);
  for (const doc of [...products, ...articles]) tx.createIfNotExists(doc);
  await tx.commit();
  console.log("Seeded homepage, products and articles.");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
