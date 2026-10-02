import { DocumentedProjectDetail } from "./documented-project-detail";
import { documentedDetailSections } from "../../data/project-documentation";

export const medicalDetailSections = documentedDetailSections;

export function MedicalStudiesDetail() {
  return <DocumentedProjectDetail slug="medical-studies" />;
}
