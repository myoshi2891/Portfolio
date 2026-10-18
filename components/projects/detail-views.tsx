import type { ComponentType } from "react";
import type { FeaturedSlug } from "../../data/projects";
import { DocumentedProjectDetail } from "./documented-project-detail";
import { LlmStudiesSlideshow } from "./llm-studies-slideshow";
import { MedicalStudiesSlideshow } from "./medical-studies-slideshow";
import { MultiVendorDetail } from "./multi-vendor-detail";
import { MultiVendorSlideshow } from "./multi-vendor-slideshow";
import { WildOasisSlideshow } from "./wild-oasis-slideshow";

type DetailViews = { Gallery: ComponentType; Body: ComponentType };

// Components stay out of data/project-documentation.ts so build-time content checks run without React.
const views = {
  "multi-vendor-e-commerce": { Gallery: MultiVendorSlideshow, Body: MultiVendorDetail },
  "comparison-of-llms": { Gallery: LlmStudiesSlideshow, Body: () => <DocumentedProjectDetail slug="comparison-of-llms" /> },
  "medical-studies": { Gallery: MedicalStudiesSlideshow, Body: () => <DocumentedProjectDetail slug="medical-studies" /> },
  "the-wild-oasis-for-admin": { Gallery: WildOasisSlideshow, Body: () => <DocumentedProjectDetail slug="the-wild-oasis-for-admin" /> },
} satisfies Record<FeaturedSlug, DetailViews>;

export const detailViews: Readonly<Record<string, DetailViews>> = views;
