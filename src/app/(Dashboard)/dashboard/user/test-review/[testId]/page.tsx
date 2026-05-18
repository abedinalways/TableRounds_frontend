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

// export default function TestReviewPage() {
//   const { testId } = useParams();

//   const router = useRouter();
//   const { data, isLoading } = useGetTestDetailsQuery(testId);
//   // console.log(data, '+++++++++++++++++++++++')
//   if (isLoading) {
//     return <TestReviewSkeleton/>;
//   }

//   const test = data?.data;
//   const diff=test?.difficulty.join(" , ")
//   return (
//     <div className="p-6 space-y-6  font-[manrope]">
//       <div className="flex justify-between items-center">
//         <h2 className="text-5xl font-bold">Test Review</h2>
//         <button
//           onClick={() => router.back()}
//           className="px-6 py-2 percentage-bg text-white rounded-md cursor-pointer"
//         >
//           Go Back
//         </button>
//       </div>
//       {/* Header */}
//       <div className="percentage-bg text-white p-4 flex text-3xl flex-col justify-center items-center rounded-xl">
//         <p>Score: {test?.score}%</p>
//         <p>Total Questions: {test?.total_questions}</p>
//         <p>Difficulty: {diff}</p>
//       </div>

//       {/* Questions */}
//       <div className="space-y-6">
//         {test?.questions?.map((q: any, index: number) => {
//           const correctOption = q.answerOptions.find((o: any) => o.is_correct);

//           return (
//             <div
//               key={q.id}
//               className="border rounded-xl p-4 bg-white shadow-sm"
//             >
//               {/* Question */}
//               <h3 className="font-semibold mb-2">
//                 Q{index + 1}. {q.question_title}
//               </h3>

//               <p
//                 className="text-sm text-gray-600 mb-3"
//                 dangerouslySetInnerHTML={{ __html: q.question_steam }}
//               />

//               {/* Options */}
//               <div className="space-y-2">
//                 {q.answerOptions.map((opt: any) => {
//                   const isCorrect = opt.is_correct;
//                   const isSelected = opt.id === q.user_selected_option_id;

//                   return (
//                     <div
//                       key={opt.id}
//                       className={`p-2 rounded-md text-sm border
//                         ${
//                           isCorrect
//                             ? 'bg-green-100 border-green-400'
//                             : isSelected
//                               ? 'bg-red-100 border-red-400'
//                               : 'bg-gray-50'
//                         }
//                       `}
//                     >
//                       {opt.option_text}
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Explanation */}
//               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
//                 <p className="font-bold mb-1 flex items-center gap-2">
//                   <ExplainIcon /> Explanation:
//                 </p>

//                 <div dangerouslySetInnerHTML={{ __html: q.explanation }} />

//                 {/* Image */}
//                 {q.explanation_image_url && (
//                   <img
//                     src={q.explanation_image_url}
//                     className="mt-2 rounded-lg max-h-[200px]"
//                   />
//                 )}
//               </div>

//               {/* Why Incorrect */}
//               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
//                 <p className="font-bold mb-1 flex items-center gap-2">
//                   <CancelIcon /> Why The Other Option Are Incorrect:
//                 </p>

//                 <div dangerouslySetInnerHTML={{ __html: q.why_incorrect }} />
//               </div>

//               {/* pimping point*/}
//               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
//                 <p className="font-bold mb-1 flex items-center gap-2">
//                   <PimpingIcon /> Pimping Point:
//                 </p>

//                 <div dangerouslySetInnerHTML={{ __html: q.pimping_point }} />
//               </div>
//               {/* Memory trick */}
//               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
//                 <p className="font-bold mb-1 flex items-center gap-2">
//                   <MemoryIcon /> Memory Trick:
//                 </p>

//                 <div dangerouslySetInnerHTML={{ __html: q.memory_trick }} />
//               </div>

//               {/* pimping point*/}
//               {/* <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
//                 <p className="font-semibold mb-1">Pimping Point:</p>

//                 <div dangerouslySetInnerHTML={{ __html: q.pimping_point }} />
//               </div> */}
//               {/* reference */}
//               <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
//                 <p className="font-bold mb-1 flex items-center gap-2">
//                   <BookIcon /> References:
//                 </p>

//                 <div dangerouslySetInnerHTML={{ __html: q.referance }} />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetTestDetailsQuery } from '@/app/redux/api/testSessionApi';
import { TestReviewSkeleton } from '@/components/preview-test/TestReviewSkeleton';
import ExplainIcon from '@/components/reusable/icons/ExplainIcon';
import CancelIcon from '@/components/reusable/icons/CancelIcon';
import PimpingIcon from '@/components/reusable/icons/PimpingIcon';
import MemoryIcon from '@/components/reusable/icons/MemoryIcon';
import BookIcon from '@/components/reusable/icons/BookIcon';
import Image from 'next/image';

function getBulletItems(content?: string | null) {
  if (!content) return [];

  return content
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '')
    .replace(/<\/?ul[^>]*>/gi, '')
    .replace(/<\/li>\s*<li[^>]*>/gi, '\n')
    .replace(/<\/?li[^>]*>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .split(/\n+/)
    .map(item => item.replace(/^[\s•*-]+/, '').trim())
    .filter(Boolean);
}

function BulletContent({ content }: { content?: string | null }) {
  const items = getBulletItems(content);

  if (!items.length) return null;

  return (
    <ul className="list-disc pl-6 space-y-1">
      {items.map((item, index) => (
        <li
          key={index}
          className="pl-1"
          dangerouslySetInnerHTML={{ __html: item }}
        />
      ))}
    </ul>
  );
}

export default function TestReviewPage() {
  const { testId } = useParams();

  const router = useRouter();
  const { data, isLoading } = useGetTestDetailsQuery(testId);
  // console.log(data, '+++++++++++++++++++++++')
  if (isLoading) {
    return <TestReviewSkeleton />;
  }

  const test = data?.data;
  const diff = test?.difficulty.join(' , ');
  return (
    <div className="p-6 space-y-6  font-[manrope]">
      <div className="flex justify-between items-center">
        <h2 className="text-5xl font-bold">Test Review</h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 percentage-bg text-white rounded-md cursor-pointer"
        >
          Go Back
        </button>
      </div>
      {/* Header */}
      <div className="percentage-bg text-white p-4 flex text-3xl flex-col justify-center items-center rounded-xl">
        <p>Score: {test?.score}%</p>
        <p>Total Questions: {test?.total_questions}</p>
        <p>Difficulty: {diff}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {test?.questions?.map((q: any, index: number) => {
          const correctOption = q.answerOptions.find((o: any) => o.is_correct);

          return (
            <div
              key={q.id}
              className="border rounded-xl p-4 bg-white shadow-sm "
            >
              {/* Question */}
              <h3 className="font-semibold mb-2">
                Q{index + 1}. {q.question_title}
              </h3>

              <p
                className="text-lg text-gray-600 mb-3"
                dangerouslySetInnerHTML={{ __html: q.question_steam }}
              />

              {/* Options */}
              <div className="space-y-2">
                {q.answerOptions.map((opt: any) => {
                  const isCorrect = opt.is_correct;
                  const isSelected = opt.id === q.user_selected_option_id;

                  return (
                    <div
                      key={opt.id}
                      className={`p-2 rounded-md text-md border
                        ${
                          isCorrect
                            ? 'bg-green-100 border-green-400'
                            : isSelected
                              ? 'bg-red-100 border-red-400'
                              : 'bg-gray-50'
                        }
                      `}
                    >
                      {opt.option_text}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
                <p className="font-bold mb-1 flex items-center gap-2 text-xl">
                  <ExplainIcon /> Explanation:
                </p>

                <div dangerouslySetInnerHTML={{ __html: q.explanation }} />
              </div>

              {/* Why Incorrect */}
              <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
                <p className="font-bold mb-1 flex items-center gap-2 text-xl">
                  <CancelIcon /> Why The Other Option Are Incorrect:
                </p>

                <BulletContent content={q.why_incorrect} />
              </div>

              {/* pimping point*/}
              <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
                <p className="font-bold mb-1 flex items-center gap-2 text-xl">
                  <PimpingIcon /> Pimping Point:
                </p>

                <div dangerouslySetInnerHTML={{ __html: q.pimping_point }} />
              </div>
              {/* Memory trick */}
              <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
                <p className="font-bold mb-1 flex items-center gap-2 text-xl">
                  <MemoryIcon /> Memory Trick:
                </p>

                <div dangerouslySetInnerHTML={{ __html: q.memory_trick }} />
              </div>

              {/* pimping point*/}
              {/* <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
                <p className="font-semibold mb-1">Pimping Point:</p>

                <div dangerouslySetInnerHTML={{ __html: q.pimping_point }} />
              </div> */}
              {/* reference */}
              <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-lg">
                <p className="font-bold mb-1 flex items-center gap-2 text-xl">
                  <BookIcon /> References:
                </p>

                <BulletContent content={q.referance} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}