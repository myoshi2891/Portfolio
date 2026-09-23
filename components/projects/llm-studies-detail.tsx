import { SiteLink } from "../ui/site-link";
import type { ReactNode } from "react";

const guideFeatures = [
  ["横断検索", "タイトル・要約・タグを対象に検索し、URLの ?q= / ?tag= で条件を共有"],
  ["What's New", "新着・最近更新されたガイドを一覧化"],
  ["RSS / 関連ページ", "静的RSSと、共有タグ数に基づく決定論的な関連記事表示"],
  ["鮮度・言語基盤", "最終確認日の表示と、JA / ENテキスト管理の土台"],
] as const;

const stack = [
  ["Web", "Next.js 16 / React 19 / TypeScript", "App Router、pure SSG"],
  ["UI", "Tailwind CSS v4 / CSS Modules", "Mermaidを共通部品で表示"],
  ["Data", "Zod / JSON", "価格データを実行時検証"],
  ["Scraper", "Python 3.12+ / Pydantic", "httpx + Playwright"],
  ["Quality", "Vitest / pytest / Biome", "Bun・uvで実行"],
  ["Delivery", "Netlify", "静的HTMLをCDN配信"],
] as const;

type CuratedReference = {
  label: string;
  path: string;
  href: string;
  reason: string;
  detail: string;
};

const references = {
  features: [
    {
      label: "計算ロジック",
      path: "web-next/lib/cost.ts:L33–L65",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/lib/cost.ts#L33-L65",
      reason: "表示金額の根拠を最短で確認できるため。",
      detail: "API料金とサブスク料金の計算、USD・JPYの表示整形、金額帯の色分けを副作用のない関数として実装しています。",
    },
    {
      label: "画面から計算への入口",
      path: "web-next/components/HomePage.tsx:L108–L125",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/components/HomePage.tsx#L108-L125",
      reason: "利用者の入力と計算結果の接続点を追えるため。",
      detail: "トークン数、期間、シナリオなどの入力状態を受け取り、API・サブスクの比較表へ渡す流れを確認できます。",
    },
    {
      label: "ガイド機能の起点",
      path: "web-next/lib/page-registry.ts",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/lib/page-registry.ts",
      reason: "84ページを横断する機能の共通データ源だから。",
      detail: "各ガイドのタイトル、要約、タグ、更新日を一元管理し、検索・RSS・関連ページ・鮮度表示へ供給します。",
    },
  ],
  architecture: [
    {
      label: "収集パイプライン",
      path: "scraper/src/scraper/main.py:L66–L153",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/scraper/src/scraper/main.py#L66-L153",
      reason: "料金収集からJSON出力までの全体像を確認できるため。",
      detail: "プロバイダー別スクレイパーを実行し、取得結果を統合してpricing.jsonへ書き出すオーケストレーションを担います。",
    },
    {
      label: "3層フォールバック",
      path: "scraper/src/scraper/provenance.py",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/scraper/src/scraper/provenance.py",
      reason: "取得失敗時にも価格を維持できる設計の中心だから。",
      detail: "今回の取得値、過去の成功値、ハードコード値を比較し、採用した価格とその出自を決定します。",
    },
    {
      label: "Web側の検証境界",
      path: "web-next/lib/pricing.ts:L74–L81",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/lib/pricing.ts#L74-L81",
      reason: "PythonとNext.jsの境界でデータをどう守るかが分かるため。",
      detail: "ビルド時に読み込んだ価格JSONをZodスキーマで検証し、不正なデータを画面へ渡さない境界を作っています。",
    },
  ],
  decisions: [
    {
      label: "価格型のSSoT",
      path: "scraper/src/scraper/models.py",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/scraper/src/scraper/models.py",
      reason: "バックエンドとWebが共有するデータ契約の起点だから。",
      detail: "PricingData、ApiModel、SubToolをPydanticモデルとして定義し、生成するJSONの必須項目と型を固定します。",
    },
    {
      label: "ページメタデータのSSoT",
      path: "web-next/lib/page-registry.ts",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/lib/page-registry.ts",
      reason: "重複定義を避けるという設計判断を代表するため。",
      detail: "ページ属性を一度だけ定義し、ナビゲーション、サイトマップ、検索、RSSなどへ同じ情報を導出します。",
    },
    {
      label: "静的配信の設定",
      path: "netlify.toml",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/netlify.toml",
      reason: "収集と配信を分ける運用制約を実際の設定で確認できるため。",
      detail: "web-nextを基点にNext.jsをビルドしてoutを公開し、デプロイ中にはスクレイパーを実行しない構成です。",
    },
  ],
  quality: [
    {
      label: "フロントエンドテスト",
      path: "web-next/app/agent/context-engineering-best-practices/page.test.tsx:L1–L8",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/app/agent/context-engineering-best-practices/page.test.tsx#L1-L8",
      reason: "ガイドページに対するテスト実体を確認できるため。",
      detail: "ページコンポーネントを描画し、主要な見出しやコンテンツが出力されることをVitestで検査します。",
    },
    {
      label: "スクレイパーテスト",
      path: "scraper/tests/test_providers.py:L1–L30",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/scraper/tests/test_providers.py#L1-L30",
      reason: "外部ページに依存する収集処理の検査方法を示せるため。",
      detail: "プロバイダー別処理をネットワークから切り離し、取得結果の変換やfallbackの振る舞いをpytestで確認します。",
    },
    {
      label: "CIの検査範囲",
      path: ".github/workflows/test.yaml",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/.github/workflows/test.yaml",
      reason: "自動化されている検査と、ローカル運用に残る検査を区別できるため。",
      detail: "CIでVitestとpytestを実行する一方、typecheck・lint・build・E2Eは含まれないという境界を確認できます。",
    },
  ],
  evidence: [
    {
      label: "コスト計算",
      path: "web-next/lib/cost.ts",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/lib/cost.ts",
      reason: "ユーザー向け機能の中心となる計算規則を代表するため。",
      detail: "トークン従量課金、サブスクの時間按分、通貨表示という計算機の主要な振る舞いをまとめて確認できます。",
    },
    {
      label: "価格の信頼性設計",
      path: "scraper/src/scraper/provenance.py",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/scraper/src/scraper/provenance.py",
      reason: "このプロジェクト固有の障害耐性を最もよく表すため。",
      detail: "スクレイプ失敗時の値選択と出自記録を実装し、表示継続と価格改定の反映を両立しています。",
    },
    {
      label: "ガイド基盤",
      path: "web-next/lib/page-registry.ts",
      href: "https://github.com/myoshi2891/Comparison-of-LLMs/blob/4025a136bad5cd2d9a99e928b0c1949291fc3f68/web-next/lib/page-registry.ts",
      reason: "84ページを個別実装の集合ではなく、1つのプロダクトとして支えるため。",
      detail: "ページメタデータを一元化し、検索・ナビゲーション・RSS・関連表示などの横断機能を成立させています。",
    },
  ],
} as const satisfies Record<string, readonly CuratedReference[]>;

export const llmDetailSections = [
  { id: "overview", label: "概要" },
  { id: "features", label: "主な機能" },
  { id: "architecture", label: "アーキテクチャ" },
  { id: "decisions", label: "構成と制約" },
  { id: "quality", label: "品質と未検証の範囲" },
  { id: "evidence", label: "参照コード" },
] as const;

function SectionLead({ number, children }: { number: string; children: ReactNode }) {
  return <p className="detail-section-lead"><span>{number}</span>{children}</p>;
}

function CuratedReferences({ items }: { items: readonly CuratedReference[] }) {
  return <div className="curated-references">
    <h3>このセクションの参照コード</h3>
    <p>要点を確認できる箇所を3件までに絞っています。</p>
    <ol>{items.slice(0, 3).map((item, index) => <li key={item.path}>
      <div className="reference-heading"><span>{String(index + 1).padStart(2, "0")}</span><SiteLink href={item.href}>{item.label}<b aria-hidden="true">↗</b></SiteLink></div>
      <code>{item.path}</code>
      <dl><div><dt>選定理由</dt><dd>{item.reason}</dd></div><div><dt>具体的に確認できること</dt><dd>{item.detail}</dd></div></dl>
    </li>)}</ol>
  </div>;
}

export function LlmStudiesDetail() {
  return <>
    <section id="features">
      <SectionLead number="01">Main features</SectionLead>
      <h2>1つのリポジトリ、2つのプロダクト</h2>
      <p className="section-intro">料金を比較する道具と、AIツールを導入・運用するための知識ベースを、同じ静的サイトとして提供しています。</p>

      <div className="llm-role-grid">
        <article>
          <p className="eyebrow">01 / COST CALCULATOR</p>
          <h3>AIモデル コスト計算機</h3>
          <p>各社APIの入力・出力単価と、サブスクリプションツールの料金を同じ画面で比較。利用時間とトークン量を変えると、想定費用をその場で計算します。</p>
          <dl className="metric-list">
            <div><dt>期間プリセット</dt><dd>7</dd></div>
            <div><dt>計算の単位</dt><dd>USD / JPY</dd></div>
          </dl>
        </article>
        <article>
          <p className="eyebrow">02 / KNOWLEDGE BASE</p>
          <h3>AIツール導入ガイド群</h3>
          <p>Claude Code、OpenAI Codex、GitHub Copilot、Geminiなどの設定・運用知識を、検索可能なガイドページとして整理しています。</p>
          <dl className="metric-list">
            <div><dt>ガイドページ</dt><dd>84</dd></div>
            <div><dt>生成方式</dt><dd>SSG</dd></div>
          </dl>
        </article>
      </div>

      <article className="feature-story llm-feature">
        <div className="feature-heading"><span className="feature-number">01</span><h3>利用量からAPI費用を計算</h3></div>
        <p>入力・出力トークン数、単価、利用時間から費用を算出します。計算は副作用のない関数に分離し、表示処理と切り離しています。</p>
        <div className="feature-reason"><h4>この機能を取り上げる理由</h4><p>画面の金額がどの入力と式から得られたかを追跡でき、比較条件を変えたときの振る舞いが明確だからです。</p></div>
        <div className="formula-card"><code>(input / 1,000,000 × priceIn + output / 1,000,000 × priceOut) × hours</code><span>calcApiCost</span></div>
        <div className="period-row" aria-label="期間プリセット">{["1h", "8h", "24h", "7d", "30d", "4mo", "12mo"].map(period => <span key={period}>{period}</span>)}</div>
      </article>

      <article className="feature-story llm-feature">
        <div className="feature-heading"><span className="feature-number">02</span><h3>84ページを横断して探せるガイド</h3></div>
        <p>ページを増やすだけでなく、探す・更新を知る・次へ進むための導線まで共通基盤として実装しています。</p>
        <div className="feature-reason"><h4>この機能を取り上げる理由</h4><p>ガイド数が増えても、情報の発見性と更新日の透明性を保つ設計がプロダクトの実用性を支えているためです。</p></div>
        <div className="guide-feature-grid">{guideFeatures.map(([title, text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}</div>
      </article>

      <div className="reading-table-wrap"><table className="reading-table llm-contract-table">
        <caption>リンク先で確認できること — コスト関数の入出力契約</caption>
        <thead><tr><th scope="col">関数</th><th scope="col">振る舞い</th></tr></thead>
        <tbody>
          <tr><th scope="row"><code>calcApiCost</code></th><td>API単価、トークン数、時間からUSD金額を算出。計算内では丸めません。</td></tr>
          <tr><th scope="row"><code>calcSubCost</code></th><td>月額を時間按分し、8760時間以上では年額を採用します。</td></tr>
          <tr><th scope="row"><code>fmtUSD / fmtJPY</code></th><td><code>fmtUSD</code> は有限の正数が $0.005 未満なら &lt;$0.01、それ以外の正数は小数第2位まで表示し、非有限値・0以下は $0.00 とします。<code>fmtJPY</code> は換算後が 0 円超・1 円未満なら &lt;¥1、それ以上は四捨五入して桁区切りし、換算後が 0 以下なら ¥0、金額または為替レートが無効なら ¥— とします。</td></tr>
        </tbody>
      </table></div>
      <CuratedReferences items={references.features} />
    </section>

    <section id="architecture">
      <SectionLead number="02">Architecture</SectionLead>
      <h2>収集と配信を分離した静的アーキテクチャ</h2>
      <p className="section-intro">価格更新は開発者が明示的に実行し、Webサイトはコミット済みJSONから静的生成します。Netlifyのビルド中にスクレイピングは行いません。</p>

      <figure className="system-flow">
        <figcaption>処理の流れ — 価格データから静的サイトまで</figcaption>
        <ol>
          <li><span>01</span><strong>update.sh</strong><small>更新を開始</small></li>
          <li><span>02</span><strong>Python scraper</strong><small>各社料金を収集</small></li>
          <li><span>03</span><strong>pricing.json</strong><small>価格と出自を保存</small></li>
          <li><span>04</span><strong>Next.js build</strong><small>JSONを検証・静的生成</small></li>
          <li><span>05</span><strong>Netlify CDN</strong><small>静的HTMLを配信</small></li>
        </ol>
      </figure>

      <div className="architecture-grid">
        <article className="fallback-card">
          <p className="eyebrow">RESILIENT PRICING</p>
          <h3>価格の3層フォールバック</h3>
          <ol>
            <li><span>01</span><div><strong>今回の取得値</strong><p>スクレイプ成功時に採用</p></div></li>
            <li><span>02</span><div><strong>過去の成功値</strong><p>取得失敗時も実績値を維持</p></div></li>
            <li><span>03</span><div><strong>ハードコード値</strong><p>過去値が使えない場合の最終手段</p></div></li>
          </ol>
        </article>
        <article className="registry-card">
          <p className="eyebrow">SINGLE SOURCE OF TRUTH</p>
          <h3>ページレジストリから導出</h3>
          <div className="registry-core"><code>page-registry.ts</code><span>84 pages</span></div>
          <ul>{["Navigation", "Sitemap", "RSS", "Search", "Related", "Freshness"].map(item => <li key={item}>{item}</li>)}</ul>
        </article>
      </div>
      <CuratedReferences items={references.architecture} />
    </section>

    <section id="decisions">
      <SectionLead number="03">Structure & constraints</SectionLead>
      <h2>型と生成規則を、実装の境界に置く</h2>
      <p className="section-intro">スクレイパーとWebを別々に保守しながら、JSONスキーマ、ページレジストリ、共有図解コンポーネントを境界のSingle Source of Truthとして扱います。</p>
      <div className="reading-table-wrap"><table className="reading-table stack-table">
        <caption>技術スタック</caption>
        <thead><tr><th scope="col">レイヤー</th><th scope="col">技術</th><th scope="col">役割</th></tr></thead>
        <tbody>{stack.map(([layer, tech, role]) => <tr key={layer}><th scope="row">{layer}</th><td>{tech}</td><td>{role}</td></tr>)}</tbody>
      </table></div>
      <div className="constraint-grid">
        <article><span>01</span><h3>収集とビルドを分離</h3><p>Netlifyではスクレイパーを走らせず、レビュー済みの価格JSONを使います。</p></article>
        <article><span>02</span><h3>型を両側で同期</h3><p>Pydanticを価格型のSSoTとし、TypeScript側のミラーとの一致を検査します。</p></article>
        <article><span>03</span><h3>レジストリから導出</h3><p>ナビ、検索、RSSなどへページ属性を重複して手書きしません。</p></article>
        <article><span>04</span><h3>ガイドは忠実に移植</h3><p>元資料を抜粋・要約せず、内容を保ったままNext.jsへ移します。</p></article>
      </div>
      <CuratedReferences items={references.decisions} />
    </section>

    <section id="quality">
      <SectionLead number="04">Quality & boundaries</SectionLead>
      <h2>Greenの数と、保証しない範囲を分けて示す</h2>
      <p className="section-intro">2026年9月18日のプロジェクト資料に記録された実測値です。テスト数だけで品質を断定せず、CIに含まれない検査と外部依存を明示します。</p>
      <div className="quality-metrics">
        <div><strong>1,639</strong><span>Frontend tests</span><small>177 files / Vitest</small></div>
        <div><strong>100</strong><span>Backend tests</span><small>5 files / pytest</small></div>
        <div><strong>2</strong><span>CI checks</span><small>Vitest + pytest</small></div>
      </div>
      <div className="quality-columns">
        <article><p className="eyebrow">MECHANICAL CHECKS</p><h3>機械的に守ること</h3><ul><li>ページレジストリの登録漏れ検知</li><li>レジストリとナビの全単射検証</li><li>Pydantic / TypeScript型のパリティ検証</li><li>差分内の絶対パス・PII検出</li></ul></article>
        <article className="boundary-card"><p className="eyebrow">NOT GUARANTEED</p><h3>未検証・運用依存</h3><ul><li>料金ページ変更後のスクレイプ成功率</li><li>Google価格は意図的にfallback固定</li><li>E2EはCI未組込で、一部DOM参照が不整合</li><li>CIはtypecheck / lint / buildを強制しない</li><li>SonarQubeは初回セットアップが必要</li></ul></article>
      </div>
      <p className="limitation">価格は取得時点の情報です。フォールバックにより表示を維持できても、最新価格であることまでは保証しません。</p>
      <CuratedReferences items={references.quality} />
    </section>

    <section id="evidence">
      <SectionLead number="05">Reference</SectionLead>
      <h2>参照コード</h2>
      <p>ページ内容の基準：<code>docs/PROJECT-DETAILS/PROJECT_DETAILS-LLM-Studies.md</code>（最終更新 2026-09-18）</p>
      <CuratedReferences items={references.evidence} />
      <div className="audit-note"><p>ポートフォリオ側の参照コード確認日：<time dateTime="2026-09-16">2026-09-16</time></p><p>対象コミット：<code>4025a136bad5</code></p></div>
    </section>
  </>;
}
