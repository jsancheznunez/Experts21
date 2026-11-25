import { useState } from "react";
import nlp from "./nlp/nlp-results.json";

// Entity label colors: categorical slots in fixed order (validated palette, see styles.css).
const LABEL_ORDER = ["PLATFORM", "REGULATION", "METRIC", "ORG", "MONEY", "PERCENT", "DATE", "GPE"];
const LABEL_HELP = {
  PLATFORM: "custom EntityRuler: sales platforms and tools",
  REGULATION: "custom EntityRuler: laws, rules and regulators",
  METRIC: "custom EntityRuler: e-commerce metrics",
  ORG: "spaCy NER: organizations",
  MONEY: "spaCy NER: money amounts",
  PERCENT: "spaCy NER: percentages",
  DATE: "spaCy NER: dates and periods",
  GPE: "spaCy NER: countries, cities, states",
};

function Library({ name }) {
  return <span className={`lib-badge lib-${name.toLowerCase()}`}>{name}</span>;
}

function Uses({ children }) {
  return <p className="uses"><strong>Functions used:</strong> {children}</p>;
}

/** Single-series horizontal bars; the label and value are text, the bar only shows magnitude. */
function Bars({ rows, unit = "" }) {
  const max = Math.max(...rows.map(([, v]) => v), 1);
  return (
    <ol className="bars">
      {rows.map(([label, value]) => (
        <li key={label} title={`${label}: ${value}${unit}`}>
          <span className="bar-label">{label}</span>
          <span className="bar-track"><span className="bar-fill" style={{ width: `${(value / max) * 100}%` }} /></span>
          <span className="bar-value">{value}</span>
        </li>
      ))}
    </ol>
  );
}

/** Diverging bar: compound sentiment from -SCALE to +SCALE around a neutral midpoint. */
function SentimentBar({ value }) {
  const SCALE = 0.3;
  const pct = Math.min(Math.abs(value) / SCALE, 1) * 50;
  const side = value >= 0 ? "pos" : "neg";
  return (
    <span className="sent-track" title={`Mean VADER compound: ${value}`}>
      <span className="sent-mid" />
      <span className={`sent-fill ${side}`} style={side === "pos" ? { left: "50%", width: `${pct}%` } : { right: "50%", width: `${pct}%` }} />
    </span>
  );
}

function DocPicker({ value, onChange }) {
  return (
    <label className="doc-picker">
      Document:{" "}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {nlp.meta.documents.map((d, i) => <option key={d.file} value={i}>{d.title}</option>)}
      </select>
    </label>
  );
}

function NltkSection({ docIndex, setDocIndex }) {
  const n = nlp.nltk;
  const doc = n.documents[docIndex];
  return (
    <section className="lib-section" aria-labelledby="nltk-heading">
      <h2 id="nltk-heading"><Library name="NLTK" /> Part 1: analysis with NLTK {nlp.meta.nltkVersion}</h2>

      <div className="card">
        <h3>Tokenizing and stopwords</h3>
        <Uses><code>nltk.sent_tokenize</code>, <code>nltk.word_tokenize</code> (Punkt), <code>nltk.corpus.stopwords</code></Uses>
        <p className="muted">
          {n.stopwordsRemoved.toLocaleString()} stopwords removed across the corpus (NLTK English list plus: {n.extraStopwords.join(", ")}).
        </p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Document</th><th>Sentences</th><th>Tokens</th><th>Words</th><th>Unique content words</th><th>Lexical diversity</th></tr></thead>
            <tbody>
              {n.documents.map((d) => (
                <tr key={d.file}><td>{d.title}</td><td>{d.sentences}</td><td>{d.tokens}</td><td>{d.words}</td><td>{d.uniqueContentWords}</td><td>{d.lexicalDiversity}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Word frequency: whole research corpus</h3>
          <Uses><code>nltk.FreqDist</code> over tokens with stopwords removed</Uses>
          <Bars rows={n.topWordsOverall.slice(0, 15)} />
        </div>
        <div className="card">
          <h3>Word frequency: one document</h3>
          <DocPicker value={docIndex} onChange={setDocIndex} />
          <Bars rows={doc.topWords} />
        </div>
      </div>

      <div className="card">
        <h3>VADER sentiment by document</h3>
        <Uses><code>nltk.sentiment.SentimentIntensityAnalyzer</code> (VADER), averaged over sentences of 5+ words</Uses>
        <div className="sent-legend muted"><span className="swatch neg" /> negative <span className="swatch mid" /> neutral (±0.05) <span className="swatch pos" /> positive · scale −0.3 to +0.3</div>
        <ul className="sent-list">
          {n.documents.map((d, i) => (
            <li key={d.file} className={i === docIndex ? "selected" : ""}>
              <button className="link-button" onClick={() => setDocIndex(i)}>{d.title}</button>
              <SentimentBar value={d.sentiment.meanCompound} />
              <span className="bar-value">{d.sentiment.meanCompound.toFixed(3)} · {d.sentiment.label}</span>
            </li>
          ))}
        </ul>
        <div className="grid-2 sentences">
          {doc.sentiment.mostPositive && (
            <blockquote><strong>Most positive sentence in “{doc.title}”</strong> (compound {doc.sentiment.mostPositive.compound})<br />{doc.sentiment.mostPositive.text}</blockquote>
          )}
          {doc.sentiment.mostNegative && (
            <blockquote><strong>Most negative sentence</strong> (compound {doc.sentiment.mostNegative.compound})<br />{doc.sentiment.mostNegative.text}</blockquote>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Collocations: word pairs</h3>
          <Uses><code>BigramCollocationFinder</code> ranked by <code>BigramAssocMeasures.likelihood_ratio</code> (frequency ≥ 2)</Uses>
          <Bars rows={n.bigramCollocations} unit=" occurrences" />
        </div>
        <div className="card">
          <h3>Collocations: three-word phrases</h3>
          <Uses><code>TrigramCollocationFinder</code> ranked by <code>TrigramAssocMeasures.likelihood_ratio</code></Uses>
          <Bars rows={n.trigramCollocations} unit=" occurrences" />
        </div>
      </div>
    </section>
  );
}

function EntityText({ segments }) {
  return (
    <p className="ent-text">
      {segments.map((s, i) => s.label
        ? <mark key={i} className={`ent ent-${LABEL_ORDER.indexOf(s.label) + 1}`} title={LABEL_HELP[s.label]}>{s.text}<span className="ent-label">{s.label}</span></mark>
        : <span key={i}>{s.text}</span>)}
    </p>
  );
}

function SpacySection({ docIndex, setDocIndex }) {
  const s = nlp.spacy;
  const doc = s.documents[docIndex];
  return (
    <section className="lib-section" aria-labelledby="spacy-heading">
      <h2 id="spacy-heading"><Library name="spaCy" /> Part 2: analysis with spaCy {nlp.meta.spacyVersion}</h2>
      <p className="muted">
        Model <code>{nlp.meta.spacyModel}</code>. Pipeline: <span className="chips">{s.pipeline.map((p) => <code key={p} className="chip">{p}</code>)}</span>
      </p>

      <div className="card">
        <h3>Named entities, with a custom EntityRuler</h3>
        <Uses>
          <code>doc.ents</code> from the statistical <code>ner</code> component, plus an <code>entity_ruler</code> added before it with{" "}
          {Object.entries(s.rulerPatterns).map(([k, v]) => `${v} ${k}`).join(", ")} phrase patterns (case-insensitive)
        </Uses>
        <div className="ent-legend">
          {LABEL_ORDER.filter((l) => s.entityLabelCounts[l]).map((l) => (
            <span key={l} title={LABEL_HELP[l]}><span className={`swatch ent-${LABEL_ORDER.indexOf(l) + 1}`} />{l} <span className="muted">({s.entityLabelCounts[l]})</span></span>
          ))}
        </div>
        <DocPicker value={docIndex} onChange={setDocIndex} />
        {doc.highlight.length > 0 && <EntityText segments={doc.highlight} />}
        <div className="ent-grid">
          {LABEL_ORDER.filter((l) => s.topEntitiesByLabel[l]).map((l) => (
            <div key={l}>
              <h4><span className={`swatch ent-${LABEL_ORDER.indexOf(l) + 1}`} />{l}</h4>
              <p className="muted small">{LABEL_HELP[l]}</p>
              <Bars rows={s.topEntitiesByLabel[l].slice(0, 6)} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Noun chunks</h3>
          <Uses><code>doc.noun_chunks</code>, lemmatized, stopwords and pronouns dropped</Uses>
          <Bars rows={s.topNounChunks.slice(0, 15)} />
        </div>
        <div className="card">
          <h3>Lemmas</h3>
          <Uses><code>token.lemma_</code> with <code>token.pos_</code>: the actions the research talks about most (verbs)</Uses>
          <Bars rows={s.topVerbLemmas.slice(0, 12)} />
          {s.lemmaExample && (
            <>
              <p className="small"><strong>Example sentence:</strong> {s.lemmaExample.sentence}</p>
              <div className="table-wrap"><table><thead><tr><th>Word</th><th>Lemma</th></tr></thead>
                <tbody>{s.lemmaExample.pairs.map(([w, l]) => <tr key={w}><td>{w}</td><td>{l}</td></tr>)}</tbody></table></div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h3>Dependency parsing</h3>
        <Uses><code>token.dep_</code>, <code>token.head</code>, <code>token.pos_</code>, drawn with <code>spacy.displacy.render(style="dep")</code></Uses>
        {s.dependencyParses.map((p) => (
          <details key={p.sentence} className="parse" open={p === s.dependencyParses[0]}>
            <summary>{p.sentence}</summary>
            {/* SVG generated by displaCy at build time from this repository's own docs */}
            <div className="displacy" dangerouslySetInnerHTML={{ __html: p.svg }} />
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Token</th><th>Lemma</th><th>POS</th><th>Tag</th><th>Dependency</th><th>Head</th></tr></thead>
                <tbody>{p.tokens.map((t) => (
                  <tr key={t.i}><td>{t.i}</td><td>{t.text}</td><td>{t.lemma}</td><td>{t.pos}</td><td>{t.tag}</td><td>{t.dep}</td><td>{p.tokens[t.head]?.text}</td></tr>
                ))}</tbody>
              </table>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function NlpLab() {
  const [docIndex, setDocIndex] = useState(nlp.meta.documents.length - 1);
  const m = nlp.meta;
  return (
    <div className="page">
      <h1>NLP Lab</h1>
      <p>
        The team's research in <code>docs/</code> ({m.documents.length} documents) analyzed with two NLP libraries:
        <strong> Part 1 uses NLTK</strong> and <strong>Part 2 uses spaCy</strong>.
      </p>
      <p className="provenance muted">
        Computed during the Netlify build by <code>web/scripts/nlp_analysis.py</code> on {new Date(m.generatedAt).toLocaleString()} ·
        Python {m.python} · NLTK {m.nltkVersion} (data: {m.nltkData.join(", ")}) · spaCy {m.spacyVersion} ({m.spacyModel})
      </p>
      <NltkSection docIndex={docIndex} setDocIndex={setDocIndex} />
      <SpacySection docIndex={docIndex} setDocIndex={setDocIndex} />
    </div>
  );
}
