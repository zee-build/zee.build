"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function NotepadWindow() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((d) => {
        setNotes(d.notes || []);
        if (d.notes?.length > 0) {
          setActiveId(d.notes[0].id);
          setContent(d.notes[0].content);
        }
      })
      .catch(() => {});
  }, []);

  const activeNote = notes.find((n) => n.id === activeId);

  const handleContentChange = (val: string) => {
    setContent(val);
    setSaved(false);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id: activeId, data: { content: val } }),
      }).then(() => {
        setNotes((prev) =>
          prev.map((n) => (n.id === activeId ? { ...n, content: val, updated_at: new Date().toISOString() } : n))
        );
        setSaved(true);
      });
    }, 800);
  };

  const handleTitleChange = (val: string) => {
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update", id: activeId, data: { title: val } }),
    });
    setNotes((prev) => prev.map((n) => (n.id === activeId ? { ...n, title: val } : n)));
  };

  const createNote = () => {
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", title: "Untitled", content: "" }),
    })
      .then((r) => r.json())
      .then((d) => {
        setNotes((prev) => [d.note, ...prev]);
        setActiveId(d.note.id);
        setContent("");
      });
  };

  const deleteNote = (id: string) => {
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    }).then(() => {
      const updated = notes.filter((n) => n.id !== id);
      setNotes(updated);
      if (activeId === id) {
        setActiveId(updated[0]?.id || null);
        setContent(updated[0]?.content || "");
      }
    });
  };

  const selectNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) {
      setActiveId(id);
      setContent(note.content);
    }
  };

  return (
    <div className="notepad">
      <div className="notepad-sidebar">
        <div className="notepad-sidebar-header">
          <span>{notes.length} notes</span>
          <button className="notepad-new" onClick={createNote}>+</button>
        </div>
        <div className="notepad-list">
          {notes.map((n) => (
            <button
              key={n.id}
              className={`notepad-item${activeId === n.id ? " active" : ""}`}
              onClick={() => selectNote(n.id)}
            >
              <div className="notepad-item-title">{n.title || "Untitled"}</div>
              <div className="notepad-item-date">
                {new Date(n.updated_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="notepad-editor">
        {activeNote ? (
          <>
            <div className="notepad-editor-header">
              <input
                className="notepad-title-input"
                value={activeNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note title..."
              />
              <div className="notepad-status">
                {saved ? (
                  <span className="notepad-saved">✓ Saved</span>
                ) : (
                  <span className="notepad-saving">Saving...</span>
                )}
                <button className="notepad-delete" onClick={() => deleteNote(activeNote.id)}>
                  🗑
                </button>
              </div>
            </div>
            <textarea
              className="notepad-textarea"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Start typing..."
              spellCheck={false}
            />
          </>
        ) : (
          <div className="notepad-empty">
            <p>No notes yet</p>
            <button className="notepad-create-btn" onClick={createNote}>
              Create your first note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
