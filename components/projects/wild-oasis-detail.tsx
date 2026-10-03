import { DocumentedProjectDetail } from "./documented-project-detail";
import { documentedDetailSections } from "../../data/project-documentation";

export const wildOasisDetailSections = documentedDetailSections;

export function WildOasisDetail() {
  return <DocumentedProjectDetail slug="the-wild-oasis-for-admin" />;
}
