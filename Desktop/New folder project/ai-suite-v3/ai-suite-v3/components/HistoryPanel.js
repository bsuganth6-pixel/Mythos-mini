"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "mythos_history";

export function saveToHistory(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const updated = [{ ...entry, id: Date.now(), time: new Date().toLocaleTimeString() }, ...existing].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}

export default function HistoryPanel({ onRestore, refreshTrigger }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => { setHistory(loadHistory()); }, [open, refreshTrigger]);

  const clearAll = () => { localStorage.removeItem(STORAGE_KEY); setHistory([]); };
  const deleteOne = (id) => {
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position:"fixed", right:"20px", bottom:"20px",
        background:"var(--bg2)", border:"1px solid var(--border)",
        color:"var(--muted)", fontFamily:"'JetBrains Mono',monospace",
        fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
        padding:"10px 16px", borderRadius:"6px", cursor:"pointer", zIndex:200,
        display:"flex", alignItems:"center", gap:"8px",
        boxShadow:"0 4px 20px #00000066",
      }}>
        📋 History
        {history.length > 0 && (
          <span style={{ background:"#ff6b35", color:"#0d1117", fontSize:"9px",
            fontWeight:900, padding:"1px 6px", borderRadius:"10px" }}>
            {history.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0,
            background:"#00000055", zIndex:250, backdropFilter:"blur(2px)" }} />
          <div style={{
            position:"fixed", right:0, top:0, bottom:0, width:"340px",
            background:"var(--bg2)", borderLeft:"1px solid var(--border)",
            zIndex:300, display:"flex", flexDirection:"column",
            boxShadow:"-8px 0 32px #00000088", animation:"slideIn 0.2s ease",
          }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)",
              display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:"14px" }}>Chat History</div>
                <div style={{ fontSize:"9px", color:"var(--muted)", marginTop:"2px" }}>
                  {history.length} saved · persists across sessions
                </div>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                {history.length > 0 && <button onClick={clearAll} style={smBtn}>Clear all</button>}
                <button onClick={() => setOpen(false)} style={smBtn}>✕</button>
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"10px" }}>
              {history.length === 0 ? (
                <div style={{ textAlign:"center", color:"var(--dim)", padding:"40px 20px", fontSize:"11px" }}>
                  No history yet.<br/>Your analyses will be saved here<br/>automatically.
                </div>
              ) : history.map((item) => (
                <div key={item.id} style={{
                  background:"var(--bg)", border:"1px solid var(--border)",
                  borderRadius:"6px", padding:"12px", marginBottom:"8px",
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px", alignItems:"center" }}>
                    <span style={{ color:item.toolColor, fontSize:"9px", fontWeight:700,
                      letterSpacing:"0.1em", textTransform:"uppercase" }}>
                      {item.toolEmoji} {item.toolLabel}
                    </span>
                    <div style={{ display:"flex", gap:"4px" }}>
                      <button onClick={() => { onRestore(item); setOpen(false); }}
                        style={{ ...smBtn, color:item.toolColor, borderColor:item.toolColor+"44" }}>
                        Restore
                      </button>
                      <button onClick={() => deleteOne(item.id)} style={smBtn}>✕</button>
                    </div>
                  </div>
                  <div style={{ fontSize:"11px", color:"var(--muted)",
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", marginBottom:"4px" }}>
                    {item.input?.slice(0, 80)}
                  </div>
                  <div style={{ fontSize:"9px", color:"var(--dim)" }}>{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

const smBtn = {
  background:"transparent", border:"1px solid var(--border)", color:"var(--muted)",
  fontFamily:"'JetBrains Mono',monospace", fontSize:"9px",
  padding:"4px 8px", borderRadius:"3px", cursor:"pointer",
};
