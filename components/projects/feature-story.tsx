import type { Claim } from "../../types/portfolio";
import { featureGuides } from "../../data/feature-guides";
import { evidence, type EvidenceId } from "../../data/evidence";

export function FeatureStory({ claim, index }: { claim: Claim; index: number }) {
  const id = claim.evidenceIds[0] as EvidenceId;
  const guide = featureGuides[id];
  const source = evidence[id];
  if (!guide || !source || source.sourceType !== "REPOSITORY_VERIFIED") return null;
  return <article className="feature-story">
    <div className="feature-heading"><span className="feature-number">{String(index + 1).padStart(2, "0")}</span><h3>{guide.title}</h3></div>
    <p>{claim.text}</p>
    <div className="feature-reason"><h4>この機能を取り上げる理由</h4><p>{guide.reason}</p></div>
    <figure className="flow-diagram">
      <figcaption>処理の流れ</figcaption>
      <ol>{guide.steps.map((step, i) => <li key={step}><span className="flow-index">{String(i + 1).padStart(2, "0")}</span>{step}{i < guide.steps.length - 1 && <span className="flow-arrow" aria-hidden="true">→</span>}</li>)}</ol>
    </figure>
    <div className="reading-table-wrap"><table className="reading-table">
      <caption>リンク先で確認できること</caption>
      <thead><tr><th scope="col">参照コード</th><th scope="col">読むポイント</th></tr></thead>
      <tbody>{source.sources.map(s => <tr key={s.url}>
        <th scope="row"><a href={s.url}><span>{s.label.split("/").at(-1)} <span aria-hidden="true">↗</span></span><small>{s.label.split(":")[0]}</small></a></th>
        <td>{guide.readings[s.label]}</td>
      </tr>)}</tbody>
    </table></div>
  </article>;
}
