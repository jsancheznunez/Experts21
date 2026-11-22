import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import team from "./generated/agents.json";
import { PasswordError, startTeam, streamChat, teamStatus } from "./api.js";

const TEAM_ID = "orchestrator";
const POLL_MS = 2500;
const TEAM_TIMEOUT_MS = 16 * 60 * 1000;
const QUEUED_TIMEOUT_MS = 90 * 1000;

const storage = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode: keep in memory only */ }
  },
};

const byName = Object.fromEntries(team.agents.map((a) => [a.name, a]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function Avatar({ agent, size = 36 }) {
  return (
    <span className={`avatar domain-${slug(agent.domain)}`} style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {agent.name === TEAM_ID ? "★" : agent.firstName[0]}
    </span>
  );
}

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-");

function ModelBadge({ model }) {
  return <span className={`badge model-${model}`} title={`Model: ${model}`}>{model}</span>;
}

function AgentCard({ agent, selected, onSelect }) {
  return (
    <button className={`agent-card${selected ? " selected" : ""}`} onClick={() => onSelect(agent.name)} aria-current={selected}>
      <Avatar agent={agent} />
      <span className="agent-card-text">
        <span className="agent-card-top">
          <strong>{agent.firstName}</strong>
          <ModelBadge model={agent.model} />
        </span>
        <span className="agent-title">{agent.title}</span>
        <span className="agent-voice">{agent.voice}</span>
      </span>
    </button>
  );
}

function Sidebar({ selected, onSelect, open }) {
  const maya = byName[TEAM_ID];
  return (
    <nav className={`sidebar${open ? " open" : ""}`} aria-label="Experts">
      <button className={`team-button${selected === TEAM_ID ? " selected" : ""}`} onClick={() => onSelect(TEAM_ID)}>
        <Avatar agent={maya} size={40} />
        <span>
          <strong>Ask the whole team</strong>
          <span className="team-sub">{maya.firstName} picks the experts and merges their answers · <ModelBadge model={maya.model} /></span>
        </span>
      </button>
      {team.domains.map((domain) => {
        const members = team.agents.filter((a) => a.domain === domain && a.name !== TEAM_ID);
        if (!members.length) return null;
        return (
          <section key={domain}>
            <h2 className="domain-heading">{domain}</h2>
            {members.map((a) => <AgentCard key={a.name} agent={a} selected={selected === a.name} onSelect={onSelect} />)}
          </section>
        );
      })}
    </nav>
  );
}

function TeamProgress({ job }) {
  if (!job) return <p className="muted">Starting the team…</p>;
  const experts = Object.entries(job.experts ?? {});
  return (
    <div className="progress">
      {experts.length > 0 && (
        <ul className="expert-status">
          {experts.map(([name, e]) => (
            <li key={name} className={`status-${e.status}`}>
              <span className="dot" aria-hidden="true" />
              {e.firstName} <span className="muted">· {e.title}{e.round === 2 ? " · reviewer" : ""}</span>
              <span className="status-label">{e.status}</span>
            </li>
          ))}
        </ul>
      )}
      <ol className="steps">
        {(job.steps ?? []).map((s, i) => <li key={i}>{s.text}</li>)}
      </ol>
      {experts.some(([, e]) => e.status === "done") && (
        <details>
          <summary>Read the individual expert reports</summary>
          {experts.filter(([, e]) => e.text).map(([name, e]) => (
            <div key={name} className="expert-report">
              <h4>{e.firstName} · {e.title}</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{e.text}</ReactMarkdown>
            </div>
          ))}
        </details>
      )}
    </div>
  );
}

function Message({ msg, agent }) {
  if (msg.role === "user") return <div className="msg user"><div className="bubble">{msg.content}</div></div>;
  return (
    <div className="msg assistant">
      <Avatar agent={agent} size={30} />
      <div className="bubble">
        <div className="msg-author">{agent.firstName}</div>
        {msg.job && msg.job.status !== "done" && !msg.error && <TeamProgress job={msg.job} />}
        {msg.content ? <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown></div>
          : msg.pending && !msg.job ? <p className="muted typing">Thinking…</p> : null}
        {msg.job?.status === "done" && <TeamProgress job={msg.job} />}
        {msg.error && <p className="error">⚠ {msg.error}</p>}
      </div>
    </div>
  );
}

function PasswordPrompt({ onSubmit }) {
  const [value, setValue] = useState("");
  return (
    <form className="password" onSubmit={(e) => { e.preventDefault(); if (value) onSubmit(value); }}>
      <label htmlFor="pw">This app is password-protected. Enter the password set in <code>APP_PASSWORD</code>:</label>
      <div className="row">
        <input id="pw" type="password" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
        <button type="submit">Unlock</button>
      </div>
    </form>
  );
}

export default function App() {
  const [selected, setSelected] = useState(() => (byName[storage.get("experts21-selected", TEAM_ID)] ? storage.get("experts21-selected", TEAM_ID) : TEAM_ID));
  const [conversations, setConversations] = useState(() => storage.get("experts21-conversations", {}));
  const [password, setPassword] = useState(() => storage.get("experts21-password", ""));
  const [needPassword, setNeedPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const endRef = useRef(null);

  const agent = byName[selected];
  const isTeam = selected === TEAM_ID;
  const messages = useMemo(() => conversations[selected] ?? [], [conversations, selected]);

  useEffect(() => { storage.set("experts21-selected", selected); }, [selected]);
  useEffect(() => {
    // Persist finished messages only (not in-flight state).
    const finished = Object.fromEntries(Object.entries(conversations).map(([k, v]) => [k, v.filter((m) => !m.pending)]));
    storage.set("experts21-conversations", finished);
  }, [conversations]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages]);

  const update = (name, fn) => setConversations((all) => ({ ...all, [name]: fn(all[name] ?? []) }));
  const patchLast = (name, patch) => update(name, (list) => list.map((m, i) => (i === list.length - 1 ? { ...m, ...(typeof patch === "function" ? patch(m) : patch) } : m)));

  function selectAgent(name) {
    setSelected(name);
    setSidebarOpen(false);
  }

  async function send(e) {
    e?.preventDefault();
    const question = draft.trim();
    if (!question || busy) return;
    const target = selected;
    const history = (conversations[target] ?? []).filter((m) => !m.error && m.content).map(({ role, content }) => ({ role, content }));
    setDraft("");
    setBusy(true);
    update(target, (list) => [...list, { role: "user", content: question }, { role: "assistant", content: "", pending: true }]);

    try {
      if (target === TEAM_ID) await runTeam(target, question, history);
      else {
        await streamChat({
          agent: target, password,
          messages: [...history, { role: "user", content: question }],
          onText: (t) => patchLast(target, (m) => ({ content: m.content + t })),
        });
      }
      patchLast(target, { pending: false });
    } catch (err) {
      if (err instanceof PasswordError) {
        setNeedPassword(true);
        update(target, (list) => list.slice(0, -2));
        setDraft(question);
      } else {
        patchLast(target, { pending: false, error: err.message });
      }
    } finally {
      setBusy(false);
    }
  }

  async function runTeam(target, question, history) {
    const id = crypto.randomUUID();
    await startTeam({ id, question, history: history.slice(-6), password });
    const started = Date.now();
    for (;;) {
      await sleep(POLL_MS);
      const job = await teamStatus({ id, password });
      if (job.status === "queued") {
        if (Date.now() - started > QUEUED_TIMEOUT_MS) throw new Error("The team run never started. Check the team-run function log in Netlify (see web/README.md, Troubleshooting).");
        continue;
      }
      patchLast(target, { job });
      if (job.status === "done") { patchLast(target, { content: job.answer, job }); return; }
      if (job.status === "error") throw new Error(job.error || "The team run failed.");
      if (Date.now() - started > TEAM_TIMEOUT_MS) throw new Error("The team run took longer than 15 minutes and was stopped.");
    }
  }

  function savePassword(pw) {
    setPassword(pw);
    storage.set("experts21-password", pw);
    setNeedPassword(false);
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="menu-button" onClick={() => setSidebarOpen((o) => !o)} aria-expanded={sidebarOpen}>☰ Experts</button>
        <h1>Experts21 <span className="muted">· Shopify dropshipping advisory team</span></h1>
      </header>
      <Sidebar selected={selected} onSelect={selectAgent} open={sidebarOpen} />
      <main className="chat">
        <div className="chat-header">
          <Avatar agent={agent} size={44} />
          <div>
            <h2>{isTeam ? "The whole team" : `${agent.firstName} · ${agent.title}`} <ModelBadge model={agent.model} /></h2>
            {isTeam ? (
              <p className="muted">
                {agent.firstName} (orchestrator) chooses the right experts, runs them in parallel, has reviewers check their work and
                writes one combined answer. Takes about 2–5 minutes.
              </p>
            ) : (
              <p className="muted"><strong>Voice:</strong> {agent.voice} <strong>Working style:</strong> {agent.style}</p>
            )}
          </div>
          {messages.length > 0 && (
            <button className="ghost" onClick={() => update(selected, () => [])} disabled={busy}>New chat</button>
          )}
        </div>

        <div className="messages" aria-live="polite">
          {messages.length === 0 && (
            <div className="empty">
              <p>{isTeam ? "Ask anything about the store: products, costs, marketing, operations, legal, risk." : agent.description}</p>
              {agent.name !== TEAM_ID && agent.name === "team-architect" && (
                <p className="muted">In this web app Ada can advise on the team's design but can't edit files.</p>
              )}
            </div>
          )}
          {messages.map((m, i) => <Message key={i} msg={m} agent={agent} />)}
          <div ref={endRef} />
        </div>

        {needPassword && <PasswordPrompt onSubmit={savePassword} />}

        <form className="composer" onSubmit={send}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) send(e); }}
            placeholder={isTeam ? "Ask the whole team…" : `Ask ${agent.firstName}…`}
            rows={2}
            disabled={busy}
            aria-label="Your question"
          />
          <button type="submit" disabled={busy || !draft.trim()}>{busy ? "Working…" : "Send"}</button>
        </form>
      </main>
    </div>
  );
}
