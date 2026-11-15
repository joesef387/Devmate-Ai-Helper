import { useState } from "react";
import { ArrowUpRight, Sparkles, Code2, PanelsTopLeft, WandSparkles, ShieldCheck, Zap, Menu, X, Copy, Check, Github } from "lucide-react";

const suggestions = [
  { icon: Code2, title: "Build a component", text: "Create a responsive pricing card in React with CSS." },
  { icon: PanelsTopLeft, title: "Improve my UI", text: "Give me 5 ways to make my dashboard look more professional." },
  { icon: WandSparkles, title: "Explain a concept", text: "Explain React props and state with a simple example." }
];

function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="navbar">
    <a className="brand" href="#"><span className="brand-mark"><Sparkles size={18}/></span> PrimeMate<span className="brand-dot">.</span></a>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? "nav-links show" : "nav-links"}>
      <a href="#features" onClick={() => setOpen(false)}>Features</a>
      <a href="#workspace" onClick={() => setOpen(false)}>Workspace</a>
      <a href="#about" onClick={() => setOpen(false)}>About</a>
    </nav>
    <a className="nav-cta" href="#workspace">Try PrimeMate <ArrowUpRight size={15}/></a>
  </header>;
}

function Hero() {
  return <section className="hero">
    <div className="hero-copy">
      <div className="eyebrow"><span className="pulse"></span> YOUR FRONTEND BUILDING PARTNER</div>
      <h1>From idea to interface.<br/><span>Build smarter with AI.</span></h1>
      <p>Meet your practical frontend companion. Get unstuck, explore ideas, and turn your next big idea into clean, responsive interfaces.</p>
      <div className="hero-actions"><a href="#workspace" className="primary-btn">Start building <ArrowUpRight size={17}/></a><a href="#features" className="text-btn">Explore features</a></div>
      <div className="hero-proof"><div className="avatar-stack"><i>J</i><i>D</i><i>A</i></div><span>Made for curious builders and growing developers.</span></div>
    </div>
    <div className="hero-visual">
      <div className="glow"></div>
      <div className="code-window">
        <div className="window-top"><div className="window-dots"><i></i><i></i><i></i></div><span>your-next-project.jsx</span><span className="live-tag">● LIVE PREVIEW</span></div>
        <div className="code-content">
          <div className="line"><b>01</b><span className="purple">const</span> <span className="blue">Dream</span> = <span className="yellow">"Your idea"</span>;</div>
          <div className="line"><b>02</b><span className="purple">function</span> <span className="blue">BuildSomething</span>() {"{"}</div>
          <div className="line indent"><b>03</b><span className="purple">return</span> (</div>
          <div className="line indent2"><b>04</b>&lt;<span className="green">BeautifulUI</span></div>
          <div className="line indent3"><b>05</b>responsive</div>
          <div className="line indent3"><b>06</b>accessible</div>
          <div className="line indent3"><b>07</b>madeWithCare /&gt;</div>
          <div className="line indent"><b>08</b>);</div>
          <div className="line"><b>09</b>{"}"}</div>
          <div className="ai-tip"><span><Sparkles size={15}/></span><div><strong>PrimeMate suggestion</strong><small>Great interfaces start with clear components.</small></div><ArrowUpRight size={16}/></div>
        </div>
      </div>
      <div className="floating-chip"><span className="chip-icon"><Zap size={16}/></span><div><strong>Build with confidence</strong><small>One step at a time</small></div></div>
    </div>
  </section>;
}

function FeatureCard({ icon: Icon, title, text, number }) {
  return <article className="feature-card"><div className="feature-top"><span className="feature-icon"><Icon size={20}/></span><span className="feature-number">{number}</span></div><h3>{title}</h3><p>{text}</p><a href="#workspace">Explore <ArrowUpRight size={14}/></a></article>;
}

function Workspace() {
  const [prompt, setPrompt] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function createDemoAnswer(task, skillLevel) {
    return `## Suggested approach for "${task}"

### Start with the structure
- Break the interface into a few reusable React components.
- Define the state and content each component needs.
- Keep the markup semantic and easy to scan.

### Build the UI in layers
1. Add the layout and component structure.
2. Add responsive styles, spacing, and typography.
3. Add hover and keyboard-focus states.

### Polish and test
- Check the result at mobile and desktop widths.
- Review color contrast and keyboard navigation.
- Include loading, empty, and error states where helpful.

**Skill level:** ${skillLevel}

Demo mode is active. Connect a backend API to enable live AI answers.`;
  }

  function formatAnswer(rawText) {
    if (!rawText) return [];

    return rawText
      .split(/\n\s*\n+/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        const lines = block
          .split(/\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        if (!lines.length) return null;

        const headingMatch = lines[0].match(/^#{1,3}\s+(.*)$/);
        const heading = headingMatch ? headingMatch[1] : null;
        const content = heading ? lines.slice(1) : lines;
        const bulletItems = content.filter((line) => /^[-*]\s+/.test(line));
        const numberedItems = content.filter((line) => /^\d+[.)]\s+/.test(line));
        const body = bulletItems.length
          ? bulletItems.map((item) => item.replace(/^[-*]\s+/, ""))
          : numberedItems.length
            ? numberedItems.map((item) => item.replace(/^\d+[.)]\s+/, ""))
            : content.map((line) => line);

        return { heading, body, isParagraph: !bulletItems.length && !numberedItems.length };
      })
      .filter(Boolean);
  }

  async function generate(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true); setError(""); setAnswer(""); setMode("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      if (import.meta.env.PROD && !apiUrl) {
        setAnswer(createDemoAnswer(prompt, level));
        setMode("demo");
        return;
      }

      const response = await fetch(`${apiUrl || ""}/api/generate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, skillLevel: level })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setAnswer(data.answer); setMode(data.mode);
    } catch (err) {
      setError("Couldn't reach the helper. Start the API server, or check your connection.");
    } finally { setLoading(false); }
  }

  async function copyAnswer() {
    await navigator.clipboard.writeText(answer);
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  }

  return <section className="workspace-section" id="workspace">
    <div className="section-heading"><div><div className="eyebrow">THE DEV MATE WORKSPACE</div><h2>What are we <span>building today?</span></h2></div><p>Ask a question, describe a challenge, or bring an idea. Let's work through it.</p></div>
    <div className="workspace-grid">
      <div className="prompt-panel">
        <div className="panel-label"><span className="status-dot"></span> NEW CONVERSATION <span className="panel-count">01 / 01</span></div>
        <form onSubmit={generate}>
          <label htmlFor="prompt">Your frontend task</label>
          <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g. Help me build a responsive navigation bar in React..." rows="5" />
          <div className="form-bottom"><label htmlFor="level">Your experience</label><select id="level" value={level} onChange={e => setLevel(e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
          <button className="generate-btn" disabled={loading || !prompt.trim()}>{loading ? "Thinking..." : "Generate with PrimeMate"} <Sparkles size={17}/></button>
        </form>
        <div className="suggestions-title">NEED AN IDEA? TRY ONE</div>
        <div className="suggestion-list">{suggestions.map(item => <button key={item.title} className="suggestion" onClick={() => setPrompt(item.text)}><item.icon size={16}/><span>{item.title}</span><ArrowUpRight size={14}/></button>)}</div>
      </div>
      <div className="response-panel">
        <div className="response-header"><div><span className="response-icon"><Sparkles size={17}/></span><div><strong>PrimeMate response</strong><small>Your AI-powered workspace</small></div></div>{mode && <span className="mode-badge">{mode === "live" ? "LIVE AI" : "DEMO MODE"}</span>}</div>
        <div className="response-body">
          {loading ? <div className="empty-state"><div className="loader"></div><h3>Thinking through your idea...</h3><p>Putting together a useful response.</p></div> :
           answer ? <>
             <div className="answer-label">HERE'S YOUR GAME PLAN</div>
             <div className="answer-content">
               {formatAnswer(answer).map((block, index) => (
                 <div className="answer-block" key={`${block.heading || "section"}-${index}`}>
                   {block.heading && <h4 className="answer-heading">{block.heading}</h4>}
                   {block.isParagraph ? (
                     <p className="answer-paragraph">{block.body.join(" ")}</p>
                   ) : (
                     <ul className="answer-list">
                       {block.body.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}
                     </ul>
                   )}
                 </div>
               ))}
             </div>
             <button className="copy-btn" onClick={copyAnswer}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copied" : "Copy response"}</button>
           </> :
           error ? <div className="empty-state"><span className="empty-spark">!</span><h3>Let's reconnect</h3><p>{error}</p></div> :
           <div className="empty-state"><div className="empty-orbit"><Sparkles size={27}/></div><h3>Your next idea starts here.</h3><p>Send your first prompt and your personalised frontend guidance will appear here.</p><div className="response-tags"><span>React</span><span>CSS</span><span>JavaScript</span><span>UI / UX</span></div></div>}
        </div>
        <div className="response-footer"><ShieldCheck size={15}/> Built to help you learn, not just copy code.</div>
      </div>
    </div>
  </section>;
}

function App() {
  return <div className="app-shell"><Navbar/><main><Hero/>
    <section className="features-section" id="features"><div className="section-heading centered"><div><div className="eyebrow">A BETTER WAY TO BUILD</div><h2>Your ideas. <span>More momentum.</span></h2></div><p>Everything you need to move from stuck to shipped, with a little help along the way.</p></div>
      <div className="feature-grid"><FeatureCard number="01" icon={Code2} title="Build with clarity" text="Turn rough ideas into structured React components and practical implementation steps."/><FeatureCard number="02" icon={WandSparkles} title="Learn as you go" text="Get explanations matched to your experience, from first steps to advanced patterns."/><FeatureCard number="03" icon={ShieldCheck} title="Think like a pro" text="Keep accessibility, responsive layouts, and maintainable code in your workflow."/></div>
    </section>
    <Workspace/>
    <section className="closing" id="about"><div className="closing-icon"><Sparkles size={22}/></div><div><h2>Good code starts with a good question.</h2><p>Bring the idea. PrimeMate will help you find the next step.</p></div><a href="#workspace" className="primary-btn">Let's build <ArrowUpRight size={16}/></a></section>
  </main><footer><a className="brand" href="#"><span className="brand-mark"><Sparkles size={16}/></span> PrimeMate<span className="brand-dot">.</span></a><span>© 2026 PrimeMate. Built for the next generation of creators.</span><a href="#workspace"><Github size={16}/> Keep building</a></footer></div>;
}

export default App;