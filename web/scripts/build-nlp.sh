#!/usr/bin/env bash
# Build-time NLP step: creates a Python virtual environment, installs NLTK + spaCy
# (nlp-requirements.txt), and runs scripts/nlp_analysis.py, which writes src/nlp/nlp-results.json.
#
# NLP_STRICT=1 (set in netlify.toml): fail the build if the analysis fails. Netlify then keeps the
# previous deploy live, so the site never breaks. Locally, without Python, the committed results are used.
set -uo pipefail
cd "$(dirname "$0")/.."
OUT="src/nlp/nlp-results.json"
PY="${PYTHON:-python3}"

run() {
  "$PY" -m venv .venv-nlp &&
    .venv-nlp/bin/python -m pip install --quiet --disable-pip-version-check -r nlp-requirements.txt &&
    .venv-nlp/bin/python scripts/nlp_analysis.py
}

echo "build-nlp: running NLTK + spaCy analysis with $($PY --version 2>&1)"
if run; then exit 0; fi
if [ "${NLP_STRICT:-0}" = "1" ] || [ ! -f "$OUT" ]; then
  echo "build-nlp: NLP analysis failed" >&2
  exit 1
fi
echo "build-nlp: WARNING: analysis failed; keeping the committed $OUT" >&2
