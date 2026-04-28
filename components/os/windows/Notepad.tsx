"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "zb-notepad";
const SAVE_DELAY = 800; // ms debounce

interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export default function NotepadWindow() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded);
    if (loaded.length > 0) {
      setActiveId(loaded[0].id);
      setContent(loaded[0].content);
    }
  }, []);

  const activeNote = notes.find((n) => n.id === activeId);

  const handleContentChange = (val: string) => {
    setContent(val);
    setSaved(false);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const updated = notes.map((n) =>
        n.id === activeId
          ? { ...n, content: val, updated_at: new Date().toISOString() }
          : n
      );
      setNotes(updated);
      saveNotes(updated);
      setSaved(true);
    }, SAVE_DELAY);
  };

  const handleTitleChange = (val: string) => {
    const updated = notes.map((n) =>
      n.id === activeId ? { ...n, title: val, updated_at: new Date().toISOString() } : n
    );
    setNotes(updated);
    saveNotes(updated);
  };

  const createNote = () => {
    const newNote: Note = {
      id: generateId(),
      title: "Untitled",
      content: "",
      updated_at: new Date().toISOString(),
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotes(updated);
    setActiveId(newNote.id);
    setContent("");
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
    if (activeId === id) {
      setActiveId(updated[0]?.id || null);
      setContent(updated[0]?.content || "");
    }
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
                <button
                  className="notepad-delete"
                  onClick={() => deleteNote(activeNote.id)}
                >
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
