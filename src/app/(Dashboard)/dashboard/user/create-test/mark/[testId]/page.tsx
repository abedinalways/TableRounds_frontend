// 'use client';

// import React, { useEffect, useState } from 'react';
// import Flag from '@/components/reusable/icons/Flag';
// import Btn from '@/components/reusable/button/Btn';
// import { ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { MarkedQuestion } from '@/types/markedQuestion';
// import QuestionCard from '@/components/create_test_components/QuestionCard';

// export default function MarkPage() {
//   const router = useRouter();
//   const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);

//   useEffect(() => {
//     const loadMarks = () => {
//       const saved = localStorage.getItem('MARKED_QUESTIONS');
//       if (!saved) return;

//       try {
//         const parsed = JSON.parse(saved);

//         if (Array.isArray(parsed)) {
//           // ✅ REMOVE DUPLICATE
//           const unique = parsed.filter(
//             (item, index, self) =>
//               index ===
//               self?.findIndex(
//                 q => q?.index === item?.index && q?.questionId === item?.questionId,
//               ),
//           );

//           setMarkedQuestions(unique);
//         }
//       } catch (e) {
//         console.error(e);
//       }
//     };

//     loadMarks();

//     window.addEventListener('focus', loadMarks);
//     return () => window.removeEventListener('focus', loadMarks);
//   }, []);

//   return (
//     <div className="min-h-screen background p-4 font-[manrope]">
//       {/* TOP BAR */}
//       <div className="flex items-center justify-between rounded-[12px] border question-bg p-4 mb-4">
//         <div className="flex items-center gap-3 text-white">
//           <Flag className="size-6 text-yellow-400" />
//           <h2 className="text-lg md:text-xl font-bold">
//             Marked Questions ({markedQuestions.length})
//           </h2>
//         </div>

//         <Btn
//           onClick={() => router.back()}
//           className="bg-[#b79e6b] text-white px-4 py-2"
//         >
//           <span className="flex items-center gap-2">
//             <ArrowLeft size={16} /> Back to Test
//           </span>
//         </Btn>
//       </div>

//       {/* MAIN */}
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[80vh]">
//         {/* SIDEBAR */}
//         <aside className="md:col-span-3 bg-[#01281e] rounded-xl p-3 overflow-y-auto custom-scroll">
//           {markedQuestions.length === 0 ? (
//             <div className="text-gray-400 text-center mt-4">No marks yet</div>
//           ) : (
//             markedQuestions.map(item => (
//               <button
//                 key={`${item.index}-${item.questionId}`}
//                 onClick={() => {
//                   document
//                     .getElementById(`marked-${item.index}`)
//                     ?.scrollIntoView({ behavior: 'smooth' });
//                 }}
//                 className="w-full flex items-center justify-between p-3 mb-2 rounded-md border
//                 bg-[#01281e] border-[#084434] text-white hover:bg-[#014030]"
//               >
//                 <span>Question {item.index}</span>
//                 <Flag className="size-4 text-yellow-400" />
//               </button>
//             ))
//           )}
//         </aside>

//         {/* QUESTIONS */}
//         <main className="md:col-span-9 overflow-y-auto custom-scroll space-y-6 pr-2">
//           {markedQuestions.length === 0 ? (
//             <div className="text-center text-gray-300 mt-20">
//               <Flag className="mx-auto mb-2 opacity-40" />
//               No marked questions yet
//             </div>
//           ) : (
//             markedQuestions.map(item => {
//               const data = item?.fullData;

//               if (!data) return null; // ✅ safety

//               return (
//                 <div
//                   key={`${item.index}-${item.questionId}`}
//                   id={`marked-${item.index}`}
//                   className="space-y-3"
//                 >
//                   {/* HEADER */}
//                   <div className="flex items-center gap-3 text-white">
//                     <div className="w-8 h-8 rounded-full bg-[#b79e6b] flex items-center justify-center font-bold">
//                       {item.index}
//                     </div>
//                     <h3 className="font-semibold">Question {item.index}</h3>
//                   </div>

//                   {/* ✅ REAL QUIZ UI */}
//                   <QuestionCard
//                     testId=""
//                     quizDetails={data.quizDetails}
//                     selectedAnswerId={data.quizDetails.userAnswerId ?? null}
//                     showExplanation={true}
//                     isUserCorrect={
//                       data.quizDetails.userAnswerId ===
//                       data.quizDetails.correctAnswerId
//                     }
//                     onAnswerChange={() => {}}
//                     onSubmit={() => {}}
//                     onToggleHide={() => {}}
//                     isQuestionHidden={false}
//                     hideActions={true}
//                     hideToggleButton={true}
//                     hideResult={true}
//                   />
//                 </div>
//               );
//             })
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }

'use client';

import React from 'react';
import Flag from '@/components/reusable/icons/Flag';
import Btn from '@/components/reusable/button/Btn';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/create_test_components/QuestionCard';
import { useGetMarkedQuestionsQuery } from '@/app/redux/api/testSessionApi';

export default function MarkPage() {
  const router = useRouter();

  const {
    data: markedResponse,
    isLoading,
    isError,
  } = useGetMarkedQuestionsQuery();

  const markedQuestions = markedResponse?.data ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen background p-4 font-[manrope] text-white">
        Loading marked questions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen background p-4 font-[manrope] text-white">
        Failed to load marked questions.
      </div>
    );
  }

  return (
    <div className="min-h-screen background p-4 font-[manrope]">
      <div className="flex items-center justify-between rounded-[12px] border question-bg p-4 mb-4">
        <div className="flex items-center gap-3 text-white">
          <Flag className="size-6 text-yellow-400" />
          <h2 className="text-lg md:text-xl font-bold">
            Marked Questions ({markedQuestions.length})
          </h2>
        </div>

        <Btn
          onClick={() => router.back()}
          className="bg-[#b79e6b] text-white px-4 py-2"
        >
          <span className="flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Test
          </span>
        </Btn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[80vh]">
        <aside className="md:col-span-3 bg-[#01281e] rounded-xl p-3 overflow-y-auto custom-scroll">
          {markedQuestions.length === 0 ? (
            <div className="text-gray-400 text-center mt-4">No marks yet</div>
          ) : (
            markedQuestions.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  document
                    .getElementById(`marked-${item.question.id}`)
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-between p-3 mb-2 rounded-md border
                bg-[#01281e] border-[#084434] text-white hover:bg-[#014030]"
              >
                <span>Question {index + 1}</span>
                <Flag className="size-4 text-yellow-400" />
              </button>
            ))
          )}
        </aside>

        <main className="md:col-span-9 overflow-y-auto custom-scroll space-y-6 pr-2">
          {markedQuestions.length === 0 ? (
            <div className="text-center text-gray-300 mt-20">
              <Flag className="mx-auto mb-2 opacity-40" />
              No marked questions yet
            </div>
          ) : (
            markedQuestions.map((item, index) => (
              <div
                key={item.id}
                id={`marked-${item.question.id}`}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-full bg-[#b79e6b] flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold">Question {index + 1}</h3>
                </div>

                <QuestionCard
                  testId={item.test_id}
                  questionID={item.question.id}
                  currentQuestion={index + 1}
                  setQuestions={() => {}}
                  quizDetails={{
                    id: item.question.id,
                    question_id: item?.question?.question_id,
                    question_title: '',
                    question_steam: item.question.question_steam,
                    answerOptions: item.question.answerOptions.map(option => ({
                      id: option.id,
                      option_text: option.option_text,
                      is_correct: false,
                      percentage: 0,
                      total_select: 0, // ✅ Add this required field
                    })),
                    correctAnswerId: null,
                    userAnswerId: null,
                    explanation: null,
                  }}
                  selectedAnswerId={null}
                  showExplanation={false}
                  isUserCorrect={false}
                  onAnswerChange={() => {}}
                  onToggleHide={() => {}}
                  isQuestionHidden={false}
                  hideActions={true}
                  hideToggleButton={true}
                  hideResult={true}
                />
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}