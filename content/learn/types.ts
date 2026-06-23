import type { QuizQuestion } from '@/components/learn/QuizBlock';

export interface GlossaryTerm {
  arabic: string;
  transliteration: string;
  definition: string;
}

export interface ModuleContent {
  Body: React.ComponentType;
  quiz: QuizQuestion[];
  glossary: GlossaryTerm[];
}
