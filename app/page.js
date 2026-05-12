"use client";
import { useState, useRef, useCallback } from "react";
import { TOOLS } from "../lib/tools";
import OutputPanel from "../components/OutputPanel";
import HistoryPanel from "../components/HistoryPanel";
import "./globals.css";

function useStream() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const run = useCallback(async (toolId, input) => {
    if (!input.trim()) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true); setError(""); setOutput("");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: toolId, input }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || `Error ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n"); buf = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const p = JSON.parse(data);
              if (p.text) setOutput(prev => prev + p.text);
            } catch {}
          }
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally { setLoading(false); }
  }, []);

  const stop = useCallback(() => { abortRef.current?.abort(); setLoading(false); }, []);
  const clear = useCallback(() => { abortRef.current?.abort(); setOutput(""); setError(""); setLoading(false); }, []);
  return { output, loading, error, run, stop, clear };
}

export default function Page() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const textareaRef = useRef(null);
  const { output, loading, error, run, stop, clear } = useStream();
  const tool = TOOLS[activeIdx];

  const handleRun = useCallback(() => {
    if (!input.trim()) return;
    run(tool.id, input);
    setHistory(prev => [{
      toolLabel: tool.label, toolEmoji: tool.emoji,
      toolColor: tool.color, input, output: "",
      time: new Date().toLocaleTimeString(),
    }, ...prev].slice(0, 30));
  }, [run, tool, input]);

  const handleSwitch = useCallback((idx) => {
    setActiveIdx(idx); setInput(""); clear();
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [clear]);

  const handleClear = useCallback(() => { setInput(""); clear(); }, [clear]);

  const handleRestore = useCallback((item) => {
    const idx = TOOLS.findIndex(t => t.id === item.toolId);
    if (idx >= 0) setActiveIdx(idx);
    setInput(item.input || ""); clear();
  }, [clear]);

  const tokenEst = Math.ceil(input.length / 4);

  const secBtn = {
    background:"transparent", border:"1px solid #21262d", color:"#6e7681",
    fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
    padding:"10px 14px", borderRadius:"5px", cursor:"pointer",
    letterSpacing:"0.08em", transition:"all 0.15s",
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* Scanlines */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:999,
        background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.025) 2px,rgba(0,0,0,0.025) 4px)" }} />

      {/* ── HEADER ── */}
      <header style={{
        background:"#0d1117cc", borderBottom:"1px solid #21262d",
        padding:"0 28px", height:"58px", display:"flex", alignItems:"center",
        gap:"14px", position:"sticky", top:0, zIndex:100, backdropFilter:"blur(16px)",
      }}>
        <div style={{
          width:"34px", height:"34px", borderRadius:"7px", background:tool.color,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"17px", transition:"background 0.3s", boxShadow:`0 0 18px ${tool.glow}`,
        }}>⬡</div>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"15px", letterSpacing:"-0.03em" }}>
            AI Security & Dev Suite
          </div>
          <div style={{ fontSize:"9px", color:"#6e7681", letterSpacing:"0.15em", textTransform:"uppercase" }}>
            Next.js · Groq LLaMA · Free & Fast
          </div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"14px" }}>
          <div style={{ background:`${tool.color}11`, border:`1px solid ${tool.color}44`, color:tool.color,
            fontSize:"9px", fontWeight:700, letterSpacing:"0.12em", padding:"4px 12px",
            borderRadius:"20px", textTransform:"uppercase", transition:"all 0.3s" }}>
            {tool.emoji} {tool.label}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"10px", color:"#3fb950" }}>
            <span style={{ animation:"pulse 2s infinite" }}>●</span>
            <span style={{ letterSpacing:"0.1em" }}>LIVE</span>
          </div>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav style={{ background:"#0d1117", borderBottom:"1px solid #21262d",
        padding:"0 28px", display:"flex", overflowX:"auto" }}>
        {TOOLS.map((t, i) => (
          <button key={t.id} onClick={() => handleSwitch(i)}
            title={`${t.label} (Ctrl+${i+1})`}
            style={{
              background:"transparent", border:"none",
              borderBottom:`2px solid ${i===activeIdx ? t.color : "transparent"}`,
              color: i===activeIdx ? t.color : "#6e7681",
              fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", fontWeight:700,
              letterSpacing:"0.1em", textTransform:"uppercase",
              padding:"13px 16px", cursor:"pointer", whiteSpace:"nowrap",
              transition:"all 0.15s", marginBottom:"-1px",
            }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </nav>

      {/* ── MAIN ── */}
      <main style={{ flex:1, maxWidth:"920px", margin:"0 auto", width:"100%", padding:"26px 24px 80px" }}>

        {/* Tool header */}
        <div key={tool.id} style={{ animation:"fadeUp 0.2s ease", marginBottom:"20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px", flexWrap:"wrap" }}>
            <div style={{ width:"9px", height:"9px", borderRadius:"50%",
              background:tool.color, boxShadow:`0 0 14px ${tool.color}`, flexShrink:0 }} />
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900,
              fontSize:"22px", letterSpacing:"-0.03em" }}>{tool.label}</h1>
            <span style={{ border:`1px solid ${tool.color}44`, background:`${tool.color}11`,
              color:tool.color, fontSize:"9px", fontWeight:700, letterSpacing:"0.12em",
              textTransform:"uppercase", padding:"3px 10px", borderRadius:"20px" }}>
              {tool.short}
            </span>
          </div>
          <p style={{ fontSize:"11px", color:"#6e7681", paddingLeft:"19px", lineHeight:1.75 }}>
            {tool.desc}
          </p>
        </div>

        {/* Accent line */}
        <div style={{ height:"1px", marginBottom:"18px",
          background:`linear-gradient(90deg,${tool.color}77,${tool.color}11,transparent)` }} />

        {/* Input */}
        <div style={{ position:"relative" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if ((e.ctrlKey||e.metaKey) && e.key==="Enter") { e.preventDefault(); handleRun(); } }}
            placeholder={tool.placeholder}
            rows={8}
            style={{
              width:"100%", background:"#0d1117",
              border:`1px solid ${loading ? tool.color+"66" : "#21262d"}`,
              borderRadius:"8px", color:"#e6edf3",
              fontFamily:"'JetBrains Mono',monospace", fontSize:"12.5px",
              lineHeight:1.7, padding:"16px", resize:"vertical", outline:"none",
              transition:"border-color 0.2s, box-shadow 0.2s",
              boxShadow: loading ? `0 0 0 1px ${tool.color}33,inset 0 0 30px ${tool.color}05` : "none",
            }}
            onFocus={e => { e.target.style.borderColor=tool.color+"77"; e.target.style.boxShadow=`0 0 0 1px ${tool.color}22`; }}
            onBlur={e => { if(!loading){ e.target.style.borderColor="#21262d"; e.target.style.boxShadow="none"; } }}
          />
          {input && (
            <div style={{ position:"absolute", bottom:"10px", right:"12px",
              fontSize:"9px", color:"#3d4451", pointerEvents:"none" }}>
              ~{tokenEst} tokens · {input.length} chars
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginTop:"12px", flexWrap:"wrap" }}>
          {loading ? (
            <button onClick={stop} style={{
              background:"transparent", border:`1px solid ${tool.color}`,
              color:tool.color, fontFamily:"'JetBrains Mono',monospace",
              fontWeight:700, fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase",
              padding:"10px 22px", borderRadius:"5px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:"8px",
            }}>
              <span style={{ animation:"spin 0.8s linear infinite", display:"inline-block" }}>◌</span> Stop
            </button>
          ) : (
            <button onClick={handleRun} disabled={!input.trim()} style={{
              background: input.trim() ? tool.color : "transparent",
              border:`1px solid ${tool.color}`,
              color: input.trim() ? "#0d1117" : tool.color,
              fontFamily:"'JetBrains Mono',monospace", fontWeight:700,
              fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase",
              padding:"10px 22px", borderRadius:"5px",
              cursor: input.trim() ? "pointer" : "not-allowed",
              opacity: input.trim() ? 1 : 0.5, transition:"all 0.15s",
            }}>▶ Run Analysis</button>
          )}

          {(input||output) && !loading && (
            <button onClick={handleClear} style={secBtn}>✕ Clear</button>
          )}

          <span style={{ marginLeft:"auto", color:"#3d4451", fontSize:"10px" }}>
            Ctrl+Enter to run
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop:"14px", padding:"14px 16px",
            background:"#ff000011", border:"1px solid #ff000044",
            borderRadius:"6px", color:"#ff6b6b",
            fontFamily:"'JetBrains Mono',monospace", fontSize:"12px", lineHeight:1.7 }}>
            ⚠ {error}
          </div>
        )}

        {/* Output */}
        {(output || (loading && !error)) && (
          <OutputPanel tool={tool} output={output} loading={loading} />
        )}

        {/* Tool grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)",
          gap:"8px", marginTop:"28px", border:"1px solid #21262d",
          borderRadius:"8px", padding:"14px", background:"#0d111766" }}>
          {TOOLS.map((t, i) => (
            <div key={t.id} onClick={() => handleSwitch(i)}
              style={{
                textAlign:"center", padding:"10px 4px", borderRadius:"6px", cursor:"pointer",
                background: i===activeIdx ? `${t.color}11` : "transparent",
                border:`1px solid ${i===activeIdx ? t.color+"44" : "transparent"}`,
                transition:"all 0.15s",
              }}
              onMouseEnter={e => { if(i!==activeIdx) e.currentTarget.style.background="#ffffff07"; }}
              onMouseLeave={e => { if(i!==activeIdx) e.currentTarget.style.background="transparent"; }}>
              <div style={{ fontSize:"18px", marginBottom:"5px" }}>{t.emoji}</div>
              <div style={{ fontSize:"8px", letterSpacing:"0.08em", textTransform:"uppercase",
                color: i===activeIdx ? t.color : "#6e7681", lineHeight:1.4 }}>{t.label}</div>
              <div style={{ fontSize:"8px", color:"#3d4451", marginTop:"2px" }}>Ctrl+{i+1}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid #21262d", padding:"12px 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"#0d1117", fontSize:"10px", color:"#3d4451", letterSpacing:"0.06em" }}>
        <span>AI SECURITY & DEV SUITE v2 — GROQ + LLAMA 3.3 70B</span>
        <span>Free · Fast · 1500 req/day</span>
      </footer>

      <HistoryPanel history={history} onRestore={handleRestore} onClear={() => setHistory([])} />
    </div>
  );
}
