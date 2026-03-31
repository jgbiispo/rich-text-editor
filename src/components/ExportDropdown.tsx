import React, { useState, useRef, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { ExportFormat } from "../utils/exporters";

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => void;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("editor");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="export-dropdown" ref={dropdownRef}>
      <button
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <FiDownload size={20}/>
        <div className="label">{t("default.export")}</div>
      </button>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="menu-items">
            <button
              className="menu-item"
              onClick={() => {
                onExport("html");
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <span>HTML</span>
              <small>.html</small>
            </button>

            <button
              className="menu-item"
              onClick={() => {
                onExport("md");
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <span>Markdown</span>
              <small>.md</small>
            </button>

            <button
              className="menu-item"
              onClick={() => {
                onExport("txt");
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <span>{t("default.text")}</span>
              <small>.txt</small>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
