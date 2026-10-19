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
export type Claim<E extends string = string> = { text: string; evidenceIds: NonEmpty<E> };
type Entry<E extends string> = {
  id: RepositoryId; name: string; title: string; description: Claim<E>;
  githubUrl: `https://github.com/${string}`; order: number;
};
export type Project<E extends string = string> = Entry<E> & {
  technologies: readonly Claim<E>[]; highlights: readonly Claim<E>[];
} & ({ type: 'featured'; slug: string } | { type: 'secondary'; slug?: never });
export type Study<E extends string = string> = Entry<E> & {
  type: 'study'; topics: NonEmpty<string>;
};
export type Portfolio = {
  projects: Project[]; studies: Study[];
  documentation: Record<string, ProjectDocumentation>;
  evidence: Record<string, VerifiedEvidence>;
};

export type MarkdownDocument = {
  contentPath: string;
  imageDirectory: string;
  diagrams: readonly string[];
};

export type DetailSection = { id: string; label: string };
// A featured project's detail page: its Markdown body, contents navigation and page styling.
export type ProjectDocumentation = MarkdownDocument & {
  sections: readonly [{ id: 'overview'; label: string }, ...DetailSection[]];
  pageClassName: string;
  // ISO date (YYYY-MM-DD) shown as the page's last update and used as the sitemap lastModified.
  updatedAt: string;
};
