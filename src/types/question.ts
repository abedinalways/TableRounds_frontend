
export type Difficulty = 'Intern' | 'Board' | 'Senior';

export interface AnswerChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionFormValues {
  difficulty: Difficulty;
  topic: string;
  questionStem: string;
  questionId: number;
  questionTitle: string;
  answers: AnswerChoice[];
  explanation: string;
  keyPoints: string;
  keepingPoint: string;
  hasMemoryTrick: boolean;
  memoryTrick: string;
  references: string;
}
