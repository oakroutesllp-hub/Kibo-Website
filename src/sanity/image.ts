import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { projectId, dataset } from "./env";

const builder = createImageUrlBuilder({
  projectId: projectId || "placeholder",
  dataset,
});

export function urlForImage(source: Image) {
  return builder.image(source);
}
