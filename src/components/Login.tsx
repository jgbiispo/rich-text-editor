import "./css/Login.css";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const { t } = useTranslation("common");
  const { signInWithGoogle } = useAuth();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <h1>Richly</h1>
        </div>

        <div className="login-content">
          <h2 className="login-title">{t("login.welcome")}</h2>
          <p className="login-subtitle">
            {t("login.description_google") || "Seu editor de texto rico e minimalista"}
          </p>

          <button
            className="google-btn"
            onClick={signInWithGoogle}
          >
            <FaGoogle className="google-icon" />
            <span>{t("login.continue_with_google") || "Continuar com Google"}</span>
          </button>

          <p className="login-footer">
            {t("login.terms_text") || "Ao continuar, você concorda com nossos"}{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              {t("login.terms") || "Termos"}
            </a>{" "}
            {t("login.and") || "e"}{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              {t("login.privacy") || "Privacidade"}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
