
export type Difficulty = 'Intern' | 'Boards' | 'Senior';

export interface AnswerChoice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionFormValues {
  difficulty: Difficulty;
  topic: string;
  questionStem: string;
  questionTitle: string;
  answers: AnswerChoice[];
  explanation: string;
  keyPoints: string;
  keepingPoint: string;
  memoryTrick: string;
  references: string;
}
