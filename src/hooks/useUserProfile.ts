import { useState, useEffect } from "react";

export interface UserProfile {
  experience: "beginner" | "intermediate" | "advanced" | "";
  interests: string[];
  goals: string[];
  timeCommitment: "light" | "regular" | "intensive" | "";
  preferredLearning: "theory" | "practice" | "mixed" | "";
  completedLessons: string[];
  lastActiveDate: string;
  onboardingCompleted: boolean;
  preferences: {
    showRecommendations: boolean;
    showProgress: boolean;
    reminderFrequency: "daily" | "weekly" | "never";
  };
}

const defaultProfile: UserProfile = {
  experience: "",
  interests: [],
  goals: [],
  timeCommitment: "",
  preferredLearning: "",
  completedLessons: [],
  lastActiveDate: "",
  onboardingCompleted: false,
  preferences: {
    showRecommendations: true,
    showProgress: true,
    reminderFrequency: "weekly",
  },
};

const STORAGE_KEY = "react-learning-profile";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar perfil desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile({ ...defaultProfile, ...parsed });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar perfil en localStorage cuando cambie
  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  // Completar onboarding
  const completeOnboarding = (onboardingData: Partial<UserProfile>) => {
    updateProfile({
      ...onboardingData,
      onboardingCompleted: true,
      lastActiveDate: new Date().toISOString(),
    });
  };

  // Marcar lección como completada
  const markLessonCompleted = (lessonId: string) => {
    const newCompletedLessons = [...profile.completedLessons];
    if (!newCompletedLessons.includes(lessonId)) {
      newCompletedLessons.push(lessonId);
      updateProfile({
        completedLessons: newCompletedLessons,
        lastActiveDate: new Date().toISOString(),
      });
    }
  };

  // Obtener progreso
  const getProgress = () => {
    const totalBasicLessons = 13; // Número de lecciones básicas
    const totalAdvancedLessons = 11; // Número de lecciones avanzadas
    const totalLessons = totalBasicLessons + totalAdvancedLessons;

    const completedBasic = profile.completedLessons.filter((id) =>
      id.startsWith("basics/")
    ).length;

    const completedAdvanced = profile.completedLessons.filter((id) =>
      id.startsWith("advanced/")
    ).length;

    return {
      total: profile.completedLessons.length,
      totalLessons,
      percentage: Math.round(
        (profile.completedLessons.length / totalLessons) * 100
      ),
      basic: {
        completed: completedBasic,
        total: totalBasicLessons,
        percentage: Math.round((completedBasic / totalBasicLessons) * 100),
      },
      advanced: {
        completed: completedAdvanced,
        total: totalAdvancedLessons,
        percentage: Math.round(
          (completedAdvanced / totalAdvancedLessons) * 100
        ),
      },
    };
  };

  // Limpiar perfil (para testing o reset)
  const resetProfile = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(defaultProfile);
  };

  // Verificar si es un usuario que regresa
  const isReturningUser = () => {
    if (!profile.onboardingCompleted) return false;
    if (!profile.lastActiveDate) return false;

    const lastActive = new Date(profile.lastActiveDate);
    const daysSinceLastActive = Math.floor(
      (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceLastActive > 1; // Considera "que regresa" si han pasado más de 1 día
  };

  return {
    profile,
    isLoading,
    updateProfile,
    completeOnboarding,
    markLessonCompleted,
    getProgress,
    resetProfile,
    isReturningUser: isReturningUser(),
  };
};
