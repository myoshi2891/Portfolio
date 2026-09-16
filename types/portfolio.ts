export type RepositoryId = 'R01' | 'R02' | 'R03' | 'R04' | 'R05' | 'R06' | 'R07' | 'R08' | 'R09' | 'R10' | 'R11' | 'R12' | 'R13';
export type NonEmpty<T> = readonly [T, ...T[]];
export type HttpsUrl = `https://${string}`;
export type VerifiedEvidence = {
  sourceType: 'REPOSITORY_VERIFIED'; status: 'VERIFIED'; repoId: RepositoryId;
  auditId: string; checkedAt: string; commit: string;
  sources: NonEmpty<{ label: string; url: HttpsUrl }>;
} | {
  sourceType: 'USER_PROVIDED'; status: 'VERIFIED'; sourceLocation: string; checkedAt: string;
};
export type Limitation = {
  repoId: RepositoryId; auditId: string;
  status: 'NOT_FOUND' | 'NOT_VERIFIED' | 'NOT_APPLICABLE' | 'INSPECTION_UNAVAILABLE';
  sourceType: 'USER_PROVIDED' | 'REPOSITORY_VERIFIED' | 'INFERRED' | 'UNVERIFIED'; text: string;
};
export type Claim<E extends string = string> = { text: string; evidenceIds: NonEmpty<E> };
type Entry<E extends string> = {
  id: RepositoryId; name: string; title: string; description: Claim<E>;
  githubUrl: `https://github.com/${string}`; order: number;
};
export type Project<E extends string = string> = Entry<E> & {
  technologies: readonly Claim<E>[]; highlights: readonly Claim<E>[];
} & ({ type: 'featured'; slug: string } | { type: 'secondary'; slug?: never });
export type Study<E extends string = string> = Entry<E> & {
  type: 'study'; topics: NonEmpty<string>; implementationNotes: readonly Claim<E>[];
};
export type DetailSectionId = 'features' | 'architecture' | 'decisions' | 'quality';
export type ProjectDetail<E extends string = string, L extends string = string> = {
  sections: Record<DetailSectionId, { claims: readonly Claim<E>[]; limitationIds: readonly L[] }>;
  scope?: NonEmpty<Claim<E>>;
};
export type Portfolio = {
  projects: Project[]; studies: Study[];
  details: Record<string, ProjectDetail>;
  evidence: Record<string, VerifiedEvidence>; limitations: Record<string, Limitation>;
};
