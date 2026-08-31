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
      // No "Products" document type — the Products page is a fixed,
      // code-level 6-category grid (KIBO_Brand_and_Copy_Direction.md,
      // "Products grid" section, fully locked 25 Aug 2026), not
      // Sanity-editable content.
      S.documentTypeListItem("article").title("Articles"),
    ]);
