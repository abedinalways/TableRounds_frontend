import { QuizQuestionDataUI } from "./test-session";

export interface MarkedQuestion {
  index: number;
  title: string;
  question: string;
  fullData: QuizQuestionDataUI;
  questionId: string;
}
