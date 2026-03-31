// src/pages/Login.tsx
import { useState } from "react";
import "./css/Login.css";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation("common");
  const { signInWithGoogle, createUserWithEmail, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coPassword, setCoPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signiUp, setSignUp] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await createUserWithEmail({ email, password, coPassword });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmail({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{t("login.welcome")} Richly</h1>
        <p className="subtitle">
          {signiUp ? t("login.newUser") : t("login.title")}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={signiUp ? handleCreateUser : handleEmailLogin}>
          <div className="form-group">
            <label htmlFor="email">{t("login.email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("login.password")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {signiUp ? (
            <>
              <div className="form-group">
                <label htmlFor="confirm-password">{t("login.confirm")}</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={coPassword}
                  onChange={(e) => setCoPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? t("login.creating_account") : t("login.sign_up")}
              </button>
            </>
          ) : (
            <button type="submit" disabled={isLoading}>
              {isLoading ? t("login.logging_in") : t("login.sign_in")}
            </button>
          )}
        </form>

        <div className="separator">{t("login.or")}</div>

        <button
          className="google-btn"
          onClick={signInWithGoogle}
          disabled={isLoading}
        >
          {t("login.login_with")} Google
        </button>

        <div className="signup">
          {!signiUp ? t("login.newRichly") : t("login.oldRichly")}{" "}
          <span
            onClick={() => {
              setSignUp(!signiUp);
            }}
            className="btn_signup"
          >
            {!signiUp ? t("login.sign_up") : t("login.sign_in")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
