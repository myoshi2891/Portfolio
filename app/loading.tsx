export default function Loading() {
  return <main id="main" className="container loading-page" aria-busy="true">
    <p role="status" className="eyebrow"><span className="loading-spinner" aria-hidden="true" />ページを読み込んでいます</p>
    <div className="loading-skeleton" aria-hidden="true"><div /><div /><div /></div>
  </main>;
}
