import React from "react";
import { Link } from "react-router-dom";
import { UserProfile } from "../hooks/useUserProfile";
import { getLessonsForLevel } from "../data";

interface WelcomeBackProps {
  profile: UserProfile;
  progress: {
    total: number;
    totalLessons: number;
    percentage: number;
    basic: { completed: number; total: number; percentage: number };
    advanced: { completed: number; total: number; percentage: number };
  };
  onStartNewLearningPath: () => void;
}

const getRecommendedNextLessons = (profile: UserProfile) => {
  const allBasics = Object.entries(getLessonsForLevel("basics"));
  const allAdvanced = Object.entries(getLessonsForLevel("advanced"));

  const completedLessonSlugs = profile.completedLessons.map((id) => {
    const parts = id.split("/");
    return parts[parts.length - 1]; // Extraer solo el slug
  });

  // Encontrar lecciones no completadas
  const uncompletedBasics = allBasics.filter(
    ([slug]) => !completedLessonSlugs.includes(slug)
  );

  const uncompletedAdvanced = allAdvanced.filter(
    ([slug]) => !completedLessonSlugs.includes(slug)
  );

  // Lógica de recomendación basada en experiencia
  let recommendations: Array<{
    slug: string;
    title: string;
    level: string;
    reason: string;
  }> = [];

  if (profile.experience === "beginner" && uncompletedBasics.length > 0) {
    // Para principiantes, recomendar básicos primero
    recommendations = uncompletedBasics.slice(0, 3).map(([slug, content]) => ({
      slug,
      title: content.title,
      level: "basics",
      reason: "Continúa con los fundamentos",
    }));
  } else if (profile.experience === "intermediate") {
    // Para intermedios, mezclar básicos avanzados y algunos advanced
    const basicsRec = uncompletedBasics.slice(0, 2).map(([slug, content]) => ({
      slug,
      title: content.title,
      level: "basics",
      reason: "Completa los fundamentos",
    }));

    const advancedRec = uncompletedAdvanced
      .slice(0, 2)
      .map(([slug, content]) => ({
        slug,
        title: content.title,
        level: "advanced",
        reason: "Próximo desafío",
      }));

    recommendations = [...basicsRec, ...advancedRec];
  } else {
    // Para avanzados, priorizar temas advanced
    recommendations = uncompletedAdvanced
      .slice(0, 4)
      .map(([slug, content]) => ({
        slug,
        title: content.title,
        level: "advanced",
        reason: "Domina patrones avanzados",
      }));
  }

  return recommendations;
};

const getGreetingByTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "🌅 Buenos días";
  if (hour < 18) return "☀️ Buenas tardes";
  return "🌙 Buenas noches";
};

const getMotivationalMessage = (progress: WelcomeBackProps["progress"]) => {
  if (progress.percentage === 0) {
    return "¡Es hora de comenzar tu viaje de aprendizaje!";
  } else if (progress.percentage < 25) {
    return "¡Buen comienzo! Mantén el momentum.";
  } else if (progress.percentage < 50) {
    return "¡Vas por buen camino! Ya llevas un cuarto del camino.";
  } else if (progress.percentage < 75) {
    return "¡Excelente progreso! Ya estás en la mitad.";
  } else if (progress.percentage < 100) {
    return "¡Casi lo logras! Estás muy cerca de completar todo.";
  } else {
    return "🎉 ¡Felicitaciones! Has completado todas las lecciones.";
  }
};

export default function WelcomeBack({
  profile,
  progress,
  onStartNewLearningPath,
}: WelcomeBackProps) {
  const recommendations = getRecommendedNextLessons(profile);
  const greeting = getGreetingByTimeOfDay();
  const motivationalMessage = getMotivationalMessage(progress);

  const lastActiveDate = profile.lastActiveDate
    ? new Date(profile.lastActiveDate).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Hace tiempo";

  return (
    <div className="welcome-back">
      <div className="welcome-header">
        <h2 className="welcome-greeting">{greeting}</h2>
        <p className="welcome-subtitle">Última visita: {lastActiveDate}</p>
      </div>

      <div className="progress-overview">
        <div className="progress-card">
          <h3>Tu Progreso</h3>
          <div className="progress-circle">
            <div
              className="circle-progress"
              style={{ "--progress": progress.percentage } as any}
            >
              <span className="progress-text">{progress.percentage}%</span>
            </div>
          </div>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-number">{progress.total}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {progress.totalLessons - progress.total}
              </span>
              <span className="stat-label">Restantes</span>
            </div>
          </div>
          <p className="motivation-message">{motivationalMessage}</p>
        </div>

        <div className="level-progress">
          <div className="level-card">
            <h4>Básicos</h4>
            <div className="level-bar">
              <div
                className="level-fill"
                style={{ width: `${progress.basic.percentage}%` }}
              />
            </div>
            <span className="level-text">
              {progress.basic.completed}/{progress.basic.total}
            </span>
          </div>

          <div className="level-card">
            <h4>Avanzado</h4>
            <div className="level-bar">
              <div
                className="level-fill advanced"
                style={{ width: `${progress.advanced.percentage}%` }}
              />
            </div>
            <span className="level-text">
              {progress.advanced.completed}/{progress.advanced.total}
            </span>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Recomendado para ti</h3>
          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <Link
                key={rec.slug}
                to={`/${rec.level}/${rec.slug}`}
                className="recommendation-card-mini"
              >
                <div className="rec-priority">{index + 1}</div>
                <div className="rec-content">
                  <div className="rec-title">{rec.title}</div>
                  <div className="rec-reason">{rec.reason}</div>
                  <div className="rec-level-badge">{rec.level}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="quick-actions">
        <Link to="/basics" className="action-btn primary">
          <span className="action-icon">📚</span>
          <span>Explorar Básicos</span>
        </Link>

        <Link to="/advanced" className="action-btn secondary">
          <span className="action-icon">🚀</span>
          <span>Ver Avanzado</span>
        </Link>

        <button
          className="action-btn tertiary"
          onClick={onStartNewLearningPath}
        >
          <span className="action-icon">🎯</span>
          <span>Nueva Ruta</span>
        </button>
      </div>

      {progress.percentage === 100 && (
        <div className="completion-celebration">
          <div className="celebration-content">
            <div className="celebration-icon">🎉</div>
            <h3>¡Felicitaciones!</h3>
            <p>Has completado todas las lecciones disponibles.</p>
            <button className="btn primary" onClick={onStartNewLearningPath}>
              Explorar nuevos temas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
