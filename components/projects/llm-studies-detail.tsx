import { DocumentedProjectDetail } from "./documented-project-detail";
import { documentedDetailSections } from "../../data/project-documentation";

export const llmDetailSections = documentedDetailSections;

export function LlmStudiesDetail() {
  return <DocumentedProjectDetail slug="comparison-of-llms" />;
}
