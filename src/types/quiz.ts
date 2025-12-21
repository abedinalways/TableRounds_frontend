

export interface Option {
  id: string; 
  text: string;
  percentage?: number;
}

export interface ExplanationItem {
  option: string;
  text: string;
}

export interface Explanation {
  image?: string;
  main: string;
  whyIncorrect: ExplanationItem[];
  pinningPoint: string;
  memoryTrick: string;
  references: string[];
}
export interface QuizProgress {
  currentQuestion: number;
  totalQuestions: number;
  questionID: string;
}

export interface QuizQuestionData {
  testProgress: QuizProgress;
  quizDetails: {
    title: string;
    question: string;
    options: Option[];
    userAnswerId: string | null;
    correctAnswerId: string;
    explanation: Explanation;
  };
}
