import research from "./generated/research-links.json";
import { RESOURCE_GROUPS } from "./resources.js";

function LinkList({ links }) {
  return (
    <ul className="link-list">
      {links.map((l) => (
        <li key={l.url}>
          <a href={l.url} target="_blank" rel="noreferrer">{l.text}</a>
          <span className="link-url">{l.url}</span>
          {l.note && <span className="muted"> · {l.note}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function Resources() {
  const byDoc = research.reduce((acc, link) => {
    const doc = link.docs[0];
    (acc[doc] ??= []).push(link);
    return acc;
  }, {});
  const total = RESOURCE_GROUPS.reduce((n, g) => n + g.links.length, 0) + research.length;

  return (
    <div className="page">
      <h1>Resources</h1>
      <p className="muted">
        Every link this project relies on: {total} in total. The research sources at the bottom are collected
        automatically from the <code>docs/</code> folder each time the site is built.
      </p>
      {RESOURCE_GROUPS.map((g) => (
        <section key={g.title} className="card">
          <h2>{g.title}</h2>
          <LinkList links={g.links} />
        </section>
      ))}
      <section className="card">
        <h2>Research sources cited in docs/ ({research.length})</h2>
        {Object.entries(byDoc).map(([doc, links]) => (
          <div key={doc}>
            <h3><code>{doc}</code></h3>
            <LinkList links={links.map((l) => ({ ...l, note: l.docs.length > 1 ? `also cited in ${l.docs.slice(1).join(", ")}` : "" }))} />
          </div>
        ))}
      </section>
    </div>
  );
}
