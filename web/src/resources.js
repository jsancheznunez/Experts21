// Every link the project relies on. Research sources cited in docs/ are added automatically
// at build time (src/generated/research-links.json).
const REPO = "https://github.com/jsancheznunez/Experts21";
const blob = (path) => `${REPO}/blob/main/${path}`;

export const RESOURCE_GROUPS = [
  {
    title: "This project",
    links: [
      { text: "GitHub repository (jsancheznunez/Experts21)", url: REPO, note: "All code, research, agents, skills and knowledge folders" },
      { text: "Live app on Netlify", url: "https://jocular-granita-d6094c.netlify.app", note: "This site" },
      { text: "Guide: How to talk to your experts", url: blob("docs/how-to-talk-to-your-experts.md"), note: "Example prompts for one expert, a panel, or the whole team" },
      { text: "Guide: Web app and Netlify deploy instructions", url: blob("web/README.md"), note: "Architecture, step-by-step deploy, troubleshooting" },
      { text: "Project overview (CLAUDE.md)", url: blob("CLAUDE.md"), note: "The team, how to use and extend it, guardrails" },
      { text: "Research index (docs/README.md)", url: blob("docs/README.md"), note: "The research the team is built on" },
      { text: "NLP research (docs/09-nlp-text-analysis.md)", url: blob("docs/09-nlp-text-analysis.md"), note: "Why and how NLTK and spaCy are used" },
      { text: "Expert roster", url: blob("docs/expert-roster.md"), note: "Every agent, its job and its skills" },
      { text: "Agent brains & personalities", url: blob("docs/agent-brains.md"), note: "Each agent's model and why" },
      { text: "Agents (.claude/agents)", url: `${REPO}/tree/main/.claude/agents`, note: "One file per expert, including the NLTK and spaCy experts" },
      { text: "Skills (.claude/skills)", url: `${REPO}/tree/main/.claude/skills`, note: "Shared working methods" },
      { text: "Knowledge folders (knowledge/)", url: `${REPO}/tree/main/knowledge`, note: "One folder per agent" },
      { text: "NLP analysis script (NLTK + spaCy)", url: blob("web/scripts/nlp_analysis.py"), note: "Produces the NLP Lab data during the build" },
    ],
  },
  {
    title: "NLTK (used on the NLP Lab page)",
    links: [
      { text: "NLTK documentation", url: "https://www.nltk.org/" },
      { text: "NLTK tokenize API (sent_tokenize, word_tokenize)", url: "https://www.nltk.org/api/nltk.tokenize.html" },
      { text: "NLTK sentiment HOWTO (VADER)", url: "https://www.nltk.org/howto/sentiment.html" },
      { text: "NLTK collocations HOWTO", url: "https://www.nltk.org/howto/collocations.html" },
      { text: "Installing NLTK data (punkt_tab, stopwords, vader_lexicon)", url: "https://www.nltk.org/data.html" },
      { text: "NLTK book (Natural Language Processing with Python)", url: "https://www.nltk.org/book/" },
      { text: "VADER sentiment (original project)", url: "https://github.com/cjhutto/vaderSentiment" },
      { text: "nltk on PyPI", url: "https://pypi.org/project/nltk/" },
    ],
  },
  {
    title: "spaCy (used on the NLP Lab page)",
    links: [
      { text: "spaCy linguistic features (entities, noun chunks, lemmas, dependencies)", url: "https://spacy.io/usage/linguistic-features" },
      { text: "spaCy EntityRuler API", url: "https://spacy.io/api/entityruler" },
      { text: "spaCy rule-based matching", url: "https://spacy.io/usage/rule-based-matching" },
      { text: "spaCy English models (en_core_web_sm)", url: "https://spacy.io/models/en" },
      { text: "displaCy visualizers", url: "https://spacy.io/usage/visualizers" },
      { text: "spaCy Doc API (ents, noun_chunks, sents)", url: "https://spacy.io/api/doc" },
      { text: "spaCy model releases", url: "https://github.com/explosion/spacy-models/releases" },
      { text: "spacy on PyPI", url: "https://pypi.org/project/spacy/" },
    ],
  },
  {
    title: "Claude, Claude Code and the Agent SDK",
    links: [
      { text: "Claude Code subagents", url: "https://code.claude.com/docs/en/sub-agents" },
      { text: "Claude Code skills", url: "https://code.claude.com/docs/en/skills" },
      { text: "Claude Agent SDK overview", url: "https://code.claude.com/docs/en/agent-sdk/overview" },
      { text: "Claude Agent SDK subagents", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
      { text: "Claude Agent SDK quickstart", url: "https://code.claude.com/docs/en/agent-sdk/quickstart" },
      { text: "Claude API documentation", url: "https://platform.claude.com/docs" },
      { text: "Claude Console (API keys)", url: "https://platform.claude.com/" },
      { text: "Anthropic TypeScript SDK", url: "https://github.com/anthropics/anthropic-sdk-typescript" },
      { text: "Using skills on claude.ai", url: "https://support.claude.com/en/articles/12512180-using-skills-on-claude-ai" },
      { text: "How to create custom skills", url: "https://support.claude.com/en/articles/12512198-how-to-create-custom-skills" },
    ],
  },
  {
    title: "Netlify",
    links: [
      { text: "Netlify Functions API", url: "https://docs.netlify.com/build/functions/api/" },
      { text: "Netlify background functions", url: "https://docs.netlify.com/build/functions/background-functions/" },
      { text: "Netlify environment variables", url: "https://docs.netlify.com/build/environment-variables/overview/" },
      { text: "netlify.toml file-based configuration", url: "https://docs.netlify.com/build/configure-builds/file-based-configuration/" },
      { text: "Netlify Blobs", url: "https://docs.netlify.com/build/data-and-storage/netlify-blobs/" },
      { text: "@netlify/blobs on npm", url: "https://www.npmjs.com/package/@netlify/blobs" },
    ],
  },
  {
    title: "Front end",
    links: [
      { text: "React", url: "https://react.dev/" },
      { text: "Vite", url: "https://vite.dev/" },
      { text: "react-markdown", url: "https://github.com/remarkjs/react-markdown" },
      { text: "remark-gfm (tables in answers)", url: "https://github.com/remarkjs/remark-gfm" },
    ],
  },
];
