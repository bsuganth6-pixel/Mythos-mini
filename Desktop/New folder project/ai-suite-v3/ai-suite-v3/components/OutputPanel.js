"use client";
import { useRef, useEffect, useState } from "react";

function renderLine(line, i) {
  if (!line.trim()) return <div key={i} style={{ height: "8px" }} />;

  const HEADERS = ["SEVERITY RATING","VULNERABILITIES FOUND","SUMMARY","CHALLENGE CATEGORY",
    "PROGRESSIVE HINTS","CONCEPT EXPLAINED","USEFUL TOOLS","WALKTHROUGH","SECURITY FINDINGS",
    "CODE QUALITY","RECOMMENDATIONS","QUALITY SCORE","VULNERABILITY OVERVIEW","TECHNICAL DETAILS",
    "EXPLOITATION IN THE WILD","MITIGATION","PATCH URGENCY","THREAT ASSESSMENT","MALWARE TYPE",
    "INDICATORS OF COMPROMISE","BEHAVIOR ANALYSIS","STRENGTH RATING","STRENGTH SCORE","ANALYSIS",
    "VULNERABILITIES","IMPROVED VERSIONS","BEST PRACTICES","THREAT LEVEL","FINDINGS",
    "ATTACK PATTERNS DETECTED","MISCONFIGURATIONS","MONITORING RULES","REGEX PATTERN",
    "LANGUAGE VERSIONS","EXPLANATION","TEST CASES","EDGE CASES","OPTIMIZED VERSION","IOCs"];

  if (HEADERS.some(h => line.includes(h))) {
    return (
      <div key={i} style={{ color:"var(--muted)", fontSize:"10px", fontWeight:700,
        letterSpacing:"0.2em", textTransform:"uppercase", marginTop:"18px",
        marginBottom:"8px", borderBottom:"1px solid var(--border)", paddingBottom:"5px" }}>
        {line}
      </div>
    );
  }

  const ratingMatch = line.match(/\[(CRITICAL|HIGH|MEDIUM|LOW|INFO|CLEAN|MALICIOUS|SUSPICIOUS|BENIGN|PATCH NOW|PATCH SOON|MONITOR|VERY WEAK|WEAK|MODERATE|STRONG|VERY STRONG)\]/);
  if (ratingMatch) {
    const colors = { CRITICAL:"#ff6b6b",HIGH:"#ff6b35",MEDIUM:"#f59e0b",LOW:"#22c55e",INFO:"#00d4ff",CLEAN:"#22c55e",MALICIOUS:"#ff6b6b",SUSPICIOUS:"#f59e0b",BENIGN:"#22c55e","PATCH NOW":"#ff6b6b","PATCH SOON":"#ff6b35",MONITOR:"#f59e0b","VERY WEAK":"#ff6b6b",WEAK:"#ff6b35",MODERATE:"#f59e0b",STRONG:"#22c55e","VERY STRONG":"#00d4ff" };
    const c = colors[ratingMatch[1]] || "#e6edf3";
    return (
      <div key={i} style={{ marginBottom:"5px", lineHeight:1.75 }}>
        <span style={{ background:c+"22",color:c,fontWeight:700,fontSize:"10px",padding:"2px 8px",borderRadius:"3px",marginRight:"8px",letterSpacing:"0.08em" }}>
          {ratingMatch[1]}
        </span>
        {line.replace(`[${ratingMatch[1]}]`,"").trim()}
      </div>
    );
  }

  const bare = ["CRITICAL","HIGH","MEDIUM","LOW","CLEAN","MALICIOUS","SUSPICIOUS","PATCH NOW","PATCH SOON","MONITOR","VERY WEAK","WEAK","MODERATE","STRONG","VERY STRONG"];
  if (bare.includes(line.trim())) {
    const colors = { CRITICAL:"#ff6b6b",HIGH:"#ff6b35",MEDIUM:"#f59e0b",LOW:"#22c55e",CLEAN:"#22c55e",MALICIOUS:"#ff6b6b",SUSPICIOUS:"#f59e0b","PATCH NOW":"#ff6b6b","PATCH SOON":"#ff6b35",MONITOR:"#f59e0b","VERY WEAK":"#ff6b6b",WEAK:"#ff6b35",MODERATE:"#f59e0b",STRONG:"#22c55e","VERY STRONG":"#00d4ff" };
    return <div key={i} style={{ color:colors[line.trim()]||"#e6edf3",fontWeight:700,fontSize:"14px",margin:"6px 0" }}>{line}</div>;
  }

  if (/^Hint \d+:/.test(line)) return (
    <div key={i} style={{ color:"#00d4ff",paddingLeft:"10px",borderLeft:"2px solid #00d4ff44",marginBottom:"6px",lineHeight:1.75 }}>{line}</div>
  );

  if (/^\d+\./.test(line)) return (
    <div key={i} style={{ color:"var(--text)",fontWeight:700,marginTop:"12px",marginBottom:"4px",fontSize:"13px" }}>{line}</div>
  );

  if (line.trim().startsWith("- ") || line.trim().startsWith("• ") || line.trim().startsWith("* ")) return (
    <div key={i} style={{ color:"var(--text)",paddingLeft:"14px",marginBottom:"3px",lineHeight:1.75 }}>{line}</div>
  );

  if (line.includes(":") && line.split(":")[0].length < 30 && !line.startsWith(" ")) {
    const [key, ...rest] = line.split(":");
    return (
      <div key={i} style={{ marginBottom:"4px",lineHeight:1.75 }}>
        <span style={{ color:"var(--muted)",fontWeight:700 }}>{key}:</span>
        <span style={{ color:"var(--text)" }}>{rest.join(":")}</span>
      </div>
    );
  }

  return <div key={i} style={{ color:"var(--text)",lineHeight:1.85,marginBottom:"2px",opacity:0.9 }}>{line}</div>;
}

export default function OutputPanel({ tool, output, loading, input }) {
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

  const handlePDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxW = pageW - margin * 2;

    doc.setFillColor(1, 4, 9);
    doc.rect(0, 0, pageW, 297, "F");

    doc.setTextColor(255, 107, 53);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("MYTHOS — AI Security Suite", margin, 20);

    doc.setTextColor(110, 118, 129);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Tool: ${tool.label}  |  ${new Date().toLocaleString()}`, margin, 28);

    doc.setDrawColor(33, 38, 45);
    doc.line(margin, 32, pageW - margin, 32);

    doc.setTextColor(201, 209, 217);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    let y = 42;

    const lines = output.split("\n");
    for (const line of lines) {
      if (y > 275) { doc.addPage(); doc.setFillColor(1, 4, 9); doc.rect(0, 0, pageW, 297, "F"); y = 20; }
      const wrapped = doc.splitTextToSize(line || " ", maxW);
      if (line.match(/^[A-Z ]{5,}$/) && !line.includes(",")) {
        doc.setTextColor(160, 170, 180);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
      } else {
        doc.setTextColor(201, 209, 217);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
      }
      doc.text(wrapped, margin, y);
      y += wrapped.length * 6 + (line === "" ? 2 : 0);
    }

    doc.save(`mythos-${tool.id}-${Date.now()}.pdf`);
  };

  const handleSave = () => {
    const blob = new Blob([`MYTHOS AI Security Suite\nTool: ${tool.label}\nDate: ${new Date().toLocaleString()}\n\n${output}`], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mythos-${tool.id}-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div style={{ marginTop: "14px" }}>
      {output && (
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"8px", gap:"6px", flexWrap:"wrap" }}>
          {[
            { label: copied ? "✓ Copied!" : "⎘ Copy", fn: handleCopy },
            { label: "↓ Save .txt", fn: handleSave },
            { label: "📄 Export PDF", fn: handlePDF },
          ].map((btn, i) => (
            <button key={i} onClick={btn.fn} style={{
              background:"transparent", border:"1px solid var(--border)", color:"var(--muted)",
              fontFamily:"'JetBrains Mono',monospace", fontSize:"10px",
              padding:"5px 12px", borderRadius:"4px", cursor:"pointer", letterSpacing:"0.06em",
              transition:"all 0.15s",
            }}>{btn.label}</button>
          ))}
        </div>
      )}

      <div ref={ref} style={{
        background:"var(--bg3)", border:`1px solid ${tool.color}33`,
        borderRadius:"8px", padding:"20px",
        minHeight:"160px", maxHeight:"520px", overflowY:"auto",
        fontFamily:"'JetBrains Mono',monospace", fontSize:"12.5px",
        boxShadow:`inset 0 0 40px ${tool.color}06`,
      }}>
        {!output && loading && (
          <div style={{ color:"var(--muted)", fontStyle:"italic", animation:"pulse 1.5s infinite" }}>
            ⬡ AI is analyzing...
          </div>
        )}
        {output && output.split("\n").map((line, i) => renderLine(line, i))}
        {loading && output && (
          <span style={{ display:"inline-block", width:"8px", height:"15px",
            background:tool.color, marginLeft:"2px",
            animation:"blink 1s infinite", verticalAlign:"text-bottom" }} />
        )}
      </div>
    </div>
  );
}
