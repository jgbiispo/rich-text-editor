import "./css/Header.css";
import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import LanguageSwitcher from "./LanguageSwitcher";
import LoginButton from "./LoginButton";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme }) => {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <LanguageSwitcher />
        <div className="center">
          <h1>Richly</h1>
          {user ? (
            <p className="user">
              Logado: {(user.user_metadata.full_name || user.email)?.split(" ")[0]}{" "}
              {(user.user_metadata.full_name || user.email)?.split(" ")[1] || ""}
            </p>
          ) : (
            <></>
          )}
        </div>
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={`Alternar para tema ${darkMode ? "claro" : "escuro"}`}
        >
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>
      </div>
      <div className="login-content">
        <div className="login-button">
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
