// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Badge } from '@/components/ui/badge';
// import { TableCell, TableRow } from '@/components/ui/table';
// import { CircularProgressPercentage } from '../CircularProgressPercentage';
// import { useGetTestQuestionsByTestIdQuery } from '@/app/redux/api/testDataApi';

// interface Props {
//   testId: string;
// }

// export function IncompleteTestRow({ testId }: Props) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const router = useRouter();

//   const { data, isLoading, isError } = useGetTestQuestionsByTestIdQuery(testId);

//   if (isLoading) {
//     return (
//       <TableRow>
//         <TableCell colSpan={7} className="py-4 text-center text-gray-400">
//           Loading...
//         </TableCell>
//       </TableRow>
//     );
//   }

//   if (isError || !data?.data) {
//     return (
//       <TableRow>
//         <TableCell colSpan={7} className="py-4 text-center text-red-400">
//           Failed to load test details
//         </TableCell>
//       </TableRow>
//     );
//   }

//   const test = data.data;

//   return (
//     <TableRow>
//       <TableCell>
//         <CircularProgressPercentage
//           showLabel
//           value={test?.score ?? 0}
//           className="text-[10px]! font-normal"
//         />
//       </TableCell>

//       <TableCell>
//         <div className="flex space-x-2">
//           {(test.difficulty ?? []).map((level, index) => {
//             let badgeClass = '';
//             switch (level) {
//               case 'Intern':
//                 badgeClass = 'bg-[#fde1dc] text-red-400';
//                 break;
//               case 'Senior':
//                 badgeClass = 'bg-[#f0e1dc] text-[#b79e6b]';
//                 break;
//               case 'Boards':
//               case 'Board':
//                 badgeClass = 'bg-[#cdebe3] text-[#01503b]';
//                 break;
//               default:
//                 badgeClass = 'bg-[#e1e1e1] text-gray-500';
//                 break;
//             }

//             return (
//               <Badge
//                 key={index}
//                 className={`px-2 rounded-[4px] py-2 ${badgeClass}`}
//               >
//                 {level}
//               </Badge>
//             );
//           })}
//         </div>
//       </TableCell>

//       <TableCell>{new Date(test.created_at).toLocaleDateString()}</TableCell>

//       <TableCell className="space-x-2">
//         {test.test_mode.map(mode => (
//           <Badge
//             key={mode}
//             className="bg-[#cdebe3] text-[#01503b] rounded-[4px] px-2 py-2"
//           >
//             {mode}
//           </Badge>
//         ))}
//       </TableCell>

//       <TableCell>
//         <Badge className="bg-[#cdebe3] text-[#01503b] rounded-[4px] px-2 py-2">
//           {test.topic.length === 1 ? 'Single' : 'Multiple'}
//         </Badge>
//       </TableCell>

//       <TableCell>{test.total_questions}</TableCell>

//       <TableCell className="text-right relative">
//         <span
//           onClick={() => setDropdownOpen(prev => !prev)}
//           className="cursor-pointer text-lg"
//         >
//           •••
//         </span>

//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border z-20">
//             <button
//               className="block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() =>
//                 router.push(`/dashboard/user/test-review/${test.id}`)
//               }
//             >
//               Review
//             </button>

//             <button
//               className="block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() =>
//                 router.push(`/dashboard/user/create-test/${test.id}`)
//               }
//             >
//               Retake
//             </button>
//           </div>
//         )}
//       </TableCell>
//     </TableRow>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { IncompleteTestItem } from '@/app/redux/api/incompleteTestApi';

interface Props {
  test: IncompleteTestItem;
  index: number;
  page: number;
}

export function IncompleteTestRow({ test, index, page }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const PAGE_LIMIT = 10;
  const serial = (page - 1) * PAGE_LIMIT + index + 1;
  return (
    <TableRow>
      {/* number */}
      <TableCell>
        <span className="font-medium">{serial}</span>
      </TableCell>

      {/* Difficulty */}
      <TableCell>
        <div className="flex space-x-2">
          {(test.difficulty ?? []).map((level, index) => {
            let badgeClass = '';

            switch (level) {
              case 'Intern':
                badgeClass = 'bg-[#fde1dc] text-red-400';
                break;
              case 'Senior':
                badgeClass = 'bg-[#f0e1dc] text-[#b79e6b]';
                break;
              case 'Boards':
              case 'Board':
                badgeClass = 'bg-[#cdebe3] text-[#01503b]';
                break;
              default:
                badgeClass = 'bg-[#e1e1e1] text-gray-500';
                break;
            }

            return (
              <Badge
                key={index}
                className={`px-2 rounded-[4px] py-2 ${badgeClass}`}
              >
                {level}
              </Badge>
            );
          })}
        </div>
      </TableCell>

      {/* Date */}
      <TableCell>{new Date(test.created_at).toLocaleDateString()}</TableCell>

      {/* Test Mode */}
      <TableCell className="space-x-2">
        {test.test_mode.map(mode => (
          <Badge
            key={mode}
            className="bg-[#cdebe3] text-[#01503b] rounded-[4px] px-2 py-2"
          >
            {mode}
          </Badge>
        ))}
      </TableCell>

      {/* Topic */}
      <TableCell>
        <Badge className="bg-[#cdebe3] text-[#01503b] rounded-[4px] px-2 py-2">
          {test.topic.length === 1 ? 'Single' : 'Multiple'}
        </Badge>
      </TableCell>

      {/* Total Questions */}
      <TableCell>{test.total_questions}</TableCell>

      {/* Action */}
      <TableCell className="text-right relative">
        <span
          onClick={() => setDropdownOpen(prev => !prev)}
          className="cursor-pointer text-lg"
        >
          •••
        </span>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border z-20">
            <button
              className="block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/user/test-review/${test.id}`)
              }
            >
              Review
            </button>

            <button
              className="block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/user/create-test/${test.id}`)
              }
            >
              Retake
            </button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}