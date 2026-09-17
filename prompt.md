> 現在地（2026-09-17）: ユーザー依頼によりPhase 4の残作業とブラッシュアップを実施。提供画像7枚・公開URL7件の掲載、実画面のCSS 3Dヒーロー、内部リンクのSPA遷移、スムーズスクロール、OS連動ダークテーマ、モバイル・目次・履歴復元の改善を含む。現在の仕様と検証範囲は[引き継ぎ](docs/phase-4-handoff.md)と[デザイン更新記録](docs/design-refresh.md)を参照。

# AI Engineering Portfolio — Master Prompt

## 0. PROJECT OBJECTIVE

GitHub上の個人リポジトリを主軸とした、洗練されたエンジニアリング・ポートフォリオWebサイトを設計・実装してください。

このサイトの目的は、単なる「GitHubリンク集」を作ることではありません。

以下の技術領域を横断して、

- Software Engineering
- Software Architecture
- AI / LLM
- Medical / Healthcare
- Cloud Infrastructure
- Security
- Quality Assurance
- Algorithms / Data Structures
- Project Management

を体系的に学習し、実際のソフトウェアとして実装・検証していることを伝える、

**Engineering Identity**

を構築することが目的です。

---

# 1. CORE POSITIONING

サイト全体の基本思想：

> **Learn → Build → Engineer → Improve**

また、情報設計上は以下の3つの柱を中心に構成してください。

### BUILD
Products & Applications

実際に設計・実装したWebアプリケーションやプロダクト。

### STUDY
Research & Knowledge

AI、Healthcare、Cloud、Algorithmsなどの体系的な学習・研究。

### ENGINEER
Architecture, Quality & Security

Software Architecture、QA、Security、Testing、Performanceなど、ソフトウェアを「作る」だけでなく「良くする」ための知識。

ただし、この3分類をユーザーにそのまま押し付ける必要はありません。

閲覧者が意味を直感的に理解できるよう、

- BUILD — Products & Applications
- STUDY — Research & Knowledge
- ENGINEER — Architecture, Quality & Security

のように補足説明を適切に表示してください。

---

# 2. PRIMARY GOAL

閲覧者が最初の30秒以内に以下を理解できることを最優先します。

1. Who is this person?
2. What does this person build?
3. What technical domains does this person work across?
4. What makes this engineer different?
5. Where can I inspect the actual work?

トップページは特に採用担当者・Hiring Managerにも理解しやすくしてください。

一方、Project DetailではSenior Engineer / Tech Lead / CTOなどの技術者がArchitectureやTechnical Decisionsまで確認できる情報設計にしてください。

---

# 3. AUDIENCE

主な閲覧者：

### Primary

- Recruiters
- Hiring Managers
- Engineering Managers
- CTOs

### Secondary

- Senior Engineers
- Tech Leads
- Software Architects
- AI Engineers
- Healthcare / Medical Technology professionals

そのため、

**Top Page = Fast comprehension**

**Project Detail = Technical depth**

という二層構造を基本方針としてください。

---

# 4. NON-NEGOTIABLE DECISION PRINCIPLES

AIが設計・実装中に判断に迷った場合、必ず以下の優先順位に従ってください。

### 1. Fact > Inference

確認された事実を推測より優先する。

### 2. Evidence > Assumption

証拠のない技術情報を生成しない。

### 3. Content Hierarchy > Decoration

装飾より情報階層を優先する。

### 4. Usability > Novelty

斬新なギミックより使いやすさを優先する。

### 5. Maintainability > Technical Complexity

必要以上に複雑な実装を避ける。

### 6. Performance > Animation

アニメーションよりPerformanceを優先する。

### 7. Accessibility > Visual Effects

視覚効果よりAccessibilityを優先する。

### 8. Curated Portfolio Metadata > Raw GitHub Metadata

Portfolio側で管理する意図的なメタデータを正とし、GitHub APIの生データは補助情報として扱う。

---

# 5. HALLUCINATION PREVENTION POLICY

Portfolioに掲載する技術情報について、確認できない情報を推測で補完することを禁止します。

以下は特に捏造禁止：

- Framework
- Programming Language
- Library
- Database
- Authentication
- API
- Cloud Infrastructure
- CI/CD
- Architecture Pattern
- Design Pattern
- Testing Framework
- Test Coverage
- Performance Metrics
- User Numbers
- Business Impact
- Revenue
- Team Size
- Responsibilities
- Production Status
- Deployment Platform
- Security Features

確認できない場合は、以下のいずれかとして扱ってください。

- VERIFIED
- NOT_FOUND
- NOT_VERIFIED
- NOT_APPLICABLE
- INSPECTION_UNAVAILABLE

不明な情報を無理に埋めないことを優先してください。

---

# 6. SOURCE CLASSIFICATION

すべての重要な技術情報について、可能な限り情報源を区別してください。

### USER_PROVIDED

ユーザーが明示的に提供した情報。

### REPOSITORY_VERIFIED

実際のRepositoryのファイル、コード、設定などから確認できた情報。

### INFERRED

複数の情報から推論した情報。

### UNVERIFIED

確認できなかった情報。

Portfolioの技術的事実として使用できるのは、

**USER_PROVIDED**

または

**REPOSITORY_VERIFIED**

のみとしてください。

INFERRED / UNVERIFIEDの情報を、Verified Factとして使用してはいけません。

---

# 7. EVIDENCE HIERARCHY

Repositoryを調査できる場合、可能な限り以下の優先順位で情報を検証してください。

1. Source Code
2. package.json / lockfile
3. Configuration files
4. Test files
5. README / Documentation
6. Screenshots
7. Repository metadata

上位の証拠と下位の証拠が矛盾する場合、上位の証拠を優先してください。

READMEに記載されているだけで、実装されているとは判断しないでください。

---

# 8. GITHUB ACCESS FALLBACK

GitHub Repositoryを直接閲覧できない場合、推測で補完してはいけません。

以下の状態を明示してください。

`INSPECTION_UNAVAILABLE`

その場合、ユーザーが提供する

`github_evidence.txt`

などのローカル抽出データをEvidenceとして使用してください。

ローカルデータにも存在しない情報については推測しないでください。

---

# 9. REPOSITORIES

現在の分析対象Repositoryは以下の13件です。

### Products / Applications

1. https://github.com/myoshi2891/Multi-Vendor-E-Commerce
2. https://github.com/myoshi2891/The-Wild-Oasis-For-Admin
3. https://github.com/myoshi2891/The-Wild-Oasis-For-User
4. https://github.com/myoshi2891/AirbnbCloneApp
5. https://github.com/myoshi2891/Next-Store

### AI / Research / Studies

6. https://github.com/myoshi2891/Comparison-of-LLMs
7. https://github.com/myoshi2891/Quality-Assurance-Studies
8. https://github.com/myoshi2891/Software-Design-and-Architecture
9. https://github.com/myoshi2891/Management-Team-Building-Studies
10. https://github.com/myoshi2891/Cloud-Infrastructure-and-Network-Studies
11. https://github.com/myoshi2891/Security_Studies
12. https://github.com/myoshi2891/Medical-Studies
13. https://github.com/myoshi2891/Algorithm-DataStructures-Math-SQL

このリストを現在のPortfolio対象としてください。

---

# 10. PHASED EXECUTION PROTOCOL

このプロジェクトは一度に完成させないでください。

以下のPhaseを順番に実行してください。

---

# PHASE 0 — REPOSITORY EVIDENCE AUDIT

## Objective

このPhaseの目的は、

**「何が事実として確認できるのか」**

を確定することです。

このPhaseでは以下を生成してはいけません。

- UI
- CSS
- React
- Next.js code
- Wireframe
- Branding
- Hero Copy
- Marketing Copy
- Featured Ranking
- Final Portfolio Positioning

---

## 0-1. Repository Identity

各Repositoryについて確認：

- Repository name
- Description
- Repository type
- README availability

---

## 0-2. Technology

可能な範囲で確認：

- Languages
- Frameworks
- Libraries
- Runtime
- Package manager

---

## 0-3. Architecture

確認できる場合のみ：

- Directory structure
- Architecture
- API
- Database
- Authentication
- External services

---

## 0-4. Features

実際に実装されていることを確認できた主要機能を記録。

---

## 0-5. Quality

確認できる場合：

- Tests
- Test framework
- Linting
- Formatting
- Type checking
- CI/CD

---

## 0-6. Deployment

確認できる場合：

- Hosting
- Deployment configuration
- Production URL

---

## 0-7. Evidence Matrix

以下の形式で出力：

| Repository | Type | Fact | Source | Evidence Location | Source Type | Status | Confidence |
|---|---|---|---|---|---|---|---|

Confidence：

- High
- Medium
- Low

ただし、ConfidenceがLowだからといって推測情報をVerifiedとして扱ってはいけません。

---

## 0-8. Repository Summary

各Repositoryについて、

- Verified Technologies
- Verified Features
- Verified Architecture
- Verified Quality
- Verified Deployment

を整理。

---

## 0-9. Missing Information

以下を区別：

- NOT_FOUND
- NOT_VERIFIED
- NOT_APPLICABLE
- INSPECTION_UNAVAILABLE

---

## 0-10. Phase 0 Completion Criteria

Phase 0は以下を満たした場合のみ完了とします。

- 13 repositories are accounted for.
- Every technical claim has a source classification.
- Unverified information is clearly marked.
- No inferred technical information is presented as fact.
- Inspection failures are explicitly identified.
- No UI or marketing claims are generated.

Phase 0終了後、停止してください。

ユーザーの承認なしにPhase 1へ進まないでください。

---

# PHASE 1 — PORTFOLIO STRATEGY & INFORMATION ARCHITECTURE

Phase 0の承認後に開始してください。

ここで初めて、

**「何を見せるべきか」**

を決定します。

---

## 1-1. Portfolio Positioning

13 repositoriesのEvidenceを根拠として、

- Engineering Identity
- Differentiation
- Core Domains
- Primary Strengths

を提案してください。

ただし、事実から逸脱した肩書きや専門性を勝手に付与しないでください。

---

## 1-2. Portfolio Hierarchy

13 repositoriesを以下のように分類してください。

### Featured Works

3〜5件。

選定基準：

- Technical Complexity
- Product Completeness
- Architecture Depth
- Demonstrability
- Originality
- Documentation Quality

各項目を5段階で評価し、選定理由を説明してください。

### Knowledge & Deep Studies

体系的な研究・学習。

### Archive / Secondary

Portfolio上で優先度の低いProject。

---

## 1-3. Information Architecture

基本構造：

Home

- Hero
- Selected Work
- Engineering Domains
- Build / Study / Engineer
- Selected Studies
- Engineering Philosophy
- GitHub
- Contact

ただし、より良い構造がある場合は変更してください。

---

## 1-4. User Flow

以下のユーザーを想定：

Recruiter
Hiring Manager
Engineer
CTO

各ユーザーが、

Landing
→ Understanding
→ Evidence
→ Deep Dive
→ GitHub / Contact

へ自然に進めるUXを設計してください。

---

## 1-5. Project Detail Strategy

すべてのRepositoryに詳細ページを作らないでください。

Featured Projectsのみ、

`/projects/[slug]`

の詳細ページを検討してください。

Secondary Projects / Studiesは、

- Card
- Drawer
- Modal
- Expandable section

などで十分か評価してください。

---

# PHASE 2 — CONTENT & DESIGN SYSTEM

Phase 1承認後に開始してください。

---

## 2-1. Content Strategy

各セクションについて、

- Purpose
- Information
- Priority
- CTA

を定義してください。

---

## 2-2. Visual Direction

目標：

- Minimal
- Elegant
- Technical
- Editorial
- Professional
- High information clarity

参考思想：

- Linear
- Vercel
- Stripe
- Raycast
- Apple

ただし、既存サイトのコピーやデザインを模倣しないでください。

---

## 2-3. Color

基本：

- Off-white
- Near Black
- Gray scale

Accentは1色まで。

禁止：

- Excessive gradients
- Neon-heavy UI
- Decorative particles
- Gratuitous 3D
- Excessive glassmorphism

---

## 2-4. Typography

候補：

- Geist
- Inter
- Noto Sans JP

日本語・英語の双方で可読性を確保してください。

---

## 2-5. Spacing & Grid

一貫したSpacing SystemとGrid Systemを定義してください。

---

## 2-6. Component System

必要に応じて：

- Navigation
- Button
- Badge
- ProjectCard
- StudyCard
- DomainCard
- SectionHeader
- FilterBar
- Drawer
- Modal
- Footer

などを設計してください。

---

# PHASE 3 — TECHNICAL ARCHITECTURE

Phase 2承認後に開始してください。

推奨：

- Next.js
- App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

ただし、必要性を検証した上で採用してください。

---

## 3-1. Data Architecture

Portfolio側をPrimary Source of Truthとします。

例：

`data/projects.ts`

`data/studies.ts`

GitHub APIはOptional Enrichmentとします。

取得候補：

- Stars
- Forks
- Languages
- Updated date

GitHub APIが失敗してもPortfolioは正常動作しなければなりません。

---

## 3-2. Type Safety

静的Portfolio Dataについては、過剰な依存関係を避けてください。

必要性がない限り、単純なTypeScript型と、

`satisfies`

などのcompile-time validationを優先してください。

Zodなどのruntime validationは、外部入力やAPIレスポンスなど、本当に必要な場所に限定してください。

---

## 3-3. Project Model

最低限、

- slug
- name
- type
- title
- description
- technologies
- highlights
- githubUrl
- featured
- status
- order

などを検討してください。

実際に必要なフィールドだけを採用してください。

---

# PHASE 4 — IMPLEMENTATION

Phase 3承認後に開始してください。

Production-readyを目標に実装してください。

---

## Requirements

### Responsive

- Desktop
- Tablet
- Mobile

### Accessibility

- Semantic HTML
- Keyboard navigation
- Focus states
- ARIA where necessary
- Contrast
- Reduced motion

### Performance

- Server Components where appropriate
- Image optimization
- Minimal JavaScript
- Lazy loading
- Code splitting where appropriate

### SEO

- Metadata
- Open Graph
- sitemap
- robots.txt
- Semantic HTML

---

# PHASE 5 — QUALITY AUDIT

実装完了後、完成宣言する前に自己監査してください。

---

## Visual QA

確認：

- Alignment
- Spacing
- Typography
- Responsive behavior
- Visual hierarchy
- Consistency

---

## UX QA

確認：

- Can a recruiter understand the profile within 30 seconds?
- Can a technical reviewer reach project details quickly?
- Are Featured Projects clearly prioritized?
- Are CTAs obvious?
- Is navigation intuitive?

---

## Technical QA

確認：

- TypeScript errors
- Build errors
- Runtime errors
- Console errors
- Broken links
- Missing images
- Invalid routes
- API failure behavior

---

## Accessibility QA

確認：

- Keyboard navigation
- Focus states
- Contrast
- Semantic structure
- Reduced motion

---

## Performance QA

可能な範囲で確認：

- Lighthouse Performance
- LCP
- CLS
- INP
- Bundle size
- Unnecessary client-side JavaScript

実測値がない場合、数値を捏造しないでください。

---

# 11. DESIGN QUALITY BAR

以下の状態を「完成」とみなさないでください。

- Generic developer portfolio
- Template-like design
- Repository list with cards only
- Excessive gradients
- Excessive animation
- Decorative 3D
- Excessive glassmorphism
- Too many technology logos
- Too much information above the fold
- Weak typography
- Poor mobile layout
- Unclear hierarchy
- AI-generated marketing language without evidence

---

# 12. DECISION RULES DURING IMPLEMENTATION

以下の状況では、

### If decoration conflicts with readability:
Choose readability.

### If animation conflicts with performance:
Choose performance.

### If complexity conflicts with maintainability:
Choose maintainability.

### If novelty conflicts with usability:
Choose usability.

### If GitHub metadata conflicts with curated portfolio metadata:
Choose curated portfolio metadata.

### If information is missing:
Do not invent it.

### If two design directions are equally valid:
Choose the simpler one.

---

# 13. CONTENT INTEGRITY

Portfolio上の文章についても、技術的事実を捏造しないでください。

例えば、

「Production-ready」
「Enterprise-grade」
「Scalable architecture」
「High performance」
「Secure architecture」

などの表現は、Evidenceがある場合のみ使用してください。

Evidenceがない場合は、より中立的な表現にしてください。

---

# 14. FINAL ACCEPTANCE CRITERIA

最終的なPortfolioは、以下を満たすこと。

### Identity

- Clear Engineering Identity
- Clear differentiation
- No exaggerated claims

### UX

- 30-second comprehension
- Clear navigation
- Recruiter-friendly
- Engineer-friendly

### Content

- Featured Projects clearly prioritized
- Studies clearly organized
- Technical information traceable to evidence
- No fabricated information

### Design

- Minimal
- Elegant
- Technical
- Consistent
- Responsive

### Engineering

- Type-safe
- Maintainable
- Accessible
- SEO-ready
- Performant
- Production-oriented

---

# 15. EXECUTION CONTROL

重要：

**一度にすべてを実行しないでください。**

必ず以下の順番で進めてください。

```text
PHASE 0
Repository Evidence Audit
        ↓
USER APPROVAL
        ↓
PHASE 1
Portfolio Strategy & Information Architecture
        ↓
USER APPROVAL
        ↓
PHASE 2
Content & Design System
        ↓
USER APPROVAL
        ↓
PHASE 3
Technical Architecture
        ↓
USER APPROVAL
        ↓
PHASE 4
Implementation
        ↓
PHASE 5
Quality Audit