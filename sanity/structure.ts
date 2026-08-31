import type { StructureResolver } from "sanity/structure";

// Homepage, Our Story, and Site Settings are singletons — pin one
// editable item each instead of a list the owner could accidentally
// create duplicates of.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.listItem()
        .title("Our Story")
        .child(S.document().schemaType("ourStory").documentId("ourStory")),
      S.listItem()
        .title("Site Settings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      // "Product Categories" added 31 Aug 2026 (owner: "crew neck,
      // v-neck, polo... product cards need to be editable, specs need
      // to be editable, all the images... need to be editable") —
      // reverses the 25 Aug "fully locked, not Sanity-editable" call
      // this list used to note here (see productCategoryType.ts's own
      // comment for the full reversal). Ordered by each document's own
      // `order` field — `S.documentTypeListItem` alone sorts
      // alphabetically by default, which would scramble the intended
      // grid sequence (knit tees, then Woven Shirt, then Sweatshirt).
      S.listItem()
        .title("Product Categories")
        .child(
          S.documentTypeList("productCategory")
            .title("Product Categories")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.divider(),
      // Title label fixed to match the Blog page's own naming, 31 Aug
      // 2026 (owner, looking at Studio: "why does it still say
      // articles, not very clear") — the individual document type
      // itself was already relabeled "Blog Post" (see articleType.ts's
      // own comment), but this sidebar LIST label was missed in that
      // same pass — the schema `name` stays `article` either way (no
      // data migration needed), only Studio-facing labels change.
      S.documentTypeListItem("article").title("Blog"),
      S.divider(),
      // "Custom Section Media" and "Catalog" added 31 Aug 2026, same
      // pass as Product Categories above — see each schema's own file
      // for what it covers.
      S.listItem()
        .title("Custom Section Media")
        .child(
          S.document().schemaType("customSectionMedia").documentId("customSectionMedia"),
        ),
      S.listItem()
        .title("Catalog")
        .child(S.document().schemaType("catalog").documentId("catalog")),
    ]);
