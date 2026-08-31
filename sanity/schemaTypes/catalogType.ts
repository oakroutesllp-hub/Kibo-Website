import { defineField, defineType } from "sanity";

// Catalog — singleton, 31 Aug 2026 (owner: "need to update catalog,
// where does the PDF go? Currently no place"). The Catalog page
// (`/catalog`) has always had a "Download Catalog" / "Download PDF"
// flow, but the actual PDF file itself had nowhere to live — the page
// only ever showed a placeholder card. This document is that missing
// place: once a real PDF is uploaded here, CatalogCtaSection.tsx serves
// it directly; until then, the page keeps showing its current
// placeholder exactly as before (see that component's own comment on
// the fallback).
export const catalogType = defineType({
  name: "catalog",
  title: "Catalog",
  type: "document",
  fields: [
    defineField({
      name: "pdf",
      title: "Catalog PDF",
      description:
        "The real product catalog, once your creative agency delivers it. Once uploaded, both \"Download Catalog\" and the preview card's \"Download PDF\" link straight to this file instead of showing the gray placeholder.",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "thumbnail",
      title: "Catalog cover thumbnail (optional)",
      description:
        "Shown in place of the gray placeholder card on the Catalog page — ideally the catalog's actual front cover. Leave empty to keep the placeholder even after the PDF above is uploaded.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { media: "thumbnail" },
    prepare({ media }) {
      return { title: "Catalog", media };
    },
  },
});
