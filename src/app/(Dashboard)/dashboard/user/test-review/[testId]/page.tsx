

// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // 'use client';

// // import { useParams, useRouter } from 'next/navigation';
// // import { useGetTestDetailsQuery } from '@/app/redux/api/testSessionApi';
// // import { TestReviewSkeleton } from '@/components/preview-test/TestReviewSkeleton';
// // import ExplainIcon from '@/components/reusable/icons/ExplainIcon';
// // import CancelIcon from '@/components/reusable/icons/CancelIcon';
// // import PimpingIcon from '@/components/reusable/icons/PimpingIcon';
// // import MemoryIcon from '@/components/reusable/icons/MemoryIcon';
// // import BookIcon from '@/components/reusable/icons/BookIcon';
// // import Image from 'next/image';

// // function getBulletItems(content?: string | null) {
// //   if (!content) return [];

// //   return content
// //     .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
// //     .replace(/<br\s*\/?>/gi, '\n')
// //     .replace(/<\/?p[^>]*>/gi, '')
// //     .replace(/<\/?ul[^>]*>/gi, '')
// //     .replace(/<\/li>\s*<li[^>]*>/gi, '\n')
// //     .replace(/<\/?li[^>]*>/gi, '')
// //     .replace(/&nbsp;/gi, ' ')
// //     .split(/\n+/)
// //     .map(item => item.replace(/^[\s•*-]+/, '').trim())
// //     .filter(Boolean);
// // }

// // function BulletContent({ content }: { content?: string | null }) {
// //   const items = getBulletItems(content);

// //   if (!items.length) return null;

// //   return (
// //     <ul className="list-disc pl-6 space-y-1">
// //       {items.map((item, index) => (
// //         <li
// //           key={index}
// //           className="pl-1"
// //           dangerouslySetInnerHTML={{ __html: item }}
// //         />
// //       ))}
// //     </ul>
// //   );
// // }

// // const displayDifficultyLabel = (difficulty: string): string => {
// //   if (difficulty === 'Board') return 'Boards';
// //   return difficulty;
// // };

// // export default function TestReviewPage() {
// //   const { testId } = useParams();

// //   const router = useRouter();
// //   const { data, isLoading } = useGetTestDetailsQuery(testId);
// //   // console.log(data, '+++++++++++++++++++++++')
// //   if (isLoading) {
// //     return <TestReviewSkeleton />;
// //   }

// //   const test = data?.data;
// //   const diff = test?.difficulty.join(' , ');
// //   return (
// //     <div className="p-6 space-y-6  font-[manrope]">
// //       <div className="flex justify-between items-center">
// //         <h2 className="text-5xl font-bold">Test Review</h2>
// //         <button
// //           onClick={() => router.back()}
// //           className="px-6 py-2 percentage-bg text-white rounded-md cursor-pointer"
// //         >
// //           Go Back
// //         </button>
// //       </div>
// //       {/* Header */}
// //       <div className="percentage-bg text-white p-4 flex text-3xl flex-col justify-center items-center rounded-xl">
// //         <p>Score: {test?.score}%</p>
// //         <p>Total Questions: {test?.total_questions}</p>
// //         {/* <p>Difficulty: {displayDifficultyLabel(diff)}</p> */}
// //       </div>

// //       {/* Questions */}
// //       <div className="space-y-6">
// //         {test?.questions?.map((q: any, index: number) => {
// //           const correctOption = q.answerOptions.find((o: any) => o.is_correct);

// //           return (
// //             <div
// //               key={q.id}
// //               className="border rounded-xl p-4 bg-white shadow-sm "
// //             >
// //               {/* Question */}
// //               <h3 className="font-semibold mb-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 border-b pb-2">
// //                 {/* Question Title */}
// //                 <span className="text-xl font-bold md:mr-4 block">
// //                   Q{index + 1}. {q.question_title}
// //                 </span>

// //                 {/* Badges Container */}
// //                 <div className="flex flex-wrap items-center gap-2">
// //                   {/* Question ID */}
// //                   <span className="flex gap-1 items-center text-xs bg-gray-100 border border-gray-200 px-2 py-1 rounded-md text-gray-700">
// //                     <span className="font-medium text-gray-500">
// //                       Question ID:
// //                     </span>
// //                     <span className="font-semibold">
// //                       {q.question_id || q.id}
// //                     </span>
// //                   </span>

// //                   {/* Difficulty (Array or String handler) */}
// //                   {q.difficulty && (
// //                     <div className="flex flex-wrap items-center gap-1">
// //                       <span className="text-xs font-medium text-gray-500 mr-1">
// //                         Difficulty:
// //                       </span>
// //                       {(Array.isArray(q.difficulty)
// //                         ? q.difficulty
// //                         : [q.difficulty]
// //                       ).map((diff: string, dIdx: number) => (
// //                         <span
// //                           key={dIdx}
// //                           className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
// //                         >
// //                           {diff === 'Board' ? 'Boards' : diff}
// //                         </span>
// //                       ))}
// //                     </div>
// //                   )}

// //                   {/* Topic (Array handler) */}
// //                   {q.topic &&
// //                     (Array.isArray(q.topic) ? q.topic : [q.topic]).length >
// //                       0 && (
// //                       <div className="flex flex-wrap items-center gap-1 md:ml-2">
// //                         <span className="text-xs font-medium text-gray-500 mr-1">
// //                           Topic:
// //                         </span>
// //                         {(Array.isArray(q.topic) ? q.topic : [q.topic]).map(
// //                           (top: string, tIdx: number) => (
// //                             <span
// //                               key={tIdx}
// //                               className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-0.5 rounded-full shadow-sm"
// //                             >
// //                               {top
// //                                 .replace(/Recontraction/gi, 'Reconstruction')
// //                                 .replace(/_/g, ' / ')}
// //                             </span>
// //                           ),
// //                         )}
// //                       </div>
// //                     )}
// //                 </div>
// //               </h3>
// //               <p
// //                 className="text-lg text-gray-600 mb-3"
// //                 dangerouslySetInnerHTML={{ __html: q.question_steam }}
// //               />

// //               {/* Options */}
// //               <div className="space-y-2">
// //                 {q.answerOptions.map((opt: any) => {
// //                   const isCorrect = opt.is_correct;
// //                   const isSelected = opt.id === q.user_selected_option_id;

// //                   return (
// //                     <div
// //                       key={opt.id}
// //                       className={`p-2 rounded-md text-md border
// //                         ${
// //                           isCorrect
// //                             ? 'bg-green-100 border-green-400'
// //                             : isSelected
// //                               ? 'bg-red-100 border-red-400'
// //                               : 'bg-gray-50'
// //                         }
// //                       `}
// //                     >
// //                       {opt.option_text}
// //                     </div>
// //                   );
// //                 })}
// //               </div>

// //               {/* Explanation */}
// //               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
// //                 <p className="font-bold mb-1 flex items-center gap-2 text-xl">
// //                   <ExplainIcon /> Explanation:
// //                 </p>

// //                 <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
// //               </div>

// //               {/* Why Incorrect */}
// //               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
// //                 <p className="font-bold mb-1 flex items-center gap-2 text-xl">
// //                   <CancelIcon /> Why The Other Option Are Incorrect:
// //                 </p>

// //                 <BulletContent content={q.why_incorrect} />
// //               </div>

// //               {/* pimping point*/}
// //               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
// //                 <p className="font-bold mb-1 flex items-center gap-2 text-xl">
// //                   <PimpingIcon /> Pimping Point:
// //                 </p>

// //                 <div dangerouslySetInnerHTML={{ __html: q.pimping_point }} />
// //               </div>
// //               {/* Memory trick */}
// //               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
// //                 <p className="font-bold mb-1 flex items-center gap-2 text-xl">
// //                   <MemoryIcon /> Memory Trick:
// //                 </p>

// //                 <div dangerouslySetInnerHTML={{ __html: q.memory_trick }} />
// //               </div>

// //               {/* pimping point*/}
// //               {/* <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
// //                 <p className="font-semibold mb-1">Pimping Point:</p>

// //                 <div dangerouslySetInnerHTML={{ __html: q.pimping_point }} />
// //               </div> */}
// //               {/* reference */}
// //               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
// //                 <p className="font-bold mb-1 flex items-center gap-2 text-xl">
// //                   <BookIcon /> References:
// //                 </p>

// //                 <BulletContent content={q.referance} />
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // }


// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useParams, useRouter } from 'next/navigation';
// import { useGetTestDetailsQuery } from '@/app/redux/api/testSessionApi';
// import { TestReviewSkeleton } from '@/components/preview-test/TestReviewSkeleton';
// import ExplainIcon from '@/components/reusable/icons/ExplainIcon';
// import CancelIcon from '@/components/reusable/icons/CancelIcon';
// import PimpingIcon from '@/components/reusable/icons/PimpingIcon';
// import MemoryIcon from '@/components/reusable/icons/MemoryIcon';
// import BookIcon from '@/components/reusable/icons/BookIcon';
// import Image from 'next/image';

// function getBulletItems(content?: string | null) {
//   if (!content) return [];

//   return content
//     .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
//     .replace(/<br\s*\/?>/gi, '\n')
//     .replace(/<\/?p[^>]*>/gi, '')
//     .replace(/<\/?ul[^>]*>/gi, '')
//     .replace(/<\/li>\s*<li[^>]*>/gi, '\n')
//     .replace(/<\/?li[^>]*>/gi, '')
//     .replace(/&nbsp;/gi, ' ')
//     .split(/\n+/)
//     .map(item => item.replace(/^[\s•*-]+/, '').trim())
//     .filter(Boolean);
// }

// function BulletContent({ content }: { content?: string | null }) {
//   const items = getBulletItems(content);

//   if (!items.length) return null;

//   return (
//     <ul className="list-disc pl-6 space-y-1">
//       {items.map((item, index) => (
//         <li
//           key={index}
//           className="pl-1"
//           dangerouslySetInnerHTML={{ __html: item }}
//         />
//       ))}
//     </ul>
//   );
// }

// const displayDifficultyLabel = (difficulty: string): string => {
//   if (difficulty === 'Board') return 'Boards';
//   return difficulty;
// };

// const displayTopicLabel = (topic: string): string => {
//   return topic
//     .replace(/Recontraction/gi, 'Reconstruction')
//     .replace(/_/g, ' / ');
// };

// function MetaBadge({
//   label,
//   value,
//   colorClass = 'bg-white/90 text-[#01281e]',
// }: {
//   label: string;
//   value: string;
//   colorClass?: string;
// }) {
//   return (
//     <span
//       className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-sm ${colorClass}`}
//     >
//       <span className="opacity-70">{label}:</span>
//       <span>{value}</span>
//     </span>
//   );
// }

// export default function TestReviewPage() {
//   const { testId } = useParams();
//   const router = useRouter();
//   const { data, isLoading } = useGetTestDetailsQuery(testId);

//   if (isLoading) {
//     return <TestReviewSkeleton />;
//   }

//   const test = data?.data;

//   return (
//     <div className="min-h-screen bg-white font-[manrope]">
//       <div className="px-4 md:px-6 py-6 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//           <div>
//             <h2 className="text-3xl md:text-5xl font-bold text-[#01281e]">
//               Test Review
//             </h2>
//           </div>

//           <button
//             onClick={() => router.back()}
//             className="self-start md:self-auto px-6 py-2 percentage-bg text-white rounded-md cursor-pointer hover:opacity-90 transition"
//           >
//             Go Back
//           </button>
//         </div>

//         {/* Score Summary */}
//         <div className="percentage-bg text-white p-5 md:p-6 rounded-[18px] shadow-sm flex flex-col items-center justify-center text-center">
//           <p className="text-xl md:text-3xl font-semibold">
//             Score: {test?.score}%
//           </p>
//           <p className="text-lg md:text-2xl mt-1">
//             Total Questions: {test?.total_questions}
//           </p>
//           <p className="text-base md:text-xl mt-1">
//             Difficulty:{' '}
//             {(Array.isArray(test?.difficulty) ? test?.difficulty : test?.difficulty ? [test.difficulty] : [])
//               .map((d: string) => displayDifficultyLabel(d))
//               .join(' , ')}
//           </p>
//         </div>

//         {/* Questions */}
//         <div className="space-y-6">
//           {test?.questions?.map((q: any, index: number) => {
//             const correctOption = q.answerOptions.find((o: any) => o.is_correct);

//             const difficultyList = Array.isArray(q.difficulty)
//               ? q.difficulty
//               : q.difficulty
//                 ? [q.difficulty]
//                 : [];

//             const topicList = Array.isArray(q.topic)
//               ? q.topic
//               : q.topic
//                 ? [q.topic]
//                 : [];

//             return (
//               <section
//                 key={q.id}
//                 className="rounded-[20px] bg-[#04664f] p-3 md:p-4 shadow-sm"
//               >
//                 <div className="grid grid-cols-1 xl:grid-cols-[64px_minmax(0,1fr)_minmax(0,1fr)] gap-4">
//                   {/* Left number strip */}
//                   <div className="flex xl:flex-col gap-2 xl:gap-3 items-start xl:items-center">
//                     <div className="w-12 h-12 rounded-[12px] bg-[#0b5f4a] text-white font-bold flex items-center justify-center shadow-sm">
//                       {index + 1}
//                     </div>
//                   </div>

//                   {/* Question Card */}
//                   <article className="bg-[#f9f9f5] rounded-[18px] p-4 md:p-6 shadow-sm min-w-0">
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       <MetaBadge
//                         label="Question ID"
//                         value={q.question_id || q.id}
//                         colorClass="bg-[#eef2ff] text-[#01281e]"
//                       />
//                     </div>

//                     {q.question_title && (
//                       <h3 className="text-lg md:text-2xl font-bold text-[#01281e] mb-3">
//                         {q.question_title}
//                       </h3>
//                     )}

//                     <div
//                       className="prose prose-sm md:prose-base max-w-none text-gray-700 mb-5 text-lg md:text-xl"
//                       dangerouslySetInnerHTML={{ __html: q.question_steam }}
//                     />

//                     {/* Options */}
//                     <div className="space-y-3">
//                       {q.answerOptions.map((opt: any, optIndex: number) => {
//                         const isCorrect = opt.is_correct;
//                         const isSelected = opt.id === q.user_selected_option_id;

//                         return (
//                           <div
//                             key={opt.id}
//                             className={`p-3 md:p-4 rounded-[14px] text-base md:text-lg border transition-all
//                               ${
//                                 isCorrect
//                                   ? 'bg-green-100 border-green-400'
//                                   : isSelected
//                                     ? 'bg-red-100 border-red-400'
//                                     : 'bg-gray-50 border-gray-200'
//                               }
//                             `}
//                           >
//                             <div className="flex items-center justify-between gap-3">
//                               <div className="flex items-center gap-3 min-w-0">
//                                 <span className="font-bold shrink-0">
//                                   {String.fromCharCode(65 + optIndex)}.
//                                 </span>
//                                 <span className="break-words">{opt.option_text}</span>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </article>

//                   {/* Explanation Card */}
//                   <aside className="bg-[#f9f9f5] rounded-[18px] p-4 md:p-6 shadow-sm min-w-0">
//                     {/* Topic + Difficulty above explanation */}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {difficultyList.length > 0 && (
//                         <div className="flex flex-wrap items-center gap-2">
//                           <span className="text-xs md:text-sm font-medium text-gray-500 mr-1">
//                             Difficulty:
//                           </span>
//                           {difficultyList.map((diff: string, dIdx: number) => (
//                             <span
//                               key={dIdx}
//                               className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-full shadow-sm"
//                             >
//                               {displayDifficultyLabel(diff)}
//                             </span>
//                           ))}
//                         </div>
//                       )}

//                       {topicList.length > 0 && (
//                         <div className="flex flex-wrap items-center gap-2">
//                           <span className="text-xs md:text-sm font-medium text-gray-500 mr-1">
//                             Topic:
//                           </span>
//                           {topicList.map((top: string, tIdx: number) => (
//                             <span
//                               key={tIdx}
//                               className="text-xs bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded-full shadow-sm"
//                             >
//                               {displayTopicLabel(top)}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>

//                     {/* Explanation */}
//                     <div className="space-y-4">
//                       <div>
//                         <p className="font-bold mb-2 flex items-center gap-2 text-lg md:text-2xl text-[#01281e]">
//                           <ExplainIcon /> Explanation:
//                         </p>
//                         <div
//                           className="text-base md:text-lg leading-relaxed text-gray-700"
//                           dangerouslySetInnerHTML={{ __html: q.explanation }}
//                         />
//                       </div>

//                       {/* Explanation Image */}
//                       {q.explanation_image_url && (
//                         <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
//                           <Image
//                             src={q.explanation_image_url}
//                             alt="Explanation"
//                             width={900}
//                             height={500}
//                             className="w-full h-auto object-contain"
//                             unoptimized
//                           />
//                         </div>
//                       )}

//                       {/* Why Incorrect */}
//                       <div>
//                         <p className="font-bold mb-2 flex items-center gap-2 text-lg md:text-2xl text-[#01281e]">
//                           <CancelIcon /> Why The Other Options Are Incorrect:
//                         </p>
//                         <div className="text-base md:text-lg leading-relaxed text-gray-700">
//                           <BulletContent content={q.why_incorrect} />
//                         </div>
//                       </div>

//                       {/* Pimping Point */}
//                       <div>
//                         <p className="font-bold mb-2 flex items-center gap-2 text-lg md:text-2xl text-[#01281e]">
//                           <PimpingIcon /> Pimping Point:
//                         </p>
//                         <div
//                           className="text-base md:text-lg leading-relaxed text-gray-700"
//                           dangerouslySetInnerHTML={{ __html: q.pimping_point }}
//                         />
//                       </div>

//                       {/* Memory Trick */}
//                       <div>
//                         <p className="font-bold mb-2 flex items-center gap-2 text-lg md:text-2xl text-[#01281e]">
//                           <MemoryIcon /> Memory Trick:
//                         </p>
//                         <div
//                           className="text-base md:text-lg leading-relaxed text-gray-700"
//                           dangerouslySetInnerHTML={{ __html: q.memory_trick }}
//                         />
//                       </div>

//                       {/* References */}
//                       <div>
//                         <p className="font-bold mb-2 flex items-center gap-2 text-lg md:text-2xl text-[#01281e]">
//                           <BookIcon /> References:
//                         </p>
//                         <div className="text-base md:text-lg leading-relaxed text-gray-700">
//                           <BulletContent content={q.referance} />
//                         </div>
//                       </div>
//                     </div>
//                   </aside>
//                 </div>
//               </section>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  useGetTestDetailsQuery,
  useToggleMarkMutation,
} from '@/app/redux/api/testSessionApi';
import { TestReviewSkeleton } from '@/components/preview-test/TestReviewSkeleton';

import QuizTopbar from '@/components/create_test_components/QuizTopbar';
import QuestionSidebar from '@/components/create_test_components/QuestionSidebar';
import QuestionCard from '@/components/create_test_components/QuestionCard';
import ExplanationPanel from '@/components/create_test_components/ExplanationPanel';

import type { MarkedQuestion } from '@/types/markedQuestion';
import type { QuizQuestionDataUI } from '@/types/test-session';

function displayDifficultyLabel(difficulty: string): string {
  if (difficulty === 'Board') return 'Boards';
  return difficulty;
}

function displayTopicLabel(topic: string): string {
  return topic
    .replace(/Recontraction/gi, 'Reconstruction')
    .replace(/_/g, ' / ');
}

function buildExplanation(q: any) {
  return {
    main: q.explanation ?? '',
    image: q.explanation_image_url
      ? q.explanation_image_url
      : q.explanation_image
        ? String(q.explanation_image).startsWith('http')
          ? q.explanation_image
          : `https://backend.tablerounds.ai/public/storage/question/${q.explanation_image}`
        : null,
    whyIncorrect: q.why_incorrect
      ? [{ option: '', text: q.why_incorrect }]
      : [],
    pinningPoint: q.pimping_point ?? '',
    memoryTrick: q.memory_trick ?? '',
    referance: q.referance
      ? Array.isArray(q.referance)
        ? q.referance
        : [q.referance]
      : [],
  };
}

function mapReviewQuestions(test: any): QuizQuestionDataUI[] {
  const questions = test?.questions ?? [];

  return questions.map((q: any, index: number) => {
    const answerOptionsRaw = q.answerOptions ?? [];

    const selectedAnswerId =
      q.user_selected_option_id ??
      q.user_answer_id ??
      q.selected_option_id ??
      q.answer_option_id ??
      null;

    const correctOption = answerOptionsRaw.find((o: any) => o.is_correct);

    const answerOptions = answerOptionsRaw.map((opt: any) => ({
      id: String(opt.id),
      option_text: opt.option_text,
      is_correct: Boolean(opt.is_correct),
      total_select: Number(opt.total_select ?? 0),
      percentage: Number(opt.total_select ?? opt.percentage ?? 0),
    }));

    return {
      testProgress: {
        questionID: String(q.id),
        totalQuestions: test?.total_questions ?? questions.length,
        currentQuestion: index + 1,
      },
      quizDetails: {
        id: String(q.id),
        question_title: q.question_title ?? '',
        question_steam: q.question_steam ?? '',
        question_id: q.question_id ?? '',
        answerOptions,
        correctAnswerId: correctOption?.id ? String(correctOption.id) : null,
        userAnswerId: selectedAnswerId ? String(selectedAnswerId) : null,
        explanation: buildExplanation(q),
        is_marked: Boolean(q.is_marked),
        difficulty: Array.isArray(q.difficulty)
          ? q.difficulty
          : q.difficulty
            ? [q.difficulty]
            : [],
        topic: Array.isArray(q.topic)
          ? q.topic
          : q.topic
            ? [q.topic]
            : [],
      },
    } as QuizQuestionDataUI;
  });
}

export default function TestReviewPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.testId as string | undefined;

  const { data, isLoading, isError } = useGetTestDetailsQuery(testId!, {
    skip: !testId,
  });

  const [toggleMarkApi] = useToggleMarkMutation();

  const [questions, setQuestions] = useState<QuizQuestionDataUI[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);
  const [isQuestionHidden, setIsQuestionHidden] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!data?.data) return;

    const mapped = mapReviewQuestions(data.data);
    setQuestions(mapped);

    const updatedMarked = mapped
      .map((q, idx) => {
        if (!q.quizDetails?.is_marked) return null;

        return {
          index: idx + 1,
          questionId: q.testProgress.questionID,
          title: q.quizDetails.question_title ?? '',
          question: q.quizDetails.question_steam ?? '',
          fullData: q,
        };
      })
      .filter((m): m is MarkedQuestion => m !== null);

    setMarkedQuestions(updatedMarked);
    setCurrentQuestion(1);
    setIsQuestionHidden(false);
  }, [data]);

  const current = questions[currentQuestion - 1] ?? null;
  const totalQuestions = questions.length;

  useEffect(() => {
    setSelectedAnswer(current?.quizDetails?.userAnswerId ?? null);
    setIsQuestionHidden(false);
  }, [currentQuestion, current?.quizDetails?.userAnswerId]);

  const progressValue =
    totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  const onJumpTo = (index: number) => {
    if (index < 1 || index > totalQuestions) return;
    setCurrentQuestion(index);
  };

  const onPrevious = () => {
    if (currentQuestion <= 1) return;
    setCurrentQuestion(prev => prev - 1);
  };

  const onNext = () => {
    if (currentQuestion >= totalQuestions) return;
    setCurrentQuestion(prev => prev + 1);
  };

  const isMarked = markedQuestions.some(q => q.index === currentQuestion);

  const handleToggleMark = async () => {
    if (!current) return;

    const currentMarkedState = isMarked;
    const targetMarkedState = !currentMarkedState;

    const previousQuestions = questions;
    const previousMarkedQuestions = markedQuestions;

    try {
      setQuestions(prev =>
        prev.map((q, idx) =>
          idx === currentQuestion - 1
            ? {
              ...q,
              quizDetails: {
                ...q.quizDetails,
                is_marked: targetMarkedState,
              },
            }
            : q,
        ),
      );

      setMarkedQuestions(prev => {
        const exists = prev.some(q => q.index === currentQuestion);

        if (targetMarkedState) {
          if (exists) return prev;

          return [
            ...prev,
            {
              index: currentQuestion,
              questionId: current.testProgress.questionID,
              title: current.quizDetails.question_title ?? '',
              question: current.quizDetails.question_steam ?? '',
              fullData: current,
            },
          ];
        }

        return prev.filter(q => q.index !== currentQuestion);
      });

      await toggleMarkApi({
        test_id: testId,
        question_id: current.testProgress.questionID,
        is_marked: targetMarkedState,
      }).unwrap();
    } catch (error) {
      console.error('Mark toggle failed', error);
      setQuestions(previousQuestions);
      setMarkedQuestions(previousMarkedQuestions);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.8));
  };

  const handleToggleHide = () => {
    setIsQuestionHidden(prev => !prev);
  };

  const isUserCorrect =
    Boolean(current?.quizDetails?.userAnswerId) &&
    Boolean(current?.quizDetails?.correctAnswerId) &&
    String(current?.quizDetails?.userAnswerId) ===
    String(current?.quizDetails?.correctAnswerId);

  const difficultyList = useMemo(() => {
    const raw = current?.quizDetails?.difficulty ?? [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr
      .filter(Boolean)
      .map((item: string) => displayDifficultyLabel(item));
  }, [current?.quizDetails?.difficulty]);

  const topicList = useMemo(() => {
    const raw = current?.quizDetails?.topic ?? [];
    const arr = Array.isArray(raw) ? raw : [raw];
    return arr.filter(Boolean).map((item: string) => displayTopicLabel(item));
  }, [current?.quizDetails?.topic]);

  if (isLoading) return <TestReviewSkeleton />;

  if (isError) {
    return (
      <div className="p-6">Failed to load test review. Please try again.</div>
    );
  }

  if (!data || !testId || !current) {
    return <div className="p-6">No review data found.</div>;
  }

  return (
    <div className="flex flex-col gap-4 font-[manrope]">
      <QuizTopbar
        quizDetails={current.quizDetails as any}
        onSkip={() => { }}
        progressValue={progressValue}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        questionID={current.testProgress.questionID}
        isMarked={isMarked}
        onToggleMark={handleToggleMark}
        onNext={onNext}
        onPrevious={onPrevious}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        testId={testId}
        isReviewMode
      />

      <div className="background rounded-md grid grid-cols-1 md:grid-cols-12">
        <QuestionSidebar
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          markedQuestions={markedQuestions}
          questions={questions}
          onJumpTo={onJumpTo}
        />

        <div className="col-span-11 mx-4 min-w-0">
          <div className="w-full overflow-auto">
            <div
              className="flex flex-col md:flex-row gap-6 min-w-0 items-start"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease',
              }}
            >
              {!isQuestionHidden && (
                <div className="flex-1 min-w-0 overflow-hidden">
                  <QuestionCard
                    key={current.testProgress.questionID}
                    testId={testId}
                    questionID={current.testProgress.questionID}
                    currentQuestion={currentQuestion}
                    setQuestions={setQuestions}
                    quizDetails={current.quizDetails as any}
                    selectedAnswerId={selectedAnswerId}
                    showExplanation={true}
                    isUserCorrect={isUserCorrect}
                    onAnswerChange={() => { }}
                    onToggleHide={handleToggleHide}
                    isQuestionHidden={isQuestionHidden}
                    hideActions
                  />
                </div>
              )}

              <div className={isQuestionHidden ? 'w-full' : 'flex-1'}>
                <div className="bg-[#f9f9f5] shadow-lg rounded-[16px] border font-[manrope] p-4 md:p-6 mb-4 mt-8">
                  <div className="flex flex-wrap gap-3 items-center">
                    {difficultyList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          Difficulty:
                        </span>
                        {difficultyList.map((diff, idx) => (
                          <span
                            key={idx}
                            className="text-xs md:text-sm bg-blue-100 text-blue-800 font-semibold px-2.5 py-1 rounded-full shadow-sm"
                          >
                            {diff}
                          </span>
                        ))}
                      </div>
                    )}

                    {topicList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">
                          Topic:
                        </span>
                        {topicList.map((top, idx) => (
                          <span
                            key={idx}
                            className="text-xs md:text-sm bg-purple-100 text-purple-800 font-semibold px-2.5 py-1 rounded-full shadow-sm"
                          >
                            {top}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <ExplanationPanel
                  quizDetails={{
                    explanation: current.quizDetails.explanation as any,
                  }}
                  isQuestionHidden={isQuestionHidden}
                  onShowQuestion={handleToggleHide}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}