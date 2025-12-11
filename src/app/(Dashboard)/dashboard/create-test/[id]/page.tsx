'use client';
import { useState } from 'react';
import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';
import { QuizQuestionData } from '@/types/quiz';
// Mock data
const mockData: QuizQuestionData = {
  testProgress: {
    currentQuestion: 5,
    totalQuestions: 30,
    questionID: '214541',
  },
  quizDetails: {
    title:
      'A 32-year-old man undergoes extraction of multiple impacted third molars under IV sedation with midazolam, fentanyl, and propofol. For local anesthesia he receives bilateral inferior alveolar nerve blocks and buccal infiltrations with 2% lidocaine containing 1:100,000 epinephrine. At the end of the case, the surgeon reviews the record and realizes that the total lidocaine dose exceeded the recommended maximum for his weight. The team increases monitoring and watches for early manifestations of local anesthetic systemic toxicity.',
    question:
      'Which of the following is the most characteristic early sign of lidocaine toxicity?',
    options: [
      { id: 'A', text: 'Bradycardia' },
      { id: 'B', text: 'Perioral numbness' },
      { id: 'C', text: 'Seizure' },
      { id: 'D', text: 'Ventricular arrhythmia' },
      { id: 'E', text: 'Urticaria' },
    ],
    userAnswerId: null,
    correctAnswerId: 'B',
  },
};
export default function CreateTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);

  return (
    <QuizQuestionView
      data={{
        ...mockData,
        testProgress: {
          ...mockData.testProgress,
          currentQuestion: currentQuestion,
        },
      }}
      onJumpTo={num => setCurrentQuestion(num)}
      onNext={() => setCurrentQuestion(prev => prev + 1)}
    />
  );
}
