import type { ReactNode } from "react";
import { SiteLink } from "../ui/site-link";

type CuratedReference = { label: string; path: string; href: string; reason: string; detail: string };

const commit = "d3e23c65325a3f8ee263c3417e781f4c2d714611";
const repo = `https://github.com/myoshi2891/The-Wild-Oasis-For-Admin/blob/${commit}`;

const references = {
  features: [
    { label: "チェックイン処理", path: "src/features/check-in-out/useCheckin.ts:L24–L39", href: `${repo}/src/features/check-in-out/useCheckin.ts#L24-L39`, reason: "フロントデスクの日次業務を代表する状態更新だから。", detail: "予約をchecked-in・支払済みに更新し、関連キャッシュを無効化して画面遷移する流れを確認できます。" },
    { label: "客室と画像の保存", path: "src/services/apiCabins.ts:L44–L95", href: `${repo}/src/services/apiCabins.ts#L44-L95`, reason: "データベースとStorageをまたぐ客室管理の中心処理だから。", detail: "客室レコードの作成と画像アップロード、失敗時の後処理までを追えます。" },
    { label: "期間別予約の取得", path: "src/features/dashboard/useRecentBookings.ts", href: `${repo}/src/features/dashboard/useRecentBookings.ts`, reason: "7・30・90日のダッシュボード集計の入口だから。", detail: "URLで選んだ期間を、売上集計に使う予約データの取得条件へ接続する構成を確認できます。" },
  ],
  architecture: [
    { label: "アプリの構成点", path: "src/App.tsx:L30–L69", href: `${repo}/src/App.tsx#L30-L69`, reason: "ルート、状態管理、認証ガードの接続を一箇所で確認できるため。", detail: "React Query、ダークモード、通知、保護ルートをSPAへ組み込む構成を確認できます。" },
    { label: "認証ルートガード", path: "src/ui/ProtectedRoute.tsx", href: `${repo}/src/ui/ProtectedRoute.tsx`, reason: "内部スタッフ専用画面のアクセス境界だから。", detail: "認証情報の読込中、未認証、認証済みの三状態を分け、未認証時にログインへ戻す処理を確認できます。" },
    { label: "予約API層", path: "src/services/apiBookings.ts:L183–L195", href: `${repo}/src/services/apiBookings.ts#L183-L195`, reason: "機能フックとSupabaseを分離するサービス境界を代表するため。", detail: "予約IDを条件に更新し、更新後の予約レコードを返すデータアクセス処理を確認できます。" },
  ],
  decisions: [
    { label: "依存関係と実行条件", path: "package.json:L19–L31", href: `${repo}/package.json#L19-L31`, reason: "React・Supabase・状態管理など主要技術の根拠になるため。", detail: "管理画面を構成するランタイム依存関係と、フロントエンド中心の技術選定を確認できます。" },
    { label: "Supabase接続", path: "src/services/supabase.ts", href: `${repo}/src/services/supabase.ts`, reason: "自前APIサーバーを持たない構成の外部接続点だから。", detail: "認証・PostgreSQL・Storageへ各サービスが接続する共通クライアントの初期化を確認できます。" },
    { label: "客室保存のロールバック", path: "src/services/apiCabins.ts:L44–L95", href: `${repo}/src/services/apiCabins.ts#L44-L95`, reason: "複数の外部更新が失敗した場合の扱いを示すため。", detail: "客室レコードを先に保存し、新規作成時に画像アップロードが失敗した場合は作成したレコードの削除を試みる補償処理を確認できます。" },
  ],
  quality: [
    { label: "Vitest構成", path: "vite.config.ts:L1–L16", href: `${repo}/vite.config.ts#L1-L16`, reason: "単体・結合テストの実行環境と対象範囲を示すため。", detail: "jsdomを使うVitest構成と、E2Eシナリオを単体テスト対象から分ける設定を確認できます。" },
    { label: "サービス層テスト", path: "src/services/__tests__/services.test.ts:L1–L24", href: `${repo}/src/services/__tests__/services.test.ts#L1-L24`, reason: "Supabase境界に対するテストの実体を確認できるため。", detail: "予約詳細・更新・削除など、サービス関数を対象にしたテストの構成を確認できます。" },
    { label: "認証E2E", path: "e2e/authentication.spec.ts:L1–L28", href: `${repo}/e2e/authentication.spec.ts#L1-L28`, reason: "保護された管理画面へ入る主要経路を代表するため。", detail: "ログインをブラウザから検証するPlaywrightシナリオを確認できます。" },
  ],
  evidence: [
    { label: "アプリ全体の入口", path: "src/App.tsx:L30–L69", href: `${repo}/src/App.tsx#L30-L69`, reason: "認証、ルーティング、状態管理を束ねる全体構成の中心だから。", detail: "スタッフ向けSPAの画面構成と共通プロバイダーを確認できます。" },
    { label: "予約のデータ処理", path: "src/services/apiBookings.ts:L183–L195", href: `${repo}/src/services/apiBookings.ts#L183-L195`, reason: "予約運用の主要な書き込み処理を代表するため。", detail: "Supabase上の予約状態を更新し、更新結果を返す処理を確認できます。" },
    { label: "客室と画像の保存", path: "src/services/apiCabins.ts:L44–L95", href: `${repo}/src/services/apiCabins.ts#L44-L95`, reason: "客室管理とStorage連携を一つの処理で追えるため。", detail: "客室データ、画像アップロード、失敗時のクリーンアップを確認できます。" },
  ],
} as const satisfies Record<string, readonly CuratedReference[]>;

const stack = [
  ["UI", "React 19 / TypeScript strict", "スタッフ向けSPAと型安全な画面実装"],
  ["Routing", "React Router 8", "保護ルートと画面遷移"],
  ["Server state", "TanStack Query 5", "取得・更新・キャッシュ無効化"],
  ["Forms & styles", "React Hook Form / styled-components", "入力管理と共通UI"],
  ["Backend", "Supabase", "Authentication / PostgreSQL / Storage"],
  ["Quality", "Vitest / Testing Library / Playwright", "単体・結合・E2E検証"],
] as const;

export const wildOasisDetailSections = [
  { id: "overview", label: "概要" }, { id: "features", label: "主な機能" },
  { id: "architecture", label: "アーキテクチャ" }, { id: "decisions", label: "構成と制約" },
  { id: "quality", label: "品質と未検証の範囲" }, { id: "evidence", label: "参照コード" },
] as const;

function SectionLead({ number, children }: { number: string; children: ReactNode }) {
  return <p className="detail-section-lead"><span>{number}</span>{children}</p>;
}

function CuratedReferences({ items }: { items: readonly CuratedReference[] }) {
  return <div className="curated-references"><h3>このセクションの参照コード</h3><p>役割と確認できる振る舞いが異なる3件までに絞っています。</p>
    <ol>{items.slice(0, 3).map((item, index) => <li key={item.path}>
      <div className="reference-heading"><span>{String(index + 1).padStart(2, "0")}</span><SiteLink href={item.href}>{item.label}<b aria-hidden="true">↗</b></SiteLink></div>
      <code>{item.path}</code><dl><div><dt>選定理由</dt><dd>{item.reason}</dd></div><div><dt>具体的に確認できること</dt><dd>{item.detail}</dd></div></dl>
    </li>)}</ol>
  </div>;
}

export function WildOasisDetail() {
  return <>
    <section id="features">
      <SectionLead number="01">Main features</SectionLead>
      <h2>ホテルの日次業務を、1つの管理画面へ</h2>
      <p className="section-intro">フロントデスクと管理者が、客室・予約・ゲスト情報、チェックイン／アウト、売上と稼働率を同じ認証済みSPAで扱う内部業務ダッシュボードです。</p>
      <div className="wild-role-grid">
        <article><p className="eyebrow">FRONT DESK</p><h3>到着・出発を処理する</h3><p>本日の対象者を確認し、支払いと朝食オプションを含むチェックイン、チェックアウトを進めます。</p><strong>DAILY</strong><span>到着・出発・支払確認</span></article>
        <article><p className="eyebrow">OPERATIONS</p><h3>予約と客室を管理する</h3><p>予約の絞り込み・並べ替え・ページ送りと、客室情報や料金、割引、画像の更新を行います。</p><strong>CRUD</strong><span>予約・客室・設定</span></article>
        <article><p className="eyebrow">MANAGEMENT</p><h3>運営状況を把握する</h3><p>7・30・90日の期間を切り替え、売上、チェックイン数、稼働率、滞在日数の分布を確認します。</p><strong>7 / 30 / 90</strong><span>期間別ダッシュボード</span></article>
      </div>
      <article className="feature-story wild-feature"><div className="feature-heading"><span className="feature-number">01</span><h3>予約状態を業務アクションとして更新</h3></div>
        <p>チェックインでは予約ステータスを <code>checked-in</code>、支払状態を完了へ更新し、必要に応じて朝食情報も保存します。成功後は一覧と詳細のキャッシュを無効化し、最新状態へ揃えます。</p>
        <div className="feature-reason"><h4>この機能を取り上げる理由</h4><p>スタッフの操作、サーバー状態、Supabaseの更新、画面遷移まで、日次業務の主要なデータフローを一つの処理で追えるためです。</p></div>
      </article>
      <article className="feature-story wild-feature"><div className="feature-heading"><span className="feature-number">02</span><h3>客室データと画像をまとめて管理</h3></div>
        <p>客室の作成・編集・削除に加え、Supabase Storageへ画像を保存します。レコードを先に保存してから画像をアップロードし、新規作成時にアップロードが失敗した場合は作成したレコードの削除を試みて、不整合を残しにくくします。</p>
        <div className="feature-reason"><h4>この機能を取り上げる理由</h4><p>PostgreSQLのレコードとStorage上のファイルという、異なる保存先を扱う際の責務と失敗時の考慮が表れるためです。</p></div>
      </article>
      <CuratedReferences items={references.features} />
    </section>

    <section id="architecture">
      <SectionLead number="02">Architecture</SectionLead>
      <h2>画面・サーバー状態・Supabaseを層で分ける</h2>
      <p className="section-intro">React Routerが画面遷移と認証境界を担い、機能モジュール内のカスタムフックがReact Queryを通じてサービス層を呼び出します。自前APIサーバーは置かず、Authentication・PostgreSQL・StorageをSupabaseへ集約しています。</p>
      <figure className="system-flow"><figcaption>スタッフ操作からデータ保存までの責務</figcaption><ol>
        <li><span>01</span><strong>Protected route</strong><small>認証状態を確認</small></li>
        <li><span>02</span><strong>Page / UI</strong><small>業務操作を受付</small></li>
        <li><span>03</span><strong>Feature hooks</strong><small>状態と副作用を調整</small></li>
        <li><span>04</span><strong>React Query</strong><small>取得・更新・再検証</small></li>
        <li><span>05</span><strong>Supabase services</strong><small>Auth・DB・Storage</small></li>
      </ol></figure>
      <figure className="wild-flow"><figcaption>予約チェックインのデータフロー</figcaption><ol>
        {[['操作', 'CheckinBooking'], ['Mutation', 'useCheckin'], ['更新', 'updateBooking'], ['永続化', 'Supabase'], ['再検証', 'invalidateQueries'], ['遷移', 'Dashboard']].map(([label, detail], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><small>{detail}</small></li>)}
      </ol></figure>
      <CuratedReferences items={references.architecture} />
    </section>

    <section id="decisions">
      <SectionLead number="03">Structure & constraints</SectionLead>
      <h2>運用の前提を、実装の境界として明示する</h2>
      <p className="section-intro">内部スタッフ専用、Supabaseを直接利用、bunで実行、TypeScript strictという前提を置き、画面・機能・サービスの責務を分離しています。</p>
      <div className="reading-table-wrap"><table className="reading-table stack-table"><caption>技術と責務</caption><thead><tr><th scope="col">レイヤー</th><th scope="col">技術</th><th scope="col">役割</th></tr></thead><tbody>
        {stack.map(([layer, tech, role]) => <tr key={layer}><th scope="row">{layer}</th><td>{tech}</td><td>{role}</td></tr>)}
      </tbody></table></div>
      <div className="constraint-grid wild-constraints">
        <article><span>01</span><h3>スタッフのみ利用</h3><p>一般公開のサインアップ導線は設けず、認証済みスタッフだけが業務画面へ進みます。</p></article>
        <article><span>02</span><h3>BaaSへ直接接続</h3><p>独自APIサーバーを持たず、認証・DB・画像StorageをSupabaseへ委ねます。</p></article>
        <article><span>03</span><h3>キャッシュは都度再検証</h3><p>React QueryのstaleTimeは原則0とし、更新後は関係するquery keyを無効化します。</p></article>
        <article><span>04</span><h3>実行環境を固定</h3><p>bunを必須とし、Node.js 22.22以上とTypeScript strictを前提にします。</p></article>
      </div>
      <p className="limitation">RLSはSupabaseダッシュボード側で管理され、リポジトリ内に定義ファイルがありません。そのため、このページからポリシーの実効性を直接検証することはできません。</p>
      <CuratedReferences items={references.decisions} />
    </section>

    <section id="quality">
      <SectionLead number="04">Quality & boundaries</SectionLead>
      <h2>テストの配置と、コードだけでは保証できない範囲</h2>
      <p className="section-intro">以下は2026年9月18日作成の技術ドキュメントに記録されたリポジトリ調査値です。カバレッジ実測や、このポートフォリオでの再実行結果ではありません。</p>
      <div className="quality-metrics wild-quality"><div><strong>71</strong><span>Test files</span><small>*.test.ts(x) / 資料記録</small></div><div><strong>8</strong><span>E2E specs</span><small>Playwright / e2e</small></div><div><strong>strict</strong><span>Type checking</span><small>unused checks enabled</small></div></div>
      <div className="quality-columns"><article><p className="eyebrow">DOCUMENTED COVERAGE</p><h3>リポジトリで確認した構成</h3><ul><li>機能フックと主要コンポーネントのVitest</li><li>サービス層とドメイン型のテスト</li><li>認証・予約・客室・設定など8領域のE2E</li><li>警告を許容しないESLint設定</li></ul></article>
        <article className="boundary-card"><p className="eyebrow">NOT YET GUARANTEED</p><h3>未検証・残る境界</h3><ul><li>RLSポリシーの実効性</li><li>UIプリミティブの一部に直接テストなし</li><li>予約一覧クエリ構築のサービス単体テスト</li><li>アバター後処理失敗時の孤立ファイル</li><li>正確なカバレッジ数値</li></ul></article></div>
      <p className="limitation"><code>useSettings</code> の取得キーと <code>useUpdateSetting</code> の無効化キーには、資料上 <code>setting</code> / <code>settings</code> の不一致が記録されています。設定更新後の同期は継続確認が必要です。</p>
      <CuratedReferences items={references.quality} />
    </section>

    <section id="evidence">
      <SectionLead number="05">Selected references</SectionLead><h2>参照コード</h2>
      <p className="section-intro">ページ内容の基準は2026年9月18日作成の技術ドキュメントです。コードリンクは、ポートフォリオ側で別途確認した固定コミットを使用しています。</p>
      <div className="audit-note"><p>資料作成日：<time dateTime="2026-09-18">2026年9月18日</time><br />コード確認日：<time dateTime="2026-09-16">2026年9月16日</time><br />監査対象：<SiteLink href={`https://github.com/myoshi2891/The-Wild-Oasis-For-Admin/tree/${commit}`}><code>{commit.slice(0, 12)}</code></SiteLink></p></div>
      <CuratedReferences items={references.evidence} />
    </section>
  </>;
}
