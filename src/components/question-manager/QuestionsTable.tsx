// 'use client';

// import { useMemo, useState } from 'react';
// import DeleteIcon from '../reusable/icons/DeleteIcon';
// import EditIconAdmin from '../reusable/icons/EditIconAdmin';
// import { Difficulty } from '@/app/redux/api/allQuestionApi';

// export type Question = {
//   id: string;
//   question_id: string;
//   text: string;
//   topic: string[];
//   difficulty: Difficulty;
//   total_attempts: number;
//   correct_percentage: number;
// };

// type Props = {
//   data: Question[];
//   search: string;
//   setSearch: (value: string) => void;
//   onEdit?: (question: Question) => void;
//   onDelete?: (question: Question) => void;

//   page: number;
//   setPage: (page: number) => void;
//   meta?: {
//     totalPage: number;
//     next: number | null;
//     previous: number | null;
//   };
// };

// export default function QuestionsTable({
//   data,
//   page,
//   setPage,
//   meta,
//   search,
//   setSearch,
//   onEdit,
//   onDelete,
// }: Props) {
//   const [sortKey, setSortKey] = useState<'difficulty' | 'id' | null>(null);
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

//   /* ✅ IMPORTANT: remove frontend filtering (backend already handles search) */
//   const sortedData = useMemo(() => {
//    const result = [...data];

//     if (sortKey) {
//       result.sort((a, b) => {
//         const valueA = a[sortKey];
//         const valueB = b[sortKey];

//         if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
//         if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return result;
//   }, [data, sortKey, sortOrder]);

//   const handleSort = (key: 'difficulty' | 'id') => {
//     if (sortKey === key) {
//       setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
//     } else {
//       setSortKey(key);
//       setSortOrder('asc');
//     }
//   };

//   return (
//     <div className="bg-white rounded-[10px] shadow-sm p-5 mt-8">
//       <div className="flex justify-between mb-4">
//         <h3 className="font-semibold text-[20px]">Questions</h3>

//         <input
//           placeholder="Search..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="border rounded-md px-3 py-2 text-sm"
//         />
//       </div>

//       <div className="overflow-x-auto rounded-lg border">
//         <table className="w-full text-sm">
//           <thead className="bg-[#01503b] text-white">
//             <tr>
//               <th
//                 className="px-4 py-3 cursor-pointer"
//                 onClick={() => handleSort('id')}
//               >
//                 Question ID
//               </th>
//               {/* <th className="px-4 py-3">Question Stem</th> */}
//               <th className="px-4 py-3">Topic</th>
//               <th
//                 className="px-4 py-3 cursor-pointer"
//                 onClick={() => handleSort('difficulty')}
//               >
//                 Difficulty
//               </th>
//               <th className="px-4 py-3 text-center">Attempts</th>
//               <th className="px-4 py-3 text-center">% Correct</th>
//               <th className="px-4 py-3 text-center">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {sortedData.map(question => (
//               <tr key={question.id}>
//                 <td className="px-4 py-4 text-center">
//                   {question.question_id}
//                 </td>
//                 {/* <td className="px-4 py-4 text-center">{question.text}</td> */}
//                 <td className="px-4 py-4 text-center">
//                   {question.topic.join(', ')}
//                 </td>
//                 <td className="px-4 py-4 text-center">{question.difficulty}</td>
//                 <td className="px-4 py-4 text-center">
//                   {question.total_attempts}
//                 </td>
//                 <td className="px-4 py-4 text-center">
//                   {question.correct_percentage}
//                 </td>
//                 <td className="px-4 py-4 text-center">
//                   <div className="flex justify-center gap-3">
//                     <button onClick={() => onEdit?.(question)} className="cursor-pointer">
//                       <EditIconAdmin />
//                     </button>
//                     <button onClick={() => onDelete?.(question)}  className="cursor-pointer">
//                       <DeleteIcon />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ✅ PAGINATION */}
//       {meta && (
//         <div className="flex justify-between items-center mt-4">
//           <p className="text-sm text-gray-500">
//             Page {page} of {meta.totalPage}
//           </p>

//           <div className="flex gap-2 flex-wrap">
//             <button
//               disabled={!meta.previous}
//               onClick={() => setPage(page - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
//             >
//               Prev
//             </button>

//             {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(p => (
//               <button
//                 key={p}
//                 onClick={() => setPage(p)}
//                 className={`px-3 py-1 rounded border ${
//                   p === page ? 'bg-[#01503b] text-white cursor-pointer' : 'bg-white text-black cursor-pointer'
//                 }`}
//               >
//                 {p}
//               </button>
//             ))}

//             <button
//               disabled={!meta.next}
//               onClick={() => setPage(page + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useMemo, useState } from 'react';
import DeleteIcon from '../reusable/icons/DeleteIcon';
import EditIconAdmin from '../reusable/icons/EditIconAdmin';
import { Difficulty } from '@/app/redux/api/allQuestionApi';

export type Question = {
  id: string;
  question_id: string;
  text: string;
  topic: string[];
  difficulty: Difficulty;
  total_attempts: number;
  correct_percentage: number;
};

type Props = {
  data: Question[];
  search: string;
  setSearch: (value: string) => void;
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;

  page: number;
  setPage: (page: number) => void;
  meta?: {
    totalPage: number;
    next: number | null;
    previous: number | null;
  };
};

export default function QuestionsTable({
  data,
  page,
  setPage,
  meta,
  search,
  setSearch,
  onEdit,
  onDelete,
}: Props) {
  const [sortKey, setSortKey] = useState<'difficulty' | 'id' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  /* ✅ IMPORTANT: remove frontend filtering (backend already handles search) */
  const sortedData = useMemo(() => {
    const result = [...data];

    if (sortKey) {
      result.sort((a, b) => {
        const valueA = a[sortKey];
        const valueB = b[sortKey];

        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, sortKey, sortOrder]);

  const handleSort = (key: 'difficulty' | 'id') => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const displayDifficulty = (difficulty: string) => {
    if (difficulty === 'Board') return 'Boards';
    return difficulty;
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm p-5 mt-8">
      <div className="flex justify-between mb-4">
        <h3 className="font-semibold text-[20px]">Questions</h3>

        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-[#01503b] text-white">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort('id')}
              >
                Question ID
              </th>
              {/* <th className="px-4 py-3">Question Stem</th> */}
              <th className="px-4 py-3">Topic</th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort('difficulty')}
              >
                Difficulty
              </th>
              <th className="px-4 py-3 text-center">Attempts</th>
              <th className="px-4 py-3 text-center">% Correct</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map(question => (
              <tr key={question.id}>
                <td className="px-4 py-4 text-center">
                  {question.question_id}
                </td>
                {/* <td className="px-4 py-4 text-center">{question.text}</td> */}
                <td className="px-4 py-4 text-center">
                  {question.topic.join(', ')}
                </td>
                <td className="px-4 py-4 text-center">
                  {displayDifficulty(question.difficulty)}
                </td>
                <td className="px-4 py-4 text-center">
                  {question.total_attempts}
                </td>
                <td className="px-4 py-4 text-center">
                  {question.correct_percentage}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit?.(question)}
                      className="cursor-pointer"
                    >
                      <EditIconAdmin />
                    </button>
                    <button
                      onClick={() => onDelete?.(question)}
                      className="cursor-pointer"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ PAGINATION */}
      {meta && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            Page {page} of {meta.totalPage}
          </p>

          <div className="flex gap-2 flex-wrap">
            <button
              disabled={!meta.previous}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Prev
            </button>

            {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded border ${
                  p === page
                    ? 'bg-[#01503b] text-white cursor-pointer'
                    : 'bg-white text-black cursor-pointer'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={!meta.next}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}