export interface StartTestPayload {
  total_questions: number;
  test_mode: string[];
  difficulty: string;
  topic: string[];
}

export interface AnswerOption {
  id: string;
  option_text: string;
}

export interface Question {
  id: string;
  question_statement: string;
  question_title: string;
  answer_options: AnswerOption[];
}

export interface StartTestResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    test_mode: string[];
    total_questions: number;
    questions: Question[];
  };
}

export interface AnswerPayload {
  test_id: string;
  question_id: string;
  answer_option_id: string;
}

export interface MarkPayload {
  test_id: string;
  question_id: string;
  is_marked: boolean;
}

export interface SkipPayload {
  test_id: string;
  question_id: string;
}

export interface TestResultResponse {
  success: boolean;
  message: string;
  data: {
    question_id: string;
    correct_answer_id: string;
    user_answer_id: string | null;
    explanation: {
      main: string;
      image?: string | null;
      whyIncorrect: { option: string; text: string }[];
      pinningPoint?: string;
      memoryTrick?: string;
      references: string[];
    };
    // optional
    answer_percentages?: Record<string, number>;
  };
}

export interface QuizOptionUI {
  id: string;
  option_text: string;
  percentage?: number;
}

export interface QuizExplanationUI {
  main: string;
  image?: string | null;
  whyIncorrect: { option: string; text: string }[];
  pinningPoint?: string;
  memoryTrick?: string;
  references: string[];
}

export interface QuizDetailsUI {
  id: string;
  question_title: string;
  question_steam: string;
  answerOptions: QuizOptionUI[];
  userAnswerId: string | null;
  correctAnswerId: string | null;
  explanation: QuizExplanationUI | null;
}

export interface QuizQuestionDataUI {
  testProgress: {
    currentQuestion: number;
    totalQuestions: number;
    questionID: string;
  };
  quizDetails: QuizDetailsUI;
}

export interface MarkedQuestion {
  index: number;
  title: string;
  question: string;
}
