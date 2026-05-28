"use client";
import { useState, useRef } from "react";

const ALLOWED = [".js", ".jsx", ".ts", ".tsx", ".py", ".php", ".c", ".cpp", ".java", ".go", ".rb", ".rs", ".sh", ".bat", ".ps1", ".sql", ".html", ".css", ".json", ".xml", ".yaml", ".yml", ".txt", ".log", ".conf", ".env"];

export default function FileUpload({ onFiles, tool }) {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const readFile = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ name: file.name, content: e.target.result, size: file.size });
    reader.readAsText(file);
  });

  const handleFiles = async (fileList) => {
    const valid = Array.from(fileList).filter(f =>
      ALLOWED.some(ext => f.name.toLowerCase().endsWith(ext)) && f.size < 500000
    );
    const read = await Promise.all(valid.map(readFile));
    const updated = [...files, ...read].slice(0, 5);
    setFiles(updated);
    onFiles(updated);
  };

  const removeFile = (i) => {
    const updated = files.filter((_, idx) => idx !== i);
    setFiles(updated);
    onFiles(updated);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1px dashed ${dragging ? tool.color : "var(--border)"}`,
          borderRadius: "6px",
          padding: "12px 16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: dragging ? `${tool.color}08` : "transparent",
          transition: "all 0.15s",
          fontSize: "11px",
          color: "var(--muted)",
        }}>
        <span style={{ fontSize: "16px" }}>📎</span>
        <span>Drop files or click to upload <span style={{ color: tool.color }}>({files.length}/5)</span></span>
        <span style={{ marginLeft: "auto", fontSize: "9px", color: "var(--dim)" }}>
          .js .py .php .c .sql .sh + more · max 500KB each
        </span>
        <input ref={inputRef} type="file" multiple accept={ALLOWED.join(",")}
          onChange={e => handleFiles(e.target.files)} style={{ display: "none" }} />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
          {files.map((f, i) => (
            <div key={i} style={{
              background: `${tool.color}11`, border: `1px solid ${tool.color}44`,
              borderRadius: "4px", padding: "4px 10px",
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "10px", color: tool.color,
            }}>
              <span>📄 {f.name}</span>
              <span style={{ color: "var(--dim)", fontSize: "9px" }}>({(f.size/1024).toFixed(1)}kb)</span>
              <button onClick={e => { e.stopPropagation(); removeFile(i); }} style={{
                background: "transparent", border: "none", color: tool.color,
                cursor: "pointer", fontSize: "11px", padding: "0 2px",
              }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
