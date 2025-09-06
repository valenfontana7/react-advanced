// Type definitions for lesson content
export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[]; // opcional para true-false
  correctAnswer: number | boolean; // índice para multiple-choice, boolean para true-false
  explanation?: string;
  type: "multiple-choice" | "true-false" | "code-completion";
  code?: string; // opcional para mostrar código en la pregunta
}

export interface Quiz {
  id: string;
  title: string;
  description?: string; // opcional
  questions: QuizQuestion[];
  passingScore: number; // porcentaje mínimo para aprobar (ej: 80)
  timeLimit?: number; // en minutos, opcional
}

export interface LessonContent {
  title: string;
  intro?: string;
  theory?: string[];
  example?: string;
  bestPractices?: string[];
  commonMistakes?: string[];
  general?: string[];
  specific?: Record<string, any>;
  quiz?: Quiz; // cada lección puede tener un quiz
}

export interface LessonLevel {
  [slug: string]: LessonContent;
}

export interface ContentMap {
  basics: LessonLevel;
  advanced: LessonLevel;
}
