"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { projectId, dataset, apiVersion } from "@/sanity/env";

// Embedded Studio, mounted at /studio (see src/app/studio). Requires a
// real Sanity project — see PROJECT-SUMMARY.md for how to connect one.
export default defineConfig({
  name: "kibo",
  title: "KIBO",
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  basePath: "/studio",
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool()],
});
