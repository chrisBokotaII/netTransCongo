export type Mode = 'home' | 'study' | 'exam' | 'result';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
export type Category = 'Hardware' | 'Network' | 'Security' | 'Troubleshooting';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  category: Category;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  options: Option[];
  correctAnswerId: string;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  answers: Record<number, string>; // questionId -> optionId
  isFinished: boolean;
  mode: Mode;
  timeRemaining: number; // in seconds
}