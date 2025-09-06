import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";
import Markdown from "../components/Markdown";
import QuizComponent from "../components/QuizComponent";
import { contentMap, getLessonNavigation } from "../data";
import { useUserProfile } from "../hooks/useUserProfile";

export default function Lesson() {
  const { level, slug } = useParams();
  const { markLessonCompleted, profile } = useUserProfile();

  // control local para cross-fade: mantenemos el slug/level actuales y alternamos visibilidad
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(slug);
  const [currentLevel, setCurrentLevel] = useState<string | undefined>(level);
  const [visible, setVisible] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Si no cambió, nada
    if (slug === currentSlug && level === currentLevel) return;

    // iniciar fade out
    setVisible(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // esperar el tiempo de transición y luego cambiar contenido y hacer fade in
    timerRef.current = window.setTimeout(() => {
      setCurrentSlug(slug);
      setCurrentLevel(level);
      setVisible(true);
      timerRef.current = null;
    }, 260); // debe coincidir con la duración en CSS

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [slug, level, currentSlug, currentLevel]);

  if (!currentLevel || !currentSlug) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Lección no encontrada</h2>
        <p>
          Vuelve a <Link to="/">Inicio</Link>
        </p>
      </div>
    );
  }

  // contentMap es un objeto dinámico; hacemos un cast a any para indexar con strings
  // (suficiente para este ejemplo educativo). Si prefieres, podemos definir tipos más estrictos.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entry = (contentMap as any)[currentLevel as string]?.[
    currentSlug as string
  ];

  if (!entry) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No hay contenido para esta lección</h2>
        <p>
          Revisa <Link to="/">Inicio</Link>
        </p>
      </div>
    );
  }

  const sections = Object.keys(entry).filter(
    (k) => k !== "title" && k !== "quiz"
  );
  const hasQuiz = entry.quiz;
  const lessonId = `${currentLevel}-${currentSlug}`;
  const isLessonCompleted = profile.completedLessons.includes(lessonId);

  // Use helper function for navigation
  const { prevSlug, nextSlug } = getLessonNavigation(currentLevel, currentSlug);

  const handleQuizComplete = (
    passed: boolean,
    score: number,
    answers: Record<string, number>
  ) => {
    setQuizCompleted(true);
    if (passed) {
      markLessonCompleted(lessonId);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const translateKey = (k: string) => {
    const map: Record<string, string> = {
      intro: "Introducción",
      theory: "Teoría",
      example: "Ejemplo",
      bestPractices: "Buenas prácticas",
      pitfalls: "Errores comunes",
      resources: "Recursos",
      general: "General",
      specific: "Específico",
    };
    return map[k] ?? k.charAt(0).toUpperCase() + k.slice(1);
  };

  return (
    <div className="lesson-page">
      <div className="lesson-top">
        <header className="lesson-hero">
          <div className="lesson-hero-inner">
            <div className="lesson-badge">{level?.toUpperCase()}</div>
            <h1 className="lesson-title">
              {entry.title || `${currentLevel} / ${currentSlug}`}
            </h1>
            {entry.intro && <p className="lesson-intro">{entry.intro}</p>}
          </div>
        </header>
        <aside className="lesson-sidebar">
          <nav className="toc">
            <strong>Contenido</strong>
            <ul>
              {sections.map((s) => {
                // usar el title definido en la sección si existe
                // @ts-ignore
                const secTitle = (entry as any)[s]?.title ?? translateKey(s);
                return (
                  <li key={s}>
                    <a
                      href={`#sec-${s}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(`sec-${s}`);
                        if (el)
                          el.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                    >
                      {secTitle}
                    </a>
                  </li>
                );
              })}
              {hasQuiz && (
                <li>
                  <a
                    href="#quiz-section"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById("quiz-section");
                      if (el)
                        el.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                  >
                    📝 Quiz
                    {isLessonCompleted && (
                      <span style={{ color: "#10b981", marginLeft: "0.5rem" }}>
                        ✓
                      </span>
                    )}
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <div style={{ marginTop: 20 }}>
            <Link to={`/${level}`}>Volver a {level}</Link>
          </div>
        </aside>
      </div>
      <main className="lesson-main">
        <div className={`fade-wrapper ${visible ? "visible" : "hidden"}`}>
          {sections.map((secKey) => {
            // @ts-ignore
            const sec = entry[secKey];
            const title =
              (sec && typeof sec === "object" && sec.title) ||
              translateKey(secKey);

            // Si la sección es una cadena (string), renderizarla directamente
            if (sec == null || typeof sec === "string") {
              return (
                <section
                  id={`sec-${secKey}`}
                  key={secKey}
                  className="lesson-section spec-card"
                >
                  <h3>{title}</h3>
                  {typeof sec === "string" &&
                    (secKey === "example" ? (
                      <div className="spec-example">
                        <CodeBlock code={sec} language="tsx" />
                      </div>
                    ) : (
                      <Markdown>{sec}</Markdown>
                    ))}
                </section>
              );
            }

            // Si la sección es un array, mostrarlo como lista
            if (Array.isArray(sec)) {
              // renderizar arrays como listas Markdown para un render más rico
              const md = sec.map((it: any) => `- ${String(it)}`).join("\n");
              return (
                <section
                  id={`sec-${secKey}`}
                  key={secKey}
                  className="lesson-section spec-card"
                >
                  <h3>{title}</h3>
                  <Markdown>{md}</Markdown>
                </section>
              );
            }

            // Si es un objeto, iterar sus subsecciones (intro, theory, example...)
            const subsectionKeys = Object.keys(sec).filter(
              (k) => k !== "title"
            );
            return (
              <section
                id={`sec-${secKey}`}
                key={secKey}
                className="lesson-section spec-card"
              >
                <h3>{title}</h3>
                {subsectionKeys.map((sub) => {
                  // @ts-ignore
                  const content = sec[sub];
                  if (!content && content !== 0) return null;
                  return (
                    <div key={sub} style={{ marginTop: 10 }}>
                      <h4 className="spec-title">{translateKey(sub)}</h4>
                      {sub === "example" && typeof content === "string" ? (
                        <div className="spec-example">
                          <CodeBlock code={content} language="tsx" />
                        </div>
                      ) : Array.isArray(content) ? (
                        // renderizar arrays de subsecciones como Markdown (listas)
                        <Markdown>
                          {content.map((it: string) => `- ${it}`).join("\n")}
                        </Markdown>
                      ) : (
                        typeof content === "string" && (
                          <Markdown>{content}</Markdown>
                        )
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })}

          {/* Quiz Section */}
          {hasQuiz && (
            <section id="quiz-section" className="lesson-section">
              {!showQuiz ? (
                <div className="quiz-intro">
                  <h3>🎯 Pon a prueba tus conocimientos</h3>
                  <p>
                    Completa el quiz para marcar esta lección como terminada y
                    seguir con tu progreso de aprendizaje.
                  </p>
                  {isLessonCompleted ? (
                    <div className="lesson-completed">
                      <p>
                        <span style={{ color: "#10b981", fontSize: "1.2rem" }}>
                          ✅
                        </span>
                        ¡Ya completaste esta lección! Puedes repetir el quiz si
                        quieres.
                      </p>
                    </div>
                  ) : null}
                  <button
                    className="nav-button next-button"
                    onClick={handleStartQuiz}
                    style={{ marginTop: "1rem" }}
                  >
                    🚀 Comenzar Quiz
                  </button>
                </div>
              ) : (
                <QuizComponent
                  quiz={entry.quiz}
                  onComplete={handleQuizComplete}
                  onClose={() => {
                    setShowQuiz(false);
                    setQuizCompleted(false);
                  }}
                />
              )}
            </section>
          )}
        </div>
      </main>
      <nav
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          marginTop: 18,
        }}
        aria-label="Navegación de lecciones"
      >
        {prevSlug ? (
          <Link
            to={`/${level}/${prevSlug}`}
            className="btn ghost"
            aria-label="Lección anterior"
          >
            ← Anterior
          </Link>
        ) : (
          <div />
        )}

        {nextSlug ? (
          <Link
            to={`/${level}/${nextSlug}`}
            className="btn primary"
            aria-label="Siguiente lección"
          >
            Siguiente →
          </Link>
        ) : (
          <div />
        )}
      </nav>
      <div style={{ display: "none" }} />
    </div>
  );
}
