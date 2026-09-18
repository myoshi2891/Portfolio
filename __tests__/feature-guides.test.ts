import { describe, expect, it } from "vitest";
import { featureGuides } from "../data/feature-guides";
import { evidence, type EvidenceId } from "../data/evidence";
import { projectDetails } from "../data/project-details";

describe("feature reading guides", () => {
  it("explains every featured claim and every linked source without orphaned notes", () => {
    const ids = Object.values(projectDetails).flatMap(d => d.sections.features.claims.flatMap(c => [...c.evidenceIds]));
    expect(Object.keys(featureGuides).sort()).toEqual([...new Set(ids)].sort());
    for (const id of ids) {
      const guide = featureGuides[id as EvidenceId]!;
      expect(guide.title.trim()).not.toBe("");
      expect(guide.reason.trim()).not.toBe("");
      expect(guide.steps.length).toBeGreaterThan(1);
      expect(Object.keys(guide.readings).sort()).toEqual(evidence[id].sources.map(s => s.label).sort());
      for (const note of Object.values(guide.readings)) expect(note.trim()).not.toBe("");
    }
  });
});
