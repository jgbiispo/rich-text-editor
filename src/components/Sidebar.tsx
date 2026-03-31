import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiMenu, FiSave, FiX } from "react-icons/fi";
import SearchBar from "./SearchBar";
import "./css/Sidebar.css";
import { Note } from "../types/note";

interface SidebarProps {
  notes: Note[];
  isVisible: boolean,
  currentNote: Note | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onUpdateNote: (id: string, newTitle: string) => void;
  onDeleteNote: (id: string) => void;
  handleSideBar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  currentNote,
  onSelectNote,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  handleSideBar,
  isVisible
}) => {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEditing = (note: Note) => {
    setEditingNoteId(note.id || "");
    setEditedTitle(note.title);
  };

  const handleSaveTitle = (id: string) => {
    if (editedTitle.trim()) {
      onUpdateNote(id, editedTitle.trim());
    }
    setEditingNoteId(null);
    setEditedTitle("");
  };

  return (
    <div className={isVisible ? "sidebar" : "mini-sidebar"}>
      {isVisible ? (
        <div>
          <div className="sidebar-header">
            <SearchBar onSearch={setSearchQuery} toggleMenu={handleSideBar} />
          </div>

          <button onClick={onCreateNote} className="new-note-btn">
            {t("sidebar.new_note")}
          </button>

          <div className="notes-list">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`note-item ${
                  note.id === currentNote?.id ? "active" : ""
                }`}
                onClick={() => onSelectNote(note)}
              >
                <div className="note-header">
                  {editingNoteId === note.id ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={() => handleSaveTitle(note.id || "")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveTitle(note.id || "");
                        }

                        if (e.key === "Escape") {
                          setEditingNoteId(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <h4 onDoubleClick={() => handleStartEditing(note)}>
                      {note.title}
                    </h4>
                  )}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editingNoteId === note.id) {
                        handleSaveTitle(note.id || "");
                      } else {
                        onDeleteNote(note.id || "");
                      }
                    }}
                  >
                    {editingNoteId === note.id ? <FiSave /> : <FiX />}
                  </button>
                </div>
                <small>
                  {note.updatedAt.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </small>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button onClick={handleSideBar} className="side-toggle">
          <FiMenu />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
