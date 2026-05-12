"use client";
import { useRef, useEffect, useState } from "react";

function renderLine(line, i) {
  if (!line.trim()) return <div key={i} style={{ height: "8px" }} />;

  if (line.includes("SEVERITY RATING") || line.includes("VULNERABILITIES") ||
      line.includes("SUMMARY") || line.includes("CHALLENGE CATEGORY") ||
      line.includes("PROGRESSIVE HINTS") || line.includes("CONCEPT EXPLAINED") ||
      line.includes("USEFUL TOOLS") || line.includes("WALKTHROUGH") ||
      line.includes("SECURITY FINDINGS") || line.includes("CODE QUALITY") ||
      line.includes("RECOMMENDATIONS") || line.includes("QUALITY SCORE") ||
      line.includes("VULNERABILITY OVERVIEW") || line.includes("TECHNICAL DETAILS") ||
      line.includes("EXPLOITATION") || line.includes("MITIGATION") ||
      line.includes("PATCH URGENCY")) {
    return (
      <div key={i} style={{
        color: "#a0aab4", fontSize: "10px", fontWeight: 700,
        letterSpacing: "0.2em", textTransform: "uppercase",
        marginTop: "18px", marginBottom: "8px",
        borderBottom: "1px solid #21262d", paddingBottom: "5px",
      }}>{line}</div>
    );
  }

  const ratingMatch = line.match(/\[(CRITICAL|HIGH|MEDIUM|LOW|INFO|CLEAN)\]/);
  if (ratingMatch) {
    const colors = { CRITICAL:"#ff6b6b", HIGH:"#ff6b35", MEDIUM:"#f59e0b", LOW:"#22c55e", INFO:"#00d4ff", CLEAN:"#22c55e" };
    const c = colors[ratingMatch[1]];
    return (
      <div key={i} style={{ marginBottom: "5px", lineHeight: 1.75 }}>
        <span style={{ background: c+"22", color: c, fontWeight:700, fontSize:"10px", padding:"2px 8px", borderRadius:"3px", marginRight:"8px", letterSpacing:"0.08em" }}>
          {ratingMatch[1]}
        </span>
        {line.replace(`[${ratingMatch[1]}]`, "").trim()}
      </div>
    );
  }

  if (line.match(/^(CRITICAL|HIGH|MEDIUM|LOW|CLEAN)$/)) {
    const colors = { CRITICAL:"#ff6b6b", HIGH:"#ff6b35", MEDIUM:"#f59e0b", LOW:"#22c55e", CLEAN:"#22c55e" };
    const c = colors[line.trim()] || "#e6edf3";
    return (
      <div key={i} style={{ color: c, fontWeight:700, fontSize:"14px", margin:"6px 0" }}>{line}</div>
    );
  }

  if (line.match(/^(PATCH NOW|PATCH SOON|MONITOR|LOW RISK)$/)) {
    const colors = { "PATCH NOW":"#ff6b6b", "PATCH SOON":"#ff6b35", "MONITOR":"#f59e0b", "LOW RISK":"#22c55e" };
    const c = colors[line.trim()] || "#e6edf3";
    return (
      <div key={i} style={{ color: c, fontWeight:700, fontSize:"13px", margin:"6px 0" }}>{line}</div>
    );
  }

  if (/^(Hint \d+:|✦ Hint)/.test(line)) {
    return (
      <div key={i} style={{ color:"#00d4ff", paddingLeft:"10px", borderLeft:"2px solid #00d4ff44", marginBottom:"6px", lineHeight:1.75 }}>
        {line}
      </div>
    );
  }

  if (/^\d+\./.test(line)) {
    return (
      <div key={i} style={{ color:"#e6edf3", fontWeight:700, marginTop:"12px", marginBottom:"4px", fontSize:"13px" }}>
        {line}
      </div>
    );
  }

  if (line.trim().startsWith("Why dangerous:") || line.trim().startsWith("Location:") || line.trim().startsWith("Fix:") || line.trim().startsWith("- ") || line.trim().startsWith("•")) {
    return (
      <div key={i} style={{ color:"#c9d1d9", paddingLeft:"14px", marginBottom:"3px", lineHeight:1.75 }}>
        {line}
      </div>
    );
  }

  return (
    <div key={i} style={{ color:"#c9d1d9", lineHeight:1.85, marginBottom:"2px" }}>
      {line}
    </div>
  );
}

export default function OutputPanel({ tool, output, loading }) {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [output]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = output ? output.split("\n") : [];

  return (
    <div style={{ marginTop: "14px" }}>
      {output && (
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"6px", gap:"8px" }}>
          <button onClick={handleCopy} style={{
            background:"transparent", border:"1px solid #21262d", color:"#6e7681",
            fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
            padding:"5px 12px", borderRadius:"4px", cursor:"pointer", letterSpacing:"0.06em",
          }}>
            {copied ? "✓ Copied!" : "⎘ Copy"}
          </button>
          <button onClick={() => {
            const blob = new Blob([output], { type:"text/plain" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `analysis-${tool.id}-${Date.now()}.txt`;
            a.click();
          }} style={{
            background:"transparent", border:"1px solid #21262d", color:"#6e7681",
            fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
            padding:"5px 12px", borderRadius:"4px", cursor:"pointer", letterSpacing:"0.06em",
          }}>
            ↓ Save
          </button>
        </div>
      )}

      <div ref={ref} style={{
        background:"#0a0c0f",
        border:`1px solid ${tool.color}33`,
        borderRadius:"8px", padding:"20px",
        minHeight:"160px", maxHeight:"500px",
        overflowY:"auto",
        fontFamily:"'JetBrains Mono',monospace",
        fontSize:"12.5px",
        boxShadow:`inset 0 0 40px ${tool.color}06`,
      }}>
        {!output && loading && (
          <div style={{ color:"#6e7681", fontStyle:"italic", animation:"pulse 1.5s infinite" }}>
            ⬡ AI is thinking...
          </div>
        )}
        {lines.map((line, i) => renderLine(line, i))}
        {loading && output && (
          <span style={{
            display:"inline-block", width:"8px", height:"15px",
            background: tool.color, marginLeft:"2px",
            animation:"blink 1s infinite", verticalAlign:"text-bottom",
          }} />
        )}
      </div>
    </div>
  );
}
