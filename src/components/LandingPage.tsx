import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiMoon, FiSun, FiArrowRight, FiCloud, FiEdit, FiLayers, FiDownload } from "react-icons/fi";
import "./css/LandingPage.css";

const LandingPage = () => {
  const { t } = useTranslation("landing");
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.setAttribute("data-theme", newMode ? "dark" : "light");
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const features = [
    {
      icon: <FiEdit />,
      title: t("features.editor.title"),
      description: t("features.editor.description"),
    },
    {
      icon: <FiCloud />,
      title: t("features.sync.title"),
      description: t("features.sync.description"),
    },
    {
      icon: <FiLayers />,
      title: t("features.history.title"),
      description: t("features.history.description"),
    },
    {
      icon: <FiDownload />,
      title: t("features.export.title"),
      description: t("features.export.description"),
    },
  ];

  const benefits = [
    { icon: "✨", text: t("benefits.fast") },
    { icon: "🔒", text: t("benefits.secure") },
    { icon: "🌙", text: t("benefits.dark_mode") },
    { icon: "🌍", text: t("benefits.multilingual") },
  ];

  const pricingPlans = [
    {
      name: t("pricing.free.name"),
      price: "R$ 0",
      period: "/mês",
      features: [
        t("pricing.free.features.50_notes"),
        t("pricing.free.features.sync"),
        t("pricing.free.features.basic_export"),
      ],
      cta: t("pricing.free.cta"),
      popular: false,
    },
    {
      name: t("pricing.pro.name"),
      price: "R$ 19",
      period: "/mês",
      features: [
        t("pricing.pro.features.unlimited"),
        t("pricing.pro.features.full_history"),
        t("pricing.pro.features.advanced_export"),
      ],
      cta: t("pricing.pro.cta"),
      popular: true,
    },
    {
      name: t("pricing.enterprise.name"),
      price: t("pricing.enterprise.price"),
      period: "",
      features: [
        t("pricing.enterprise.features.api"),
        t("pricing.enterprise.features.sso"),
        t("pricing.enterprise.features.support"),
      ],
      cta: t("pricing.enterprise.cta"),
      popular: false,
    },
  ];

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-header-content">
          <div className="logo">Richly</div>
          <nav className="landing-nav">
            <a href="#features">{t("nav.features")}</a>
            <a href="#pricing">{t("nav.pricing")}</a>
            <a href="#about">{t("nav.about")}</a>
          </nav>
          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Alternar para tema ${darkMode ? "claro" : "escuro"}`}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <a href="/login" className="btn-secondary">
              {t("header.login")}
            </a>
            <a href="/login" className="btn-primary">
              {t("header.get_started")}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>{t("hero.headline")}</h1>
          <p className="hero-subtitle">{t("hero.subheadline")}</p>
          <div className="hero-cta">
            <a href="/login" className="btn-primary btn-large">
              {t("hero.cta_primary")}
            </a>
            <a href="#features" className="btn-secondary btn-large">
              {t("hero.cta_secondary")}
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="editor-mockup">
            <div className="mockup-header">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
            </div>
            <div className="mockup-body">
              <div className="mockup-toolbar"></div>
              <div className="mockup-content">
                <div className="mockup-line short"></div>
                <div className="mockup-line"></div>
                <div className="mockup-line"></div>
                <div className="mockup-line long"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>{t("features.title")}</h2>
        <p className="section-subtitle">{t("features.subtitle")}</p>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2>{t("benefits.title")}</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <span className="benefit-icon">{benefit.icon}</span>
              <span>{benefit.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <h2>{t("pricing.title")}</h2>
        <p className="section-subtitle">{t("pricing.subtitle")}</p>
        <div className="pricing-grid">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && (
                <span className="popular-badge">{t("pricing.popular")}</span>
              )}
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="price-value">{plan.price}</span>
                <span className="price-period">{plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>
                    <FiCheck className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/login" className={`btn-${plan.popular ? "primary" : "secondary"}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>{t("cta.headline")}</h2>
        <p>{t("cta.subheadline")}</p>
        <a href="/login" className="btn-primary btn-large">
          {t("cta.button")} <FiArrowRight />
        </a>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">{t("footer.privacy")}</a>
            <a href="#">{t("footer.terms")}</a>
            <a href="#">{t("footer.contact")}</a>
          </div>
          <p className="copyright">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
