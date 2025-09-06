// Main content map - combines all lesson levels
import { basicsContent } from "./basics";
import { advancedContent } from "./advanced";
import { ContentMap } from "./types";

// Combined content map
export const contentMap: ContentMap = {
  basics: basicsContent,
  advanced: advancedContent,
};

// Helper function to get lesson navigation
export function getLessonNavigation(level: string, slug: string) {
  const lessons = contentMap[level as keyof typeof contentMap];
  if (!lessons) return { prevSlug: null, nextSlug: null };

  const lessonKeys = Object.keys(lessons);
  const currentIndex = lessonKeys.indexOf(slug);

  return {
    prevSlug: currentIndex > 0 ? lessonKeys[currentIndex - 1] : null,
    nextSlug:
      currentIndex < lessonKeys.length - 1
        ? lessonKeys[currentIndex + 1]
        : null,
  };
}

// Helper function to get all lessons for a level
export function getLessonsForLevel(level: string) {
  return contentMap[level as keyof typeof contentMap] || {};
}

// Re-export types for convenience
export type { LessonContent, LessonLevel, ContentMap } from "./types";
