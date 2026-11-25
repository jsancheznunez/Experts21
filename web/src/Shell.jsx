import { useEffect, useState } from "react";
import App from "./App.jsx";
import NlpLab from "./NlpLab.jsx";
import Resources from "./Resources.jsx";

// Hash routes, so every page works on a static host without redirect rules.
const ROUTES = {
  "#/": { label: "Experts", page: App },
  "#/nlp": { label: "NLP Lab (NLTK + spaCy)", page: NlpLab },
  "#/resources": { label: "Resources", page: Resources },
};

const current = () => (ROUTES[window.location.hash] ? window.location.hash : "#/");

export default function Shell() {
  const [route, setRoute] = useState(current);
  useEffect(() => {
    const onHash = () => { setRoute(current()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const Page = ROUTES[route].page;
  return (
    <>
      <header className="nav">
        <a className="brand" href="#/">Experts21</a>
        <nav aria-label="Pages">
          {Object.entries(ROUTES).map(([hash, r]) => (
            <a key={hash} href={hash} aria-current={hash === route ? "page" : undefined}>{r.label}</a>
          ))}
        </nav>
      </header>
      <div className={route === "#/" ? "page-chat" : "page-scroll"}>
        <Page />
      </div>
    </>
  );
}
