import type { ComponentType } from "react";
import type { FeaturedSlug } from "../../data/projects";
import { LlmStudiesSlideshow } from "./llm-studies-slideshow";
import { MedicalStudiesSlideshow } from "./medical-studies-slideshow";
import { MultiVendorSlideshow } from "./multi-vendor-slideshow";
import { WildOasisSlideshow } from "./wild-oasis-slideshow";

// Components stay out of data/project-documentation.ts so build-time content checks run without React.
const galleries = {
  "multi-vendor-e-commerce": MultiVendorSlideshow,
  "comparison-of-llms": LlmStudiesSlideshow,
  "medical-studies": MedicalStudiesSlideshow,
  "the-wild-oasis-for-admin": WildOasisSlideshow,
} satisfies Record<FeaturedSlug, ComponentType>;

export const detailGalleries: Readonly<Record<string, ComponentType>> = galleries;
