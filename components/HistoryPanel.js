"use client";
import { useState } from "react";

export default function HistoryPanel({ history, onRestore, onClear }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(!open)} style={{
        position:"fixed", right:"20px", bottom:"20px",
        background:"#0d1117", border:"1px solid #21262d",
        color:"#6e7681", fontFamily:"'JetBrains Mono',monospace",
        fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
        padding:"10px 16px", borderRadius:"6px", cursor:"pointer", zIndex:200,
        display:"flex", alignItems:"center", gap:"8px",
        boxShadow:"0 4px 20px #00000066",
      }}>
        📋 History
        {history.length > 0 && (
          <span style={{ background:"#ff6b35", color:"#0d1117", fontSize:"9px", fontWeight:900, padding:"1px 6px", borderRadius:"10px" }}>
            {history.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position:"fixed", inset:0, background:"#00000055", zIndex:250, backdropFilter:"blur(2px)" }} />
          <div style={{
            position:"fixed", right:0, top:0, bottom:0, width:"320px",
            background:"#0d1117", borderLeft:"1px solid #21262d",
            zIndex:300, display:"flex", flexDirection:"column",
            boxShadow:"-8px 0 32px #00000088", animation:"slideIn 0.2s ease",
          }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #21262d", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:"14px" }}>Session History</div>
                <div style={{ fontSize:"9px", color:"#6e7681", marginTop:"2px" }}>{history.length} runs this session</div>
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                {history.length > 0 && <button onClick={onClear} style={smBtn}>Clear</button>}
                <button onClick={() => setOpen(false)} style={smBtn}>✕</button>
              </div>
            </div>

            <div style={{ flex:1, overflowY:"auto", padding:"10px" }}>
              {history.length === 0 ? (
                <div style={{ textAlign:"center", color:"#3d4451", padding:"40px 20px", fontSize:"11px" }}>
                  No history yet.<br/>Run an analysis to see it here.
                </div>
              ) : history.map((item, i) => (
                <div key={i} style={{
                  background:"#01040966", border:"1px solid #21262d",
                  borderRadius:"6px", padding:"12px", marginBottom:"8px", cursor:"pointer",
                }} onClick={() => { onRestore(item); setOpen(false); }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                    <span style={{ color: item.toolColor, fontSize:"9px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>
                      {item.toolEmoji} {item.toolLabel}
                    </span>
                    <span style={{ fontSize:"9px", color:"#3d4451" }}>{item.time}</span>
                  </div>
                  <div style={{ fontSize:"11px", color:"#6e7681", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {item.input?.slice(0, 70)}...
                  </div>
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
  background:"transparent", border:"1px solid #21262d", color:"#6e7681",
  fontFamily:"'JetBrains Mono',monospace", fontSize:"9px",
  padding:"4px 8px", borderRadius:"3px", cursor:"pointer",
};
