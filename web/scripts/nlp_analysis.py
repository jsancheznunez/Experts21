"""Build-time NLP analysis of the team's research (docs/0*.md) with NLTK and spaCy.

Writes web/src/nlp/nlp-results.json, which the app's "NLP Lab" page displays.
Run by scripts/build-nlp.sh during every Netlify build (see web/README.md).

NLTK part:  sentence/word tokenizing, stopword removal, word frequency (FreqDist),
            VADER sentiment, bigram/trigram collocations.
spaCy part: named entities (statistical NER + a custom EntityRuler), noun chunks,
            lemmas, part-of-speech tags and dependency parses (with displaCy SVGs).
"""

import json
import os
import platform
import re
import statistics
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

import nltk
import spacy
from nltk.collocations import BigramCollocationFinder, TrigramCollocationFinder
from nltk.metrics import BigramAssocMeasures, TrigramAssocMeasures
from nltk.probability import FreqDist
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import sent_tokenize, word_tokenize
from spacy import displacy

WEB = Path(__file__).resolve().parents[1]
REPO = WEB.parent
OUT = WEB / "src" / "nlp" / "nlp-results.json"
NLTK_DIR = Path(os.environ.get("NLTK_DATA_DIR", WEB / ".nltk_data"))
NLTK_PACKAGES = ["punkt_tab", "stopwords", "vader_lexicon"]
SPACY_MODEL = "en_core_web_sm"

# ---------------------------------------------------------------- text prep


# Table cells that are only ratings or numbers (risk scores, star ratings) add noise, not language.
RATING_CELL = re.compile(r"(?i)(high|medium|low|medium[–-]high|low[–-]medium|★+|[\d.,$%~–-]+|#)")
# A few extra stopwords for this corpus, on top of NLTK's English list.
EXTRA_STOPWORDS = {"per", "via", "etc", "also", "may", "one", "see"}


def markdown_to_text(md: str) -> str:
    """Turn a research Markdown file into plain prose for analysis."""
    md = re.split(r"^##\s+Sources\b", md, flags=re.M)[0]  # citations are links, not prose
    md = re.sub(r"```.*?```", " ", md, flags=re.S)
    md = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", md)
    md = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", md)  # [text](url) -> text
    md = re.sub(r"https?://\S+", " ", md)
    lines = []
    for line in md.splitlines():
        s = line.strip()
        if re.match(r"^>\s*Research date", s):  # repeated header line in every doc
            continue
        if not s or re.fullmatch(r"\|?[\s:|-]+\|?", s):  # blank or table separator
            continue
        if s.startswith("|"):  # table row -> a sentence
            cells = [c.strip() for c in s.strip("|").split("|") if c.strip() and not RATING_CELL.fullmatch(c.strip())]
            if not cells:
                continue
            s = "; ".join(cells) + "."
        s = re.sub(r"^#+\s*", "", s)
        s = re.sub(r"^>\s*(\[!\w+\])?\s*", "", s)
        s = re.sub(r"^([-*]|\d+\.)\s+", "", s)
        s = s.replace("**", "").replace("`", "").replace("*", "").replace("★", "")
        if s and s[-1] not in ".!?:;":
            s += "."
        lines.append(s)
    return "\n".join(lines)


def load_docs():
    docs = []
    for path in sorted((REPO / "docs").glob("0*.md")):
        md = path.read_text(encoding="utf-8")
        title = next((l.lstrip("# ").strip() for l in md.splitlines() if l.startswith("# ")), path.stem)
        docs.append({"file": f"docs/{path.name}", "title": title, "text": markdown_to_text(md)})
    if not docs:
        sys.exit("nlp_analysis: no docs/0*.md files found")
    return docs


# ---------------------------------------------------------------- NLTK


def ensure_nltk_data():
    NLTK_DIR.mkdir(parents=True, exist_ok=True)
    nltk.data.path.insert(0, str(NLTK_DIR))
    for pkg in NLTK_PACKAGES:
        if not nltk.download(pkg, download_dir=str(NLTK_DIR), quiet=True):
            sys.exit(f"nlp_analysis: could not download NLTK data package {pkg}")


def nltk_analysis(docs):
    stop = set(nltk.corpus.stopwords.words("english")) | EXTRA_STOPWORDS
    sia = SentimentIntensityAnalyzer()
    per_doc, all_content, all_words = [], [], []

    for d in docs:
        sents = sent_tokenize(d["text"])
        tokens = word_tokenize(d["text"])
        words = [t.lower() for t in tokens if t.isalpha()]
        content = [w for w in words if w not in stop and len(w) > 2]
        all_words.extend(words)
        all_content.extend(content)

        scored = [(s, sia.polarity_scores(s)) for s in sents if len(s.split()) >= 5]
        compounds = [sc["compound"] for _, sc in scored]
        mean = statistics.fmean(compounds) if compounds else 0.0
        best = max(scored, key=lambda x: x[1]["compound"]) if scored else None
        worst = min(scored, key=lambda x: x[1]["compound"]) if scored else None
        per_doc.append({
            "file": d["file"],
            "title": d["title"],
            "sentences": len(sents),
            "tokens": len(tokens),
            "words": len(words),
            "uniqueContentWords": len(set(content)),
            "lexicalDiversity": round(len(set(words)) / len(words), 3) if words else 0,
            "topWords": [[w, c] for w, c in FreqDist(content).most_common(12)],
            "sentiment": {
                "meanCompound": round(mean, 3),
                "label": "positive" if mean >= 0.05 else "negative" if mean <= -0.05 else "neutral",
                "positiveShare": round(sum(c >= 0.05 for c in compounds) / len(compounds), 3) if compounds else 0,
                "negativeShare": round(sum(c <= -0.05 for c in compounds) / len(compounds), 3) if compounds else 0,
                "mostPositive": {"text": best[0][:300], "compound": best[1]["compound"]} if best else None,
                "mostNegative": {"text": worst[0][:300], "compound": worst[1]["compound"]} if worst else None,
            },
        })

    word_filter = lambda w: w in stop or len(w) < 3  # noqa: E731
    bigrams = BigramCollocationFinder.from_words(all_words)
    bigrams.apply_word_filter(word_filter)
    bigrams.apply_freq_filter(2)
    trigrams = TrigramCollocationFinder.from_words(all_words)
    trigrams.apply_word_filter(word_filter)
    trigrams.apply_freq_filter(2)

    return {
        "stopwordsRemoved": len(all_words) - len(all_content),
        "extraStopwords": sorted(EXTRA_STOPWORDS),
        "topWordsOverall": [[w, c] for w, c in FreqDist(all_content).most_common(25)],
        "bigramCollocations": [[" ".join(g), bigrams.ngram_fd[g]] for g in bigrams.nbest(BigramAssocMeasures.likelihood_ratio, 20)],
        "trigramCollocations": [[" ".join(g), trigrams.ngram_fd[g]] for g in trigrams.nbest(TrigramAssocMeasures.likelihood_ratio, 10)],
        "documents": per_doc,
    }


# ---------------------------------------------------------------- spaCy

RULER_PATTERNS = {
    "PLATFORM": ["Shopify", "Shopify Payments", "Shop Pay", "TikTok Shop", "TikTok", "Temu", "Shein", "AliExpress",
                 "Amazon", "Meta", "Facebook", "Instagram", "Google Shopping", "Klaviyo", "Omnisend",
                 "CJdropshipping", "DSers", "AutoDS", "Zendrop", "Spocket", "Doba", "PayPal", "Gorgias"],
    "REGULATION": ["FTC", "Mail Order Rule", "Consumer Review Rule", "Endorsement Guides", "CCPA", "CPRA", "GDPR",
                   "UK GDPR", "TCPA", "CAN-SPAM", "CPSC", "de minimis", "Prop 65", "ADA", "Section 301"],
    "METRIC": ["ROAS", "break-even ROAS", "CPA", "CPM", "CPC", "AOV", "CTR", "MER", "conversion rate",
               "chargeback rate", "refund rate", "contribution margin", "net margin"],
}
ENTITY_LABELS = ["PLATFORM", "REGULATION", "METRIC", "ORG", "MONEY", "PERCENT", "DATE", "GPE"]


def load_spacy():
    nlp = spacy.load(SPACY_MODEL)
    ruler = nlp.add_pipe("entity_ruler", before="ner", config={"phrase_matcher_attr": "LOWER"})
    ruler.add_patterns([{"label": label, "pattern": p} for label, phrases in RULER_PATTERNS.items() for p in phrases])
    return nlp


def token_rows(sent):
    return [{"i": t.i - sent.start, "text": t.text, "lemma": t.lemma_, "pos": t.pos_, "tag": t.tag_,
             "dep": t.dep_, "head": t.head.i - sent.start} for t in sent]


def pick_parse_sentences(parsed, n=3):
    """Short, complete sentences with a verb root that mention a custom entity."""
    chosen = []
    for _, doc in parsed:
        for sent in doc.sents:
            if not 9 <= len(sent) <= 18 or sent.root.pos_ not in {"VERB", "AUX"} or ";" in sent.text:
                continue
            if any(e.label_ in RULER_PATTERNS for e in sent.ents) and sent.text[0].isupper():
                chosen.append(sent)
                break
        if len(chosen) >= n:
            break
    return chosen


def highlight_segments(doc, max_chars=700):
    """The paragraph with the most entities, split into plain/entity segments for the UI."""
    best, best_count = None, -1
    for para in doc.text.split("\n"):
        if len(para) < 120:
            continue
        start = doc.text.find(para)
        span = doc.char_span(start, start + min(len(para), max_chars), alignment_mode="contract")
        if span is None:
            continue
        count = len(span.ents)
        if count > best_count:
            best, best_count = span, count
    if best is None:
        return []
    segments, cursor = [], best.start_char
    for ent in best.ents:
        if ent.start_char > cursor:
            segments.append({"text": doc.text[cursor:ent.start_char]})
        segments.append({"text": ent.text, "label": ent.label_})
        cursor = ent.end_char
    segments.append({"text": doc.text[cursor:best.end_char]})
    return segments


def spacy_analysis(docs):
    nlp = load_spacy()
    parsed = list(zip(docs, nlp.pipe(d["text"] for d in docs)))

    label_counts, by_label = Counter(), defaultdict(Counter)
    chunk_counts, verb_lemmas, adj_lemmas = Counter(), Counter(), Counter()
    per_doc = []
    for d, doc in parsed:
        doc_labels = Counter()
        for ent in doc.ents:
            if ent.label_ in ENTITY_LABELS:
                label_counts[ent.label_] += 1
                doc_labels[ent.label_] += 1
                by_label[ent.label_][ent.text.strip()] += 1
        doc_chunks = Counter()
        for chunk in doc.noun_chunks:
            if chunk.root.pos_ == "PRON" or all(t.is_stop or not t.is_alpha for t in chunk):
                continue
            key = " ".join(t.lemma_.lower() for t in chunk if not t.is_stop and t.is_alpha)
            if len(key) > 2:
                doc_chunks[key] += 1
                chunk_counts[key] += 1
        for t in doc:
            if t.is_alpha and not t.is_stop:
                if t.pos_ == "VERB":
                    verb_lemmas[t.lemma_.lower()] += 1
                elif t.pos_ == "ADJ":
                    adj_lemmas[t.lemma_.lower()] += 1
        per_doc.append({
            "file": d["file"],
            "title": d["title"],
            "entityCounts": dict(doc_labels.most_common()),
            "topNounChunks": [[c, n] for c, n in doc_chunks.most_common(8)],
            "highlight": highlight_segments(doc),
        })

    parses = []
    for sent in pick_parse_sentences(parsed):
        sdoc = sent.as_doc()
        svg = displacy.render(sdoc, style="dep", jupyter=False,
                              options={"compact": True, "distance": 95, "bg": "transparent", "color": "currentColor", "font": "inherit"})
        parses.append({"sentence": sent.text.strip(), "tokens": token_rows(sent), "svg": svg})

    # Lemmatization example: inflected words and their lemmas from one sentence.
    lemma_example = None
    for _, doc in parsed:
        for sent in doc.sents:
            changed = [(t.text, t.lemma_) for t in sent if t.is_alpha and t.text.lower() != t.lemma_.lower()]
            if len(changed) >= 4 and len(sent) <= 30:
                lemma_example = {"sentence": sent.text, "pairs": changed}
                break
        if lemma_example:
            break

    return {
        "pipeline": nlp.pipe_names,
        "rulerPatterns": {k: len(v) for k, v in RULER_PATTERNS.items()},
        "entityLabelCounts": dict(label_counts.most_common()),
        "topEntitiesByLabel": {lab: [[e, c] for e, c in by_label[lab].most_common(10)] for lab in ENTITY_LABELS if by_label[lab]},
        "topNounChunks": [[c, n] for c, n in chunk_counts.most_common(20)],
        "topVerbLemmas": [[l, n] for l, n in verb_lemmas.most_common(15)],
        "topAdjectiveLemmas": [[l, n] for l, n in adj_lemmas.most_common(10)],
        "lemmaExample": lemma_example,
        "dependencyParses": parses,
        "documents": per_doc,
    }


# ---------------------------------------------------------------- main


def main():
    docs = load_docs()
    ensure_nltk_data()
    model_meta = spacy.load(SPACY_MODEL).meta
    results = {
        "meta": {
            "generatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "python": platform.python_version(),
            "nltkVersion": nltk.__version__,
            "nltkData": NLTK_PACKAGES,
            "spacyVersion": spacy.__version__,
            "spacyModel": f"{SPACY_MODEL} {model_meta.get('version')}",
            "documents": [{"file": d["file"], "title": d["title"], "characters": len(d["text"])} for d in docs],
        },
        "nltk": nltk_analysis(docs),
        "spacy": spacy_analysis(docs),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")
    s = results["spacy"]
    print(f"nlp_analysis: {len(docs)} docs | NLTK {nltk.__version__}: {len(results['nltk']['bigramCollocations'])} collocations | "
          f"spaCy {spacy.__version__}: {sum(s['entityLabelCounts'].values())} entities, {len(s['dependencyParses'])} parses -> {OUT.relative_to(REPO)}")


if __name__ == "__main__":
    main()
