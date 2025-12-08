

export interface Option {
  id: string; 
  text: string;
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
  };
}
