import "./css/Toolbar.css";
import { useCallback } from "react";
import ExportDropdown from "./ExportDropdown";
import { useError } from "../contexts/ErrorContext";
import { sanitizeHTML } from "../utils/sanitize";
import { useTranslation } from "react-i18next";

import {
  exportAsHTML,
  exportAsText,
  exportAsMarkdown,
  ExportFormat,
} from "../utils/exporters";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaUndo,
  FaRedo,
  FaLink,
  FaImage,
  FaSearch,
  FaTable,
} from "react-icons/fa";

interface HistoryState {
  stack: string[];
  pointer: number;
}

interface ToolbarProps {
  setHistory: React.Dispatch<React.SetStateAction<HistoryState>>;
  history: HistoryState;
  setShowFindReplace: React.Dispatch<React.SetStateAction<boolean>>;
  setShowTableInsert: React.Dispatch<React.SetStateAction<boolean>>;
  editorRef: React.RefObject<HTMLDivElement | null>;
  setShowHistory: () => {};
}

export default function Toolbar({
  setHistory,
  setShowFindReplace,
  setShowTableInsert,
  setShowHistory,
  editorRef,
  history,
}: ToolbarProps) {
  const { t } = useTranslation("editor");
  const { handleError } = useError();

  const handleCommand = useCallback(
    (command: string, value?: string | null) => {
      try {
        document.execCommand(command, false, value ?? undefined);
      } catch (error) {
        handleError(error as Error);
      }
    },
    [handleError]
  );

  const handleUndo = () => {
    setHistory((prev) => ({
      ...prev,
      pointer: prev.pointer - 1,
    }));
    if (!editorRef.current) return;
    editorRef.current.innerHTML = history.stack[history.pointer - 1];
  };

  const handleRedo = () => {
    setHistory((prev) => ({
      ...prev,
      pointer: prev.pointer + 1,
    }));
    if (!editorRef.current) return;
    editorRef.current.innerHTML = history.stack[history.pointer + 1];
  };

  const handleExport = (format: ExportFormat) => {
    try {
      if (!editorRef.current) return;
      const content = sanitizeHTML(editorRef.current.innerHTML);
      let exported = "";

      switch (format) {
        case "html":
          exported = exportAsHTML(content);
          break;
        case "md":
          exported = exportAsMarkdown(content);
          break;
        case "txt":
          exported = exportAsText(content);
          break;
        default:
          throw new Error("Formato de exportação inválido");
      }

      const blob = new Blob([exported], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `document.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error) {
        handleError(new Error("Erro na exportação: " + error.message));
      } else {
        handleError(new Error("Erro na exportação"));
      }
    }
  };

  return (
    <div className="toolbar">
      <div className="line-up">
        <button
          onClick={() => setShowFindReplace(true)}
          aria-label="Localizar e substituir"
        >
          <FaSearch />
        </button>
        <button
          onClick={() => handleCommand("bold")}
          aria-label="Negrito"
          role="switch"
          aria-checked={document.queryCommandState("bold")}
        >
          <FaBold />
        </button>

        <button
          onClick={() => handleCommand("italic")}
          aria-label="Itálico"
          role="switch"
          aria-checked={document.queryCommandState("italic")}
        >
          <FaItalic />
        </button>
        <button
          onClick={() => handleCommand("underline")}
          aria-label="Sublinhado"
          role="switch"
          aria-checked={document.queryCommandState("underline")}
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => setShowTableInsert(true)}
          aria-label="Inserir tabela"
        >
          <FaTable />
        </button>
        <select
          className="buttons"
          aria-label="Formatar bloco"
          onChange={(e) => handleCommand("formatBlock", e.target.value)}
        >
          <option value="p">{t("toolbar.paragraph")}</option>
          <option value="h1">{t("toolbar.heading")} 1</option>
          <option value="h2">{t("toolbar.heading")} 2</option>
          <option value="h3">{t("toolbar.heading")} 3</option>
        </select>
      </div>

      <div className="line-down">
        <button onClick={() => handleUndo()} disabled={history.pointer === 0}>
          <FaUndo />
        </button>

        <button
          onClick={() => handleRedo()}
          disabled={history.pointer === history.stack.length - 1}
        >
          <FaRedo />
        </button>

        <button
          onClick={() => {
            const url = prompt(t("toolbar.enterLink"));
            if (url) handleCommand("createLink", url);
          }}
        >
          <FaLink />
        </button>

        <button
          onClick={() => {
            const url = prompt(t("toolbar.enterImage"));
            if (url) handleCommand("insertImage", url);
          }}
        >
          <FaImage />
        </button>
        <button onClick={setShowHistory} className="history-toggle">
          {t("editor.history")}
        </button>
        <div className="export">
          <ExportDropdown onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}
