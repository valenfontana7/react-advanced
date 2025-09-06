import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getLessonsForLevel } from "../data";
import { UserProfile } from "../hooks/useUserProfile";

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profileData: Partial<UserProfile>) => void;
}

const EXPERIENCE_OPTIONS = [
  {
    value: "beginner",
    title: "🌱 Principiante",
    description: "Nuevo en React o desarrollo web",
  },
  {
    value: "intermediate",
    title: "📈 Intermedio",
    description: "Tengo experiencia básica con React",
  },
  {
    value: "advanced",
    title: "🚀 Avanzado",
    description: "Quiero dominar patrones complejos",
  },
] as const;

const INTEREST_OPTIONS = [
  { id: "hooks", label: "🎣 Hooks avanzados", category: "advanced" },
  { id: "performance", label: "⚡ Optimización", category: "advanced" },
  { id: "testing", label: "🧪 Testing", category: "advanced" },
  {
    id: "state-management",
    label: "📊 Gestión de estado",
    category: "advanced",
  },
  { id: "jsx", label: "🏗️ JSX y componentes", category: "basics" },
  { id: "events", label: "🎯 Eventos", category: "basics" },
  { id: "forms", label: "📝 Formularios", category: "basics" },
  { id: "styling", label: "🎨 Estilos", category: "basics" },
];

const GOAL_OPTIONS = [
  "👨‍💼 Conseguir trabajo como developer",
  "🏗️ Construir proyectos personales",
  "📚 Mejorar habilidades existentes",
  "🎯 Preparar certificaciones",
  "👥 Enseñar a otros",
  "🚀 Crear productos digitales",
];

const TIME_OPTIONS = [
  {
    value: "light",
    title: "🌙 Ligero",
    description: "15-30 min/día",
  },
  {
    value: "regular",
    title: "📖 Regular",
    description: "30-60 min/día",
  },
  {
    value: "intensive",
    title: "🔥 Intensivo",
    description: "1-2 horas/día",
  },
] as const;

const LEARNING_OPTIONS = [
  {
    value: "theory",
    title: "📚 Teoría primero",
    description: "Entender conceptos antes de practicar",
  },
  {
    value: "practice",
    title: "⚡ Práctica directa",
    description: "Aprender haciendo con ejemplos",
  },
  {
    value: "mixed",
    title: "🔄 Mixto",
    description: "Balance entre teoría y práctica",
  },
] as const;

type OnboardingProfile = Pick<
  UserProfile,
  "experience" | "interests" | "goals" | "timeCommitment" | "preferredLearning"
>;

export default function OnboardingFlow({
  isOpen,
  onClose,
  onComplete,
}: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<OnboardingProfile>({
    experience: "",
    interests: [],
    goals: [],
    timeCommitment: "",
    preferredLearning: "",
  });

  const totalSteps = 5;

  if (!isOpen) return null;

  const handleExperienceSelect = (
    experience: OnboardingProfile["experience"]
  ) => {
    setProfile((prev) => ({ ...prev, experience }));
  };

  const handleInterestToggle = (interestId: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleComplete = () => {
    onComplete(profile);
    onClose();
  };

  const getRecommendations = () => {
    const allBasics = Object.entries(getLessonsForLevel("basics"));
    const allAdvanced = Object.entries(getLessonsForLevel("advanced"));

    // Lógica de recomendación basada en el perfil
    let recommendedLessons: Array<{
      slug: string;
      title: string;
      level: string;
      reason: string;
    }> = [];

    if (profile.experience === "beginner") {
      // Para principiantes, empezar con JSX y componentes
      const essentials = [
        "jsx",
        "props-state",
        "events",
        "conditional-rendering",
      ];
      recommendedLessons = essentials
        .map((slug) => {
          const lesson = allBasics.find(([key]) => key === slug);
          return lesson
            ? {
                slug,
                title: lesson[1].title,
                level: "basics",
                reason: "Fundamento esencial para React",
              }
            : null;
        })
        .filter(Boolean) as any[];
    } else if (profile.experience === "intermediate") {
      // Para intermedios, hooks y patrones
      const intermediate = ["hooks-intro", "lifecycle", "lifting-state"];
      recommendedLessons = intermediate
        .map((slug) => {
          const lesson = allBasics.find(([key]) => key === slug);
          return lesson
            ? {
                slug,
                title: lesson[1].title,
                level: "basics",
                reason: "Consolida tu conocimiento",
              }
            : null;
        })
        .filter(Boolean) as any[];

      // Agregar algunas lecciones avanzadas
      const advancedPick = allAdvanced.slice(0, 2).map(([slug, content]) => ({
        slug,
        title: content.title,
        level: "advanced",
        reason: "Siguiente nivel",
      }));
      recommendedLessons.push(...advancedPick);
    } else {
      // Para avanzados, directamente a patrones complejos
      recommendedLessons = allAdvanced.slice(0, 4).map(([slug, content]) => ({
        slug,
        title: content.title,
        level: "advanced",
        reason: "Domina React",
      }));
    }

    // Filtrar por intereses si los hay
    if (profile.interests.length > 0) {
      const interestBasedLessons = profile.interests
        .map((interest) => {
          // Mapear intereses a lecciones específicas
          const interestMap: Record<string, { slug: string; level: string }[]> =
            {
              jsx: [{ slug: "jsx", level: "basics" }],
              hooks: [{ slug: "hooks-intro", level: "basics" }],
              events: [{ slug: "events", level: "basics" }],
              forms: [{ slug: "forms", level: "basics" }],
              styling: [{ slug: "styling", level: "basics" }],
              performance: [], // Aquí irían lecciones de performance cuando estén disponibles
              testing: [],
              "state-management": [{ slug: "lifting-state", level: "basics" }],
            };

          return interestMap[interest] || [];
        })
        .flat();

      // Combinar con recomendaciones existentes
      interestBasedLessons.forEach(({ slug, level }) => {
        const lessons = level === "basics" ? allBasics : allAdvanced;
        const lesson = lessons.find(([key]) => key === slug);
        if (lesson && !recommendedLessons.find((r) => r.slug === slug)) {
          recommendedLessons.push({
            slug,
            title: lesson[1].title,
            level,
            reason: "Basado en tus intereses",
          });
        }
      });
    }

    return recommendedLessons.slice(0, 6); // Limitar a 6 recomendaciones
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="onboarding-step">
            <div className="step-header">
              <h2>¡Bienvenido! 👋</h2>
              <p>Vamos a personalizar tu experiencia de aprendizaje</p>
            </div>
            <div className="step-content">
              <h3>¿Cuál es tu nivel de experiencia con React?</h3>
              <div className="options-grid">
                {EXPERIENCE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`option-card ${
                      profile.experience === option.value ? "selected" : ""
                    }`}
                    onClick={() => handleExperienceSelect(option.value)}
                  >
                    <div className="option-title">{option.title}</div>
                    <div className="option-description">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step">
            <div className="step-header">
              <h2>Intereses 🎯</h2>
              <p>¿Qué temas te interesan más? (puedes elegir varios)</p>
            </div>
            <div className="step-content">
              <div className="interests-grid">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest.id}
                    className={`interest-tag ${
                      profile.interests.includes(interest.id) ? "selected" : ""
                    }`}
                    onClick={() => handleInterestToggle(interest.id)}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step">
            <div className="step-header">
              <h2>Objetivos 🎯</h2>
              <p>¿Cuáles son tus objetivos principales?</p>
            </div>
            <div className="step-content">
              <div className="goals-grid">
                {GOAL_OPTIONS.map((goal) => (
                  <button
                    key={goal}
                    className={`goal-item ${
                      profile.goals.includes(goal) ? "selected" : ""
                    }`}
                    onClick={() => handleGoalToggle(goal)}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="onboarding-step">
            <div className="step-header">
              <h2>Tiempo disponible ⏰</h2>
              <p>¿Cuánto tiempo puedes dedicar al día?</p>
            </div>
            <div className="step-content">
              <div className="options-grid">
                {TIME_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`option-card ${
                      profile.timeCommitment === option.value ? "selected" : ""
                    }`}
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        timeCommitment: option.value,
                      }))
                    }
                  >
                    <div className="option-title">{option.title}</div>
                    <div className="option-description">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="onboarding-step">
            <div className="step-header">
              <h2>Estilo de aprendizaje 🧠</h2>
              <p>¿Cómo prefieres aprender?</p>
            </div>
            <div className="step-content">
              <div className="options-grid">
                {LEARNING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`option-card ${
                      profile.preferredLearning === option.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setProfile((prev) => ({
                        ...prev,
                        preferredLearning: option.value,
                      }))
                    }
                  >
                    <div className="option-title">{option.title}</div>
                    <div className="option-description">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        const recommendations = getRecommendations();
        return (
          <div className="onboarding-step">
            <div className="step-header">
              <h2>Tu ruta personalizada 🗺️</h2>
              <p>Basándome en tus respuestas, estas son mis recomendaciones:</p>
            </div>
            <div className="step-content">
              <div className="recommendations">
                {recommendations.map((rec, index) => (
                  <Link
                    key={rec.slug}
                    to={`/${rec.level}/${rec.slug}`}
                    className="recommendation-card"
                    onClick={handleComplete}
                  >
                    <div className="rec-number">{index + 1}</div>
                    <div className="rec-content">
                      <div className="rec-title">{rec.title}</div>
                      <div className="rec-reason">{rec.reason}</div>
                      <div className="rec-level">Nivel: {rec.level}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="final-actions">
                <Link
                  to="/basics"
                  className="btn primary"
                  onClick={handleComplete}
                >
                  Comenzar con básicos
                </Link>
                <Link
                  to="/advanced"
                  className="btn secondary"
                  onClick={handleComplete}
                >
                  Ir a avanzado
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return profile.experience !== "";
      case 2:
        return true; // Los intereses son opcionales
      case 3:
        return true; // Los objetivos son opcionales
      case 4:
        return profile.timeCommitment !== "";
      case 5:
        return profile.preferredLearning !== "";
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (step < totalSteps + 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="onboarding-body">{renderStep()}</div>

        <div className="onboarding-footer">
          <div className="step-info">
            Paso {Math.min(step, totalSteps)} de {totalSteps}
          </div>
          <div className="navigation-buttons">
            {step > 1 && (
              <button className="btn secondary" onClick={prevStep}>
                Anterior
              </button>
            )}
            {step <= totalSteps && (
              <button
                className="btn primary"
                onClick={nextStep}
                disabled={!canContinue()}
              >
                {step === totalSteps ? "Ver recomendaciones" : "Continuar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
