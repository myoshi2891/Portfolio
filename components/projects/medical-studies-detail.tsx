import type { ReactNode } from "react";
import { SiteLink } from "../ui/site-link";

type CuratedReference = { label: string; path: string; href: string; reason: string; detail: string };

const commit = "e9b09fc1da2497cd88a678e89a1111ddc1ce56cc";
const repo = `https://github.com/myoshi2891/Medical-Studies/blob/${commit}`;

const references = {
  features: [
    { label: "PROMの採点規則", path: "web-next/lib/prom/scoring.ts:L41–L131", href: `${repo}/web-next/lib/prom/scoring.ts#L41-L131`, reason: "回答から記録値が生まれる中心ロジックだから。", detail: "尺度ごとの回答検証と採点を、副作用のない関数として実装していることを確認できます。" },
    { label: "3D解剖の宣言データ", path: "web-next/lib/anatomy/manifest.ts", href: `${repo}/web-next/lib/anatomy/manifest.ts`, reason: "解剖アトラスの構造と教材への接続を代表するため。", detail: "構造、モデル、MRI、関連する教育記事へのリンクをmanifestへ集約する設計を確認できます。" },
    { label: "用語集の自動適用", path: "web-next/components/glossary/AutoGlossary.tsx", href: `${repo}/web-next/components/glossary/AutoGlossary.tsx`, reason: "専門情報を読みやすくする横断機能の入口だから。", detail: "本文を走査し、登録済み用語の初出を読み仮名と平易な説明を持つ表示へ変換します。" },
  ],
  architecture: [
    { label: "PROMアプリの統合点", path: "web-next/components/prom/PromApp.tsx:L94–L112", href: `${repo}/web-next/components/prom/PromApp.tsx#L94-L112`, reason: "画面と各ドメイン処理の接続を追えるため。", detail: "ダッシュボード、フォーム、記録、出力などのクライアント側の状態遷移を束ねています。" },
    { label: "ローカル保存境界", path: "web-next/lib/prom/storage.ts:L30–L79", href: `${repo}/web-next/lib/prom/storage.ts#L30-L79`, reason: "端末内保存というプライバシー設計の実装境界だから。", detail: "StorageAdapterとlocalStorage実装、同日記録の重複処理を確認できます。" },
    { label: "出力の中間表現", path: "web-next/lib/export/workbook.ts", href: `${repo}/web-next/lib/export/workbook.ts`, reason: "CSVとGoogle Sheetsを分離する設計の要だから。", detail: "記録データを出力先に依存しないWorkbookへ変換し、exporterへ渡す契約を確認できます。" },
  ],
  decisions: [
    { label: "公開環境の質問票ゲート", path: "web-next/lib/prom/restricted-loader.server.ts:L17–L29", href: `${repo}/web-next/lib/prom/restricted-loader.server.ts#L17-L29`, reason: "著作権上の制約をコードで守る境界だから。", detail: "本番環境では制限尺度のローカルオーバーレイを読み込まず、プレースホルダへ戻す処理を確認できます。" },
    { label: "セキュリティヘッダ", path: "web-next/lib/security/csp.ts", href: `${repo}/web-next/lib/security/csp.ts`, reason: "静的配信での防御方針を代表するため。", detail: "CSPなどのヘッダ値を純粋関数で組み立て、全ルートへ付与する基礎を確認できます。" },
    { label: "3Dビューアの降格表示", path: "web-next/components/anatomy/ModelViewer.tsx", href: `${repo}/web-next/components/anatomy/ModelViewer.tsx`, reason: "重量機能を本文から分離する判断が見えるため。", detail: "model-viewerを遅延ロードし、失敗しても教育ページ全体は読めるようにする実装です。" },
  ],
  quality: [
    { label: "CI品質ゲート", path: ".github/workflows/ci.yml:L20–L58", href: `${repo}/.github/workflows/ci.yml#L20-L58`, reason: "自動化された検査範囲を一箇所で確認できるため。", detail: "型検査、Lint、テスト、buildに加え、ライセンス、Markdown、PIIなどの検査ジョブを確認できます。" },
    { label: "テスト構成", path: "web-next/vitest.config.ts:L1–L22", href: `${repo}/web-next/vitest.config.ts#L1-L22`, reason: "837件という資料記載値の実行基盤を示すため。", detail: "Vitestの対象範囲とテスト環境の設定を確認できます。件数は2026年9月18日の資料記録です。" },
    { label: "PNGメタデータ除去", path: "web-next/lib/anatomy/png-sanitize.ts", href: `${repo}/web-next/lib/anatomy/png-sanitize.ts`, reason: "医療画像を公開する際の安全境界を示すため。", detail: "公開用MRI PNGからテキスト系メタデータを除去する処理を確認できます。" },
  ],
  evidence: [
    { label: "コンテンツレジストリ", path: "web-next/lib/content/registry.ts", href: `${repo}/web-next/lib/content/registry.ts`, reason: "教育ページ群を一つのサイトとして束ねるSSoTだから。", detail: "カテゴリ、鮮度、関連ページなど、横断検索や導線に使うメタ情報を集約しています。" },
    { label: "PROM採点", path: "web-next/lib/prom/scoring.ts", href: `${repo}/web-next/lib/prom/scoring.ts`, reason: "自己記録ツールの主要な振る舞いを代表するため。", detail: "各尺度の回答検証とスコア計算を、UIや保存処理から独立して確認できます。" },
    { label: "解剖manifest", path: "web-next/lib/anatomy/manifest.ts", href: `${repo}/web-next/lib/anatomy/manifest.ts`, reason: "3D、MRI、記事をつなぐ教育体験の中心だから。", detail: "解剖構造ごとの表示資産と関連教材を宣言データとして管理しています。" },
  ],
} as const satisfies Record<string, readonly CuratedReference[]>;

const stack = [
  ["Web", "Next.js 16 / React 19 / TypeScript", "App Router、Server Component主体の静的生成"],
  ["Content", "Registry / AutoGlossary / Mermaid", "36ページの登録、162語の用語支援、図解"],
  ["Interactive", "localStorage / model-viewer", "PROM記録と3D解剖をClient Islandとして分離"],
  ["Export", "CSV / Google Sheets API", "Workbook中間表現から出力先を切り替え"],
  ["Quality", "Vitest / Testing Library / Biome", "単体・契約・整合性テストと静的検査"],
] as const;

export const medicalDetailSections = [
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

export function MedicalStudiesDetail() {
  return <>
    <section id="features">
      <SectionLead number="01">Main features</SectionLead>
      <h2>学ぶ・理解する・記録するを、1つのWebアプリへ</h2>
      <p className="section-intro">ICHD-3準拠の頭痛教育コンテンツ、3D解剖アトラス、患者報告アウトカムの自己記録を、共通の検索・用語支援・ナビゲーションで結んでいます。</p>
      <div className="medical-role-grid">
        <article><p className="eyebrow">LEARN</p><h3>医療教育コンテンツ</h3><p>疾患、神経ブロック、薬物・非薬物治療、PROMを、根拠と免責事項を添えて整理します。</p><strong>36</strong><span>レジストリ登録ページ</span></article>
        <article><p className="eyebrow">EXPLORE</p><h3>3D解剖アトラス</h3><p>解剖モデルとMRIスライス、注釈、関連教材をつなぎ、頭頸部構造の位置関係を学べます。</p><strong>6</strong><span>解剖カテゴリ</span></article>
        <article><p className="eyebrow">RECORD</p><h3>PROM・頭痛日誌</h3><p>回答、採点、同日記録の整理、CSV・Google Sheets出力までを端末中心で扱います。</p><strong>6</strong><span>PROM解説ページ</span></article>
      </div>
      <div className="feature-story medical-feature"><div className="feature-heading"><span className="feature-number">01</span><h3>ローカルファーストのPROM記録</h3></div>
        <p>HIT-6、MIDAS、MSQ v2.1、PGIC、NRS/VAS、頭痛日誌を一つのダッシュボードから利用できます。SNOOP4は点数化せず、危険徴候を確認する安全ゲートとして扱います。</p>
        <div className="feature-reason"><h4>設計のポイント</h4><p>採点、同日記録のdedupe、保存、出力を別モジュールへ分け、回答データは通常ブラウザ内に保持します。</p></div>
      </div>
      <div className="feature-story medical-feature"><div className="feature-heading"><span className="feature-number">02</span><h3>ページを横断する学習支援</h3></div>
        <p>サイト内検索は登録済みコンテンツを横断し、AutoGlossaryは本文初出の専門用語へ読み仮名と平易な説明を付けます。3Dアトラスからも関連する疾患・手技へ移動できます。</p>
        <div className="medical-capabilities"><span>横断検索</span><span>162語の用語集</span><span>3D + MRI</span><span>関連ページ</span></div>
      </div>
      <CuratedReferences items={references.features} />
    </section>

    <section id="architecture">
      <SectionLead number="02">Architecture</SectionLead>
      <h2>静的な教育ページに、必要な機能だけを載せる</h2>
      <p className="section-intro">ページ本文はServer Componentで静的プリレンダし、PROM、3D、MRI、Mermaidなどの対話機能はClient Islandとして遅延ロードします。重量機能が失敗しても本文を読める降格戦略です。</p>
      <figure className="system-flow"><figcaption>ページ配信と対話機能の境界</figcaption><ol>
        <li><span>01</span><strong>Content registry</strong><small>ページ属性を集約</small></li>
        <li><span>02</span><strong>Server page</strong><small>本文を静的生成</small></li>
        <li><span>03</span><strong>Client Island</strong><small>必要時に機能を読込</small></li>
        <li><span>04</span><strong>Local storage</strong><small>記録を端末内へ保存</small></li>
        <li><span>05</span><strong>Exporter</strong><small>選択時のみ外部出力</small></li>
      </ol></figure>
      <figure className="prom-flow"><figcaption>PROM記録から出力まで</figcaption><ol>
        {[["回答", "PromApp"], ["検証・採点", "scoring.ts"], ["同日記録を整理", "upsert.ts"], ["端末内保存", "StorageAdapter"], ["中間表現", "ExportWorkbook"], ["CSV / Sheets", "ReportExporter"]].map(([label, code], index) => <li key={label}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><code>{code}</code></li>)}
      </ol></figure>
      <CuratedReferences items={references.architecture} />
    </section>

    <section id="decisions">
      <SectionLead number="03">Structure & constraints</SectionLead>
      <h2>医療情報としての制約を、実装境界に置く</h2>
      <p className="section-intro">教育専用・診断補助なし・SaMD非該当を不変条件とし、著作権、プライバシー、ライセンス、静的配信の制約をコードと公開文書の両方で扱います。</p>
      <div className="reading-table-wrap"><table className="reading-table stack-table"><caption>技術と責務</caption><thead><tr><th scope="col">レイヤー</th><th scope="col">技術</th><th scope="col">役割</th></tr></thead>
        <tbody>{stack.map(([layer, tech, role]) => <tr key={layer}><th scope="row">{layer}</th><td>{tech}</td><td>{role}</td></tr>)}</tbody></table></div>
      <div className="constraint-grid medical-constraints">
        <article><span>01</span><h3>診断・治療を行わない</h3><p>教育と自己記録に限定し、患者固有3D再構築、AI診断、用量計算は対象外です。</p></article>
        <article><span>02</span><h3>制限尺度を公開しない</h3><p>HIT-6とMSQの設問はリポジトリへ含めず、本番ではローカルオーバーレイを読みません。</p></article>
        <article><span>03</span><h3>保存は端末を起点にする</h3><p>通常の記録はlocalStorageへ保存し、利用者が選んだときだけCSVやGoogleへ出力します。</p></article>
        <article><span>04</span><h3>資産ライセンスを分離する</h3><p>BodyParts3D由来モデルはCC-BY-SA 2.1 JPとして、MITのコードとは別に管理します。</p></article>
      </div>
      <p className="limitation">静的プリレンダとの両立のため、CSPは <code>script-src &apos;unsafe-inline&apos;</code> を許容しています。受入済み残余リスクとして文書化され、再評価対象です。</p>
      <CuratedReferences items={references.decisions} />
    </section>

    <section id="quality">
      <SectionLead number="04">Quality & boundaries</SectionLead>
      <h2>確認できた品質と、まだ保証しない範囲</h2>
      <p className="section-intro">以下はプロジェクト資料が記録した2026年9月18日・コミット <code>e9b09fc</code> 時点の実測です。現在の件数や外部サービスの成功を保証する値ではありません。</p>
      <div className="quality-metrics medical-quality"><div><strong>837</strong><span>Passed tests</span><small>79 files / 2026-09-18</small></div><div><strong>40</strong><span>App routes</span><small>36 registered + 4 static</small></div><div><strong>5</strong><span>CI jobs</span><small>web / license / docs / Mermaid / PII</small></div></div>
      <div className="quality-columns"><article><p className="eyebrow">VERIFIED IN SOURCE DOC</p><h3>機械的に確認したこと</h3><ul><li>型検査・Lint・837件のテストが成功</li><li>レジストリ36件とページ構成の整合</li><li>PROMの純粋関数・契約テスト</li><li>セキュリティ・ライセンス・PIIのCIゲート</li></ul></article>
        <article className="boundary-card"><p className="eyebrow">NOT YET GUARANTEED</p><h3>未検証・運用依存</h3><ul><li>実glTF資産を使った3D表示</li><li>Lighthouseの性能実測</li><li>Google Sheets同期の検証範囲</li><li>視覚回帰の自動テスト</li><li>法務文言の専門家レビュー</li></ul></article></div>
      <p className="limitation">コンテンツのSingle Source of Truthは未決定です。旧Markdown / HTML資産はgit管理外で、新規執筆を伴う計画の一部は停止しています。</p>
      <CuratedReferences items={references.quality} />
    </section>

    <section id="evidence">
      <SectionLead number="05">Selected references</SectionLead><h2>参照コード</h2>
      <p className="section-intro">このページの内容基準は2026年9月18日更新のプロジェクト概要です。コード参照は同資料が監査した固定コミットを使用しています。</p>
      <div className="audit-note"><p>資料更新日：<time dateTime="2026-09-18">2026年9月18日</time><br />リポジトリ監査対象：<SiteLink href={`https://github.com/myoshi2891/Medical-Studies/tree/${commit}`}><code>{commit.slice(0, 12)}</code></SiteLink></p></div>
      <CuratedReferences items={references.evidence} />
    </section>
  </>;
}
