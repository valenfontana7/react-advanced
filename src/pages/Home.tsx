import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getLessonsForLevel } from "../data";
import OnboardingFlow from "../components/OnboardingFlow";
import WelcomeBack from "../components/WelcomeBack";
import { useUserProfile } from "../hooks/useUserProfile";

// Transform contentMap to the format expected by Home component
const lessons = {
  basics: Object.entries(getLessonsForLevel("basics")).map(
    ([slug, content]) => ({
      slug,
      title: content.title,
    })
  ),
  advanced: Object.entries(getLessonsForLevel("advanced")).map(
    ([slug, content]) => ({
      slug,
      title: content.title,
    })
  ),
};

export default function Home() {
  const { pathname } = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const {
    profile,
    isLoading,
    completeOnboarding,
    getProgress,
    isReturningUser,
  } = useUserProfile();

  const isRoot = pathname === "/";
  const isBasics = pathname.startsWith("/basics");
  const isAdvanced = pathname.startsWith("/advanced");
  const totalLessons = lessons.basics.length + lessons.advanced.length;

  const [query, setQuery] = useState("");

  const combinedLessons = useMemo(() => {
    return [
      ...lessons.basics.map((l) => ({ ...l, level: "basics" })),
      ...lessons.advanced.map((l) => ({ ...l, level: "advanced" })),
    ];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return combinedLessons.filter(
      (l) =>
        l.title.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q)
    );
  }, [query, combinedLessons]);

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (profileData: any) => {
    completeOnboarding(profileData);
    setShowOnboarding(false);
  };

  const handleStartNewLearningPath = () => {
    setShowOnboarding(true);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  // Mostrar WelcomeBack para usuarios que ya completaron onboarding
  const shouldShowWelcomeBack = profile.onboardingCompleted && isRoot;

  return (
    <div>
      {shouldShowWelcomeBack ? (
        <WelcomeBack
          profile={profile}
          progress={getProgress()}
          onStartNewLearningPath={handleStartNewLearningPath}
        />
      ) : (
        <>
          <div className="home-hero">
            <div className="hero-left">
              <h2 className="hero-title">Aprende React a tu ritmo</h2>
              <p className="hero-subtitle muted">
                Cursos organizados por nivel con ejemplos prácticos y
                ejercicios.
              </p>
              <div className="hero-actions">
                <input
                  className="search-input"
                  placeholder="Buscar lecciones, p. ej. hooks"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Buscar lecciones"
                />
                <div className="hero-stats">
                  <div className="stat">{totalLessons} lecciones</div>
                </div>
              </div>
            </div>
            <div>
              <button className="btn primary" onClick={handleStartOnboarding}>
                {profile.onboardingCompleted
                  ? "Continuar aprendiendo"
                  : "Comenzar"}
              </button>
            </div>
          </div>

          <h2>Lecciones</h2>
        </>
      )}

      {!shouldShowWelcomeBack && (
        <>
          {query ? (
            <section>
              <h3>Resultados</h3>
              {filtered.length ? (
                <div className="section-cards">
                  {filtered.map((l) => (
                    <Link
                      key={`${l.level}-${l.slug}`}
                      to={`/${l.level}/${l.slug}`}
                      className="card"
                    >
                      <div className="card-title">{l.title}</div>
                      <div className="card-desc">Nivel: {l.level}</div>
                      <div className="card-meta">Ir a la lección →</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  No se encontraron lecciones que coincidan con "{query}".
                </p>
              )}
            </section>
          ) : isRoot ? (
            <div className="overview-links">
              <Link to="/basics" className="overview-link">
                <h3 className="overview-title">Básicos</h3>
                <p className="overview-desc muted">
                  Conceptos esenciales de React
                </p>
              </Link>

              <Link to="/advanced" className="overview-link">
                <h3 className="overview-title">Avanzado</h3>
                <p className="overview-desc muted">
                  Patrones avanzados y rendimiento
                </p>
              </Link>
            </div>
          ) : (
            <>
              {isBasics && (
                <section>
                  <h3>Básicos</h3>
                  <div className="section-cards">
                    {lessons.basics.map((l) => (
                      <Link
                        key={l.slug}
                        to={`/basics/${l.slug}`}
                        className="card"
                      >
                        <div className="card-title">{l.title}</div>
                        <div className="card-desc">
                          Fundamentos claros con ejemplos y patrones de uso.
                        </div>
                        <div className="card-meta">Ver lección →</div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {isAdvanced && (
                <section>
                  <h3>Avanzado</h3>
                  <div className="section-cards">
                    {lessons.advanced.map((l) => (
                      <Link
                        key={l.slug}
                        to={`/advanced/${l.slug}`}
                        className="card"
                      >
                        <div className="card-title">{l.title}</div>
                        <div className="card-desc">
                          Una introducción clara y ejemplos prácticos.
                        </div>
                        <div className="card-meta">Ver lección →</div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}

      <OnboardingFlow
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}
