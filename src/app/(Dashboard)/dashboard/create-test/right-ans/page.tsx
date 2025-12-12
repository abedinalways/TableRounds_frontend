'use client';
import { useState } from 'react';

import { QuizQuestionData } from '@/types/quiz';
import RightAnswerContent from '@/components/create_test_components/RightAnswerContent';
// Mock data
const mockData: QuizQuestionData = {
  testProgress: {
    currentQuestion: 5,
    totalQuestions: 30,
    questionID: '214541',
  },

  quizDetails: {
    title:
      'A 32-year-old man undergoes extraction of multiple impacted third molars...',
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

    explanation: {
      image: '/images/dashboard/main_dashboard/answer.png',

      main: `
Dose-related lidocaine systemic toxicity typically begins with centralized 
nervous system symptoms, and perioral (around mouth) numbness or tingling 
is the classic early sign. Other early neuro-manifestations can include 
metallic taste, tinnitus, and lightheadedness as local anesthetic levels rise. 
As toxicity progresses, symptoms may include visual disturbances, dizziness,
and altered mental status. Seizures occur at higher concentrations.
      `,

      whyIncorrect: [
        {
          option: 'A',
          text: `
Bradycardia is a later cardiovascular toxicity manifestation. Early toxicity 
is dominated by CNS symptoms, not cardiac.
          `,
        },
        {
          option: 'C',
          text: `
Seizures are advanced manifestations of toxicity, not the earliest. Perioral 
numbness precedes seizure activity.
          `,
        },
        {
          option: 'D',
          text: `
Ventricular arrhythmia is a severe late-stage toxicity finding. Early signs 
are neurologic, not cardiac.
          `,
        },
        {
          option: 'E',
          text: `
Urticaria suggests an allergic reaction, not dose-related lidocaine toxicity.
          `,
        },
      ],

      pinningPoint: `
The hallmark of **early** systemic toxicity is **perioral numbness & metallic taste**.
      `,

      memoryTrick: `“Numb lips before numb heart”`,

      references: [
        'Malamed et al. – Handbook of Local Anesthesia',
        'Moore et al. – Ten Years of Mandibular Anesthesia Study',
      ],
    },
  },
};


export default function RightAnswerPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1);

  return (
    <RightAnswerContent
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
