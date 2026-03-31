import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Login from "./components/Login";
import { useAuth } from "./contexts/AuthContext";
import { Note } from "./types/note";
import {
  createNote,
  updateNote as updateNoteService,
  deleteNote as deleteNoteService,
  getNotes,
} from "./services/notesService";
import "./theme.css";
import "./App.css";
import "./components/css/LoginButton.css";

const App = () => {
  const { t } = useTranslation("common");
  const [isVisible, setVisible] = useState(false);
  const { user } = useAuth();

  const handleSideBar = () => {
    setVisible(!isVisible);
  };

  const hideSideBar = () => {
    setVisible(false);
  };

  // Theme state and initialization
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      try {
        if (user) {
          const cloudNotes = await getNotes(user.id);

          const noteWithDate = cloudNotes.map((note) => ({
            ...note,
            updatedAt: new Date(note.updatedAt),
            history: note.history.map((entry) => ({
              ...entry,
              timestamp: new Date(entry.timestamp),
            })),
          }));

          if (isMounted) setNotes(noteWithDate);
        } else {
          const localNotes = localStorage.getItem("notes");
          const parsedNotes = localNotes ? JSON.parse(localNotes) : [];

          interface LocalNoteRaw {
            id?: string;
            title?: string;
            content?: string;
            updatedAt?: string | Date;
            history?: Array<{ content: string; timestamp: string | Date }>;
          }

          const migratedNotes = parsedNotes.map((note: LocalNoteRaw) => ({
            ...note,
            updatedAt: new Date(note.updatedAt ?? Date.now()),
            history: (note.history || []).map((entry) => ({
              content: entry.content,
              timestamp: new Date(entry.timestamp),
            })),
          }));

          const validNotes = migratedNotes.filter(
            (note: Partial<Note>): note is Note =>
              !!(note.id && note.title && note.content && note.updatedAt)
          );

          if (isMounted) {
            setNotes(validNotes);
            setCurrentNoteId(localStorage.getItem("lastNoteId"));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar notas:", error);
        if (isMounted) setNotes([]);
      }
    };

    loadNotes();
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem("notes", JSON.stringify(notes));
      currentNoteId
        ? localStorage.setItem("lastNoteId", currentNoteId)
        : localStorage.removeItem("lastNoteId");
    }
  }, [notes, currentNoteId, user]);

  const createNewNote = useCallback(async () => {
    if (!user) return;

    try {
      const newNote: Note = {
        title: t("sidebar.untitled"),
        content: "",
        updatedAt: new Date(),
        history: [],
      };

      const docRef = await createNote(user.id, newNote);
      setNotes((prev) => [{ ...newNote, id: docRef.id }, ...prev]);
      setCurrentNoteId(docRef.id);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }, [t, user]);

  const updateNote = useCallback(
    async (noteId: string, updates: Partial<Note>) => {
      try {
        const MAX_HISTORY_ENTRIES = 50;

        setNotes((prevNotes) => {
          return prevNotes.map((note) => {
            if (note.id === noteId) {
              const newHistoryEntry = {
                timestamp: new Date(),
                content: note.content,
              };

              const updatedNote = {
                ...note,
                ...updates,
                updatedAt: new Date(),
                history: [newHistoryEntry, ...(note.history || [])].slice(
                  0,
                  MAX_HISTORY_ENTRIES
                ),
              };

              // Atualizar servidor (se logado)
              if (user) {
                updateNoteService(user.id, noteId, updatedNote).catch(
                  (error) =>
                    console.error("Erro ao atualizar no servidor:", error)
                );
              }

              return updatedNote;
            }
            return note;
          });
        });
      } catch (error) {
        console.error("Falha ao atualizar nota:", error);
      }
    },
    [user]
  );

  const deleteNote = useCallback(
    async (noteId: string) => {
      try {
        if (user) {
          await deleteNoteService(user.id, noteId);
        }

        setNotes((prev) => {
          const remaining = prev.filter((n) => n.id !== noteId);
          if (noteId === currentNoteId) {
            setCurrentNoteId(remaining[0]?.id || null);
          }
          return remaining;
        });
      } catch (error) {
        console.error("Failed to delete note:", error);
      }
    },
    [currentNoteId, user]
  );

  const currentNote = notes.find((note) => note.id === currentNoteId) || null;

  return (
    <div className="app-container">
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} />

      <main className="main-content">
        {user ? (
          <>
            <Sidebar
              notes={notes}
              isVisible={isVisible}
              handleSideBar={handleSideBar}
              currentNote={currentNote}
              onCreateNote={createNewNote}
              onSelectNote={(note) => setCurrentNoteId(note.id || "")}
              onUpdateNote={(id, title) => updateNote(id, { title })}
              onDeleteNote={deleteNote}
            />

            <div className="editor-wrapper">
              {currentNote ? (
                <Editor
                  key={currentNote.id}
                  note={currentNote}
                  setVisibleSidebar={hideSideBar}
                  onSave={(content) =>
                    updateNote(currentNote.id || "", { content })
                  }
                />
              ) : (
                <div className="empty-state">
                  <h2>{t("empty_state.title")}</h2>
                  <p>{t("empty_state.message")}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Login />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
