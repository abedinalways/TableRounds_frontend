'use client';
import { useState } from 'react';
import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';
import { QuizQuestionData } from '@/types/quiz';
import { useRouter } from 'next/navigation';
import { MarkedQuestion } from '@/types/markedQuestion';
// Mock data
const mockData: QuizQuestionData = {
  testProgress: {
    currentQuestion: 1,
    totalQuestions: 10,
    questionID: '214541',
  },

  quizDetails: {
    title:
      'A 32-year-old man undergoes extraction of multiple impacted third molars under IV sedation with midazolam, fentanyl, and propofol. For local anesthesia he receives bilateral inferior alveolar nerve blocks and buccal infiltrations with 2% lidocaine containing 1:100,000 epinephrine. At the end of the case, the surgeon reviews the record and realizes that the total lidocaine dose exceeded the recommended maximum for his weight. The team increases monitoring and watches for early manifestations of local anesthetic systemic toxicity.',
    question:
      'Which of the following is the most characteristic early sign of lidocaine toxicity?',
    options: [
      { id: 'A', text: 'Bradycardia', percentage: 4.5 },
      { id: 'B', text: 'Perioral numbness', percentage: 68 },
      { id: 'C', text: 'Seizure', percentage: 26 },
      { id: 'D', text: 'Ventricular arrhythmia', percentage: 20 },
      { id: 'E', text: 'Urticaria', percentage: 17.9 },
    ],
    userAnswerId: null,
    correctAnswerId: 'B',

    explanation: {
      image: '/images/dashboard/main_dashboard/answer.png',

      main: `
Dose-related lidocaine systemic toxicity typically begins with central nervous system symptoms, and perioral (circumoral) numbness or tingling is a classic early sign. Other early neurologic manifestations can include metallic taste, tinnitus, and lightheadedness as cortical excitation precedes depression. With rising plasma levels, the patient may progress to seizures, followed by CNS depression and eventually cardiovascular collapse. Cardiovascular signs such as bradycardia or ventricular arrhythmias tend to appear later and at higher toxic concentrations. Recognizing subtle early neurologic symptoms allows prompt cessation of further anesthetic administration and early initiation of treatment if needed.
      `,

      whyIncorrect: [
        {
          option: 'Bradycardia',
          text: `A later cardiovascular manifestation; early toxicity is dominated by CNS symptoms such as perioral numbness.
          `,
        },
        {
          option: 'Seizure',
          text: `
Seizures are advanced manifestations of toxicity, not the earliest. Perioral 
numbness precedes seizure activity.
          `,
        },
        {
          option: 'Ventricular arrhythmia',
          text: `
Ventricular arrhythmia is a severe late-stage toxicity finding. Early signs 
are neurologic, not cardiac.
          `,
        },
        {
          option: 'Urticaria',
          text: `
Urticaria suggests an allergic reaction, not dose-related lidocaine toxicity.
          `,
        },
      ],

      pinningPoint: `
The earliest hallmark of local anesthetic systemic toxicity is
usually CNS excitation, especially perioral numbness and tinnitus, not immediate cardiovascular collapse.
      `,

      memoryTrick: `“Numb lips before numb heart”`,

      references: [
        'Malamed et al. – Handbook of Local Anesthesia',
        'Maxifwfacial Surgery, Sid ed. 8c. Desver, 2012',
        'Ellis E. Moos KF et Aftar A. Ton years of mandibula',
      ],
    },
  },
};
const questions: QuizQuestionData['quizDetails'][] = [
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
  mockData.quizDetails,
 
];
function initializeMarkedQuestions(): MarkedQuestion[] {
  const saved = localStorage.getItem('MARKED_QUESTIONS');
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Invalid marked questions data', err);
    return [];
  }
}

export default function CreateTestPage() {
  const router = useRouter();
  
  const totalQuestions = questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>(initializeMarkedQuestions);


   //  test-complete redirect
   const handleNext = () => {
     if (currentQuestion === totalQuestions) {
       router.push('/dashboard/test-complete');
     } else {
       setCurrentQuestion(prev => prev + 1);
     }
   };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
 const toggleMark = () => {
   setMarkedQuestions(prev => {
     const exists = prev.some(q => q.index === currentQuestion);

     const updated = exists
       ? prev.filter(q => q.index !== currentQuestion)
       : [
           ...prev,
           {
             index: currentQuestion,
             title: questions[currentQuestion - 1].title,
             question: questions[currentQuestion - 1].question,
           },
         ];

     localStorage.setItem('MARKED_QUESTIONS', JSON.stringify(updated));
     return updated;
   });
 };
 return (
  <QuizQuestionView
    data={{
      testProgress: {
        currentQuestion,
        totalQuestions,
        questionID: String(currentQuestion),
      },
      quizDetails: questions[currentQuestion - 1],
    }}
    markedQuestions={markedQuestions}
    onToggleMark={toggleMark}
    onJumpTo={setCurrentQuestion}
     onNext={handleNext}
     onPrevious={handlePrevious}
  />
); 
}
