import type { ReactNode } from "react";
import { SiteLink } from "../ui/site-link";

type CuratedReference = {
  label: string;
  path: string;
  href: string;
  reason: string;
  detail: string;
};

const commit = "94da3cf4dcf242794acceda9ec62e633b7491377";
const repo = `https://github.com/myoshi2891/Multi-Vendor-E-Commerce/blob/${commit}`;

const references = {
  features: [
    { label: "商品更新の境界", path: "src/queries/product.ts:L184–L238", href: `${repo}/src/queries/product.ts#L184-L238`, reason: "販売者の商品管理を代表する書き込み処理だから。", detail: "店舗・商品・バリアントを更新するServer Actionと、入力から永続化までの境界を確認できます。" },
    { label: "チェックアウトの入口", path: "src/components/store/cards/place-order.tsx:L31–L54", href: `${repo}/src/components/store/cards/place-order.tsx#L31-L54`, reason: "顧客の操作が注文作成へ接続する地点だから。", detail: "カートと配送先を注文処理へ渡し、決済へ進む画面側の流れを確認できます。" },
    { label: "注文作成処理", path: "src/queries/user.ts:L761–L815", href: `${repo}/src/queries/user.ts#L761-L815`, reason: "複数店舗の商品を注文へ変換する中心処理だから。", detail: "所有者を確認したカートから、トランザクション内で注文を組み立てる処理を追えます。" },
  ],
  architecture: [
    { label: "認可ガード", path: "src/lib/auth-guards.ts:L30–L111", href: `${repo}/src/lib/auth-guards.ts#L30-L111`, reason: "ロールと店舗所有権を一元検証する境界だから。", detail: "USER・ADMIN・SELLERの認証と、販売者が対象店舗を所有しているかの再検証を確認できます。" },
    { label: "データアクセス", path: "src/lib/db.ts:L1–L7", href: `${repo}/src/lib/db.ts#L1-L7`, reason: "Server ActionsとPostgreSQLの共通接続点だから。", detail: "Prismaクライアントを共有し、画面からデータアクセスを分離する構成を確認できます。" },
    { label: "アプリ全体の入口", path: "src/app/layout.tsx:L1–L40", href: `${repo}/src/app/layout.tsx#L1-L40`, reason: "App Router上の共通プロバイダー構成を確認できるため。", detail: "認証・画面・アプリ全体の共通設定がルートレイアウトへ集約されています。" },
  ],
  decisions: [
    { label: "Stripe決済作成", path: "src/queries/stripe.ts:L75–L118", href: `${repo}/src/queries/stripe.ts#L75-L118`, reason: "二系統ある決済連携のうちカード決済側の責務を代表するため。", detail: "注文金額をもとにPaymentIntentを作成し、Stripeへ渡す処理を確認できます。" },
    { label: "PayPal決済作成", path: "src/queries/paypal.ts:L205–L245", href: `${repo}/src/queries/paypal.ts#L205-L245`, reason: "同じ注文を別の決済事業者へ接続する境界だから。", detail: "PayPal注文の作成と、外部APIへの入力を組み立てる処理を確認できます。" },
    { label: "Stripe Webhook", path: "src/app/api/webhooks/stripe/route.ts:L92–L126", href: `${repo}/src/app/api/webhooks/stripe/route.ts#L92-L126`, reason: "画面外で確定する支払状態の反映地点だから。", detail: "署名付きイベントを受け、決済結果をアプリ側の状態へ反映する入口を確認できます。" },
  ],
  quality: [
    { label: "Jest構成", path: "jest.config.js:L1–L35", href: `${repo}/jest.config.js#L1-L35`, reason: "単体・コンポーネントテストの対象範囲を示すため。", detail: "テスト環境、収集対象、除外範囲など、資料記載のJest実行基盤を確認できます。" },
    { label: "Playwright構成", path: "playwright.config.ts:L1–L25", href: `${repo}/playwright.config.ts#L1-L25`, reason: "複数ブラウザE2Eの実行条件を確認できるため。", detail: "Chromium・Firefox・WebKitを使うE2E構成と、実行時の共通設定を確認できます。" },
    { label: "CI品質ゲート", path: ".github/workflows/ci.yml:L38–L69", href: `${repo}/.github/workflows/ci.yml#L38-L69`, reason: "自動化された検査範囲を一箇所で追えるため。", detail: "Lint、テスト、buildなどを継続的に検査するジョブ定義を確認できます。" },
  ],
  evidence: [
    { label: "認可ガード", path: "src/lib/auth-guards.ts:L30–L111", href: `${repo}/src/lib/auth-guards.ts#L30-L111`, reason: "3ロールと店舗所有権という中核の安全境界だから。", detail: "操作主体に応じた認証・認可の共通化を確認できます。" },
    { label: "注文トランザクション", path: "src/queries/user.ts:L761–L815", href: `${repo}/src/queries/user.ts#L761-L815`, reason: "マーケットプレイス固有の注文処理を代表するため。", detail: "カートから注文を作成する際のデータ更新単位を確認できます。" },
    { label: "決済Webhook", path: "src/app/api/webhooks/stripe/route.ts:L170–L215", href: `${repo}/src/app/api/webhooks/stripe/route.ts#L170-L215`, reason: "外部決済と内部状態の整合を担う処理だから。", detail: "Stripeから届く結果に応じて支払状態を更新する分岐を確認できます。" },
  ],
} as const satisfies Record<string, readonly CuratedReference[]>;

const stack = [
  ["Web", "Next.js 16 / React 19 / TypeScript", "App Router、Server Component主体の画面"],
  ["Data", "PostgreSQL / Prisma / Neon", "Prisma Accelerate経由のデータアクセス"],
  ["Identity", "Clerk / Svix", "認証、ロール判定、ユーザー同期Webhook"],
  ["Payment", "Stripe / PayPal", "決済作成、署名検証、支払状態の反映"],
  ["State & forms", "Zustand / React Hook Form / Zod", "カート永続化と入力検証"],
  ["Quality", "Jest / Playwright / ESLint", "単体・統合・E2E・静的検査"],
] as const;

export const multiVendorDetailSections = [
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

export function MultiVendorDetail() {
  return <>
    <section id="features">
      <SectionLead number="01">Main features</SectionLead>
      <h2>顧客・販売者・管理者を、1つの市場でつなぐ</h2>
      <p className="section-intro">複数店舗を横断する購入体験と、店舗ごとの運営、プラットフォーム全体のカタログ統制を、それぞれのロールに分けて提供するマーケットプレイスです。</p>
      <div className="commerce-role-grid">
        <article><p className="eyebrow">CUSTOMER</p><h3>探す・比べる・購入する</h3><p>カテゴリや価格で商品を探し、比較・カート・二系統の決済・注文追跡までを一つの導線で扱います。</p><strong>USER</strong><span>商品・注文・レビュー・DM</span></article>
        <article><p className="eyebrow">SELLER</p><h3>店舗を運営する</h3><p>商品とバリアント、在庫、注文、クーポン、配送ルールを店舗単位のダッシュボードで管理します。</p><strong>SELLER</strong><span>所有店舗の運営</span></article>
        <article><p className="eyebrow">ADMIN</p><h3>市場を統制する</h3><p>カテゴリ、オファータグ、全体クーポン、注文、店舗を横断して監視・管理します。</p><strong>ADMIN</strong><span>プラットフォーム管理</span></article>
      </div>
      <article className="feature-story commerce-feature"><div className="feature-heading"><span className="feature-number">01</span><h3>店舗単位に分かれる注文処理</h3></div>
        <p>顧客の一つの注文を、販売者ごとのOrderGroupと商品バリアント単位のOrderItemへ分割します。在庫減算と注文作成をトランザクションでまとめ、店舗ごとの運用へつなげます。</p>
        <div className="feature-reason"><h4>この機能を取り上げる理由</h4><p>一つのカートに複数店舗の商品が入る、マルチベンダーEC固有のデータ構造と整合性の守り方が表れるためです。</p></div>
      </article>
      <article className="feature-story commerce-feature"><div className="feature-heading"><span className="feature-number">02</span><h3>StripeとPayPalを同じ注文へ接続</h3></div>
        <p>決済作成はServer Actionへ分離し、確定結果は各サービスのWebhookで受け取ります。画面上の完了だけを根拠にせず、署名を検証した通知から支払状態を更新します。</p>
        <div className="feature-reason"><h4>この機能を取り上げる理由</h4><p>外部サービスの非同期な結果と、アプリ内の注文・支払状態を同期する境界が明確だからです。</p></div>
      </article>
      <CuratedReferences items={references.features} />
    </section>

    <section id="architecture">
      <SectionLead number="02">Architecture</SectionLead>
      <h2>画面・Server Actions・データアクセスを分離する</h2>
      <p className="section-intro">Server Componentを画面の入口とし、業務処理は <code>src/queries/</code>、認可は共通ガード、永続化はPrismaクライアントへ集約します。UIからデータアクセス層へ直接到達させない構成です。</p>
      <figure className="system-flow"><figcaption>リクエストから外部サービスまでの責務</figcaption><ol>
        <li><span>01</span><strong>Browser</strong><small>3ロールの操作</small></li>
        <li><span>02</span><strong>Middleware</strong><small>保護ルートを判定</small></li>
        <li><span>03</span><strong>Server Component</strong><small>画面と入力の入口</small></li>
        <li><span>04</span><strong>Server Actions</strong><small>認可と業務処理</small></li>
        <li><span>05</span><strong>Prisma / APIs</strong><small>DB・決済へ接続</small></li>
      </ol></figure>
      <figure className="commerce-flow"><figcaption>カートから注文確定まで</figcaption><ol>
        {[["Cart", "店舗別の商品"], ["Order", "顧客の注文全体"], ["OrderGroup", "店舗単位へ分割"], ["OrderItem", "在庫を減算"], ["Payment", "Stripe / PayPal"], ["Webhook", "状態を確定"]].map(([label, detail], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><small>{detail}</small></li>)}
      </ol></figure>
      <CuratedReferences items={references.architecture} />
    </section>

    <section id="decisions">
      <SectionLead number="03">Structure & constraints</SectionLead>
      <h2>運用上の制約を、実装規約として固定する</h2>
      <p className="section-intro">認可、金額精度、ビルド時のDB接続、カテゴリ移行といった壊れやすい境界を、共通ガードや型、動的レンダリング規約として扱います。</p>
      <div className="reading-table-wrap"><table className="reading-table stack-table"><caption>技術と責務</caption><thead><tr><th scope="col">レイヤー</th><th scope="col">技術</th><th scope="col">役割</th></tr></thead><tbody>
        {stack.map(([layer, tech, role]) => <tr key={layer}><th scope="row">{layer}</th><td>{tech}</td><td>{role}</td></tr>)}
      </tbody></table></div>
      <div className="constraint-grid commerce-constraints">
        <article><span>01</span><h3>認可を先に確定</h3><p>認可エラーをDBの汎用エラーで上書きしないよう、ガードをtry/catchの外側で実行します。</p></article>
        <article><span>02</span><h3>金額はDecimalで計算</h3><p>金額フィールドにFloatを使わず、集計もPrisma.Decimalのまま扱います。</p></article>
        <article><span>03</span><h3>DBページは動的描画</h3><p>CIのbuild時にDBへ接続しないよう、依存ページはforce-dynamicを宣言します。</p></article>
        <article><span>04</span><h3>カテゴリ構造は移行中</h3><p>隣接リストとmaterialized pathから新しい参照へ段階移行しており、旧・新FKが共存します。</p></article>
      </div>
      <p className="limitation">多通貨、税計算、高度な分析、配送キャリア連携は現フェーズの対象外です。公開ページのSSG / ISRより、DBアクセスを伴う動的描画を優先しています。</p>
      <CuratedReferences items={references.decisions} />
    </section>

    <section id="quality">
      <SectionLead number="04">Quality & boundaries</SectionLead>
      <h2>確認済みのテストと、残るリスクを並べて示す</h2>
      <p className="section-intro">以下はプロジェクト資料が <code>docs/testing/QA_HANDOFF.md</code> をもとに記録した2026年9月4日時点の値です。現在の件数や本番環境での成功を保証するものではありません。</p>
      <div className="quality-metrics commerce-quality"><div><strong>2,184</strong><span>Jest passed</span><small>2,187 total / 199 suites</small></div><div><strong>136</strong><span>Integration tests</span><small>16 suites / PostgreSQL</small></div><div><strong>198</strong><span>Main E2E runs</span><small>66 × 3 browsers</small></div></div>
      <div className="quality-columns"><article><p className="eyebrow">DOCUMENTED COVERAGE</p><h3>資料で確認できること</h3><ul><li>決済Webhookの冪等性を実DBで検証</li><li>注文・在庫・クーポンのトランザクション整合性</li><li>認可・ロール・IDORテストの整備</li><li>型エラー0件、lcov Lines 74.8%</li></ul></article>
        <article className="boundary-card"><p className="eyebrow">NOT YET GUARANTEED</p><h3>未検証・継続課題</h3><ul><li>販売者画面のCloudinary SSRエラー可能性</li><li>一部画面の色コントラスト負債</li><li>クーポン適用時の楽観的並行制御</li><li>API・画面を横断するセキュリティテスト</li><li>継続的なBundle Size / Performance監視</li></ul></article></div>
      <p className="limitation">カバレッジマトリクスは18 / 80セル（23%）、Performance領域は0 / 10です。テスト件数の多さを、未着手領域を含む品質保証とは扱いません。</p>
      <CuratedReferences items={references.quality} />
    </section>

    <section id="evidence">
      <SectionLead number="05">Selected references</SectionLead><h2>参照コード</h2>
      <p className="section-intro">ページ内容の基準は2026年9月18日更新のプロジェクトドキュメントです。下記コード参照は、ポートフォリオ側で別途確認した固定コミットへリンクしています。</p>
      <div className="audit-note"><p>資料更新日：<time dateTime="2026-09-18">2026年9月18日</time><br />コード確認日：<time dateTime="2026-09-16">2026年9月16日</time><br />監査対象：<SiteLink href={`https://github.com/myoshi2891/Multi-Vendor-E-Commerce/tree/${commit}`}><code>{commit.slice(0, 12)}</code></SiteLink></p></div>
      <CuratedReferences items={references.evidence} />
    </section>
  </>;
}
