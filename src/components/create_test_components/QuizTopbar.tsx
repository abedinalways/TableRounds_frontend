// import React from 'react';
// import { Progress } from '@/components/ui/progress';
// import { ArrowRight, SkipForward} from 'lucide-react';
// import { TopbarCheckbox } from '../topbarCheckbox';

// import Flag from '../reusable/icons/Flag';
// import ChatBubble from '../reusable/icons/ChatBubble';
// import ZoomInIcon from '../reusable/icons/ZoomInIcon';
// import ZoomOutIcon from '../reusable/icons/ZoomOutIcon';
// import PauseIcon from '../reusable/icons/PauseIcon';
// import { cn } from '@/lib/utils';
// import { useRouter } from 'next/navigation';
// import { useCreateAdminConversationMutation } from '@/app/redux/api/chat/chatApi';
// import { useAppSelector } from '@/app/redux/hook';

// interface QuizTopbarProps {
//   progressValue: number;
//   currentQuestion: number;
//   totalQuestions: number;
//   questionID: string;
//   isMarked: boolean;
//   testId: string;
//   onToggleMark: () => void;
//   onNext: () => void;
//   onPrevious: () => void;
//   onZoomIn: () => void;
//   onZoomOut: () => void;
//   onSkip: () => void;
// }

// const QuizTopbar: React.FC<QuizTopbarProps> = ({
//   progressValue,
//   currentQuestion,
//   totalQuestions,
//   questionID,
//   isMarked,
//   onToggleMark,
//   onNext,
//   onPrevious,
//   onZoomIn,
//   testId,
//   onZoomOut,
//   onSkip,
// }) => {
//   const [createAdminConversation] = useCreateAdminConversationMutation();
//   const currentUser = useAppSelector(state => state.auth.user);
//   console.log('USER FROM REDUX:', currentUser);
//   const router = useRouter();
//   const handleFeedback = async () => {
//      console.log('CLICKED');
//     if (!currentUser) {
//       console.log('NO USER');
//       return;
//     }

//     try {
//       const res = await createAdminConversation({
//         id: null,
//       }).unwrap();

//       const conversationId = res.data.id;
//       console.log('conversationId================lllllllllllllllll', conversationId);
//       router.push(`/dashboard/user/messages/${conversationId}`);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="md:flex items-center md:justify-between gap-4 rounded-[12px] xl:text-[18px] md:text-sm text-xs border question-bg py-4">
//       <div className="md:flex items-center space-y-2">
//         <div className="md:px-2 px-1 flex flex-col   justify-between ">
//           <Progress value={progressValue} className="md:h-5 h-2 bg-white/60" />
//           <div></div>
//         </div>

//         <div className="space-x-5 flex items-center gap-6  mx-5 md:mx-0">
//           <div className="text-sm md:text-[18px] text-white font-bold flex items-center ">
//             {String(currentQuestion).padStart(2, '0')} / {totalQuestions}
//           </div>
//           <div className="md:text-[14px] flex justify-center text-xs text-white">
//             {/* Question ID: <span className='text-[10px] text-yellow-500'>{questionID}</span> */}
//           </div>
//         </div>

//         <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-3 xl:gap-3 md:text-[14px] text-xs">
//           <div>
//             <span className="flex items-center gap-2">
//               <button
//                 onClick={onToggleMark}
//                 className="text-white cursor-pointer p-2 gap-2 flex flex-col"
//               >
//                 <TopbarCheckbox
//                   checked={isMarked}
//                   className="md:size-6 size-4"
//                 />
//               </button>

//               <Flag
//                 className={cn(
//                   'size-4 md:size-8',
//                   'cursor-pointer text-yellow-400',
//                 )}
//                 onClick={() =>
//                   router.push(`/dashboard/user/create-test/mark/${testId}`)
//                 }
//               />
//             </span>
//             <div className="text-white flex items-center justify-center">
//               Mark
//             </div>
//           </div>

//           <button
//             className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
//             onClick={handleFeedback}
//           >
//             <ChatBubble className="md:size-8 size-4" /> Feedback
//           </button>

//           <button
//             onClick={onZoomIn}
//             className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
//           >
//             <ZoomInIcon className="md:size-8 size-4" />
//             Zoom In
//           </button>

//           <button
//             onClick={onZoomOut}
//             className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
//           >
//             <ZoomOutIcon className="md:size-8 size-4" />
//             Zoom Out
//           </button>

//           <button
//             onClick={onSkip}
//             className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
//           >
//             <SkipForward className="md:size-8 size-4" />
//             Skip Test
//           </button>
//         </div>
//       </div>

//       <div className="flex gap-3 mx-2">
//         <button
//           onClick={onPrevious}
//           disabled={currentQuestion === 1}
//           className={cn(
//             'bg-[#b79e6b] text-white cursor-pointer rounded-md text-center text-[16px] px-3 py-3',
//             currentQuestion === 1 && 'opacity-50 cursor-not-allowed',
//           )}
//         >
//           <span className="flex items-center">Previous</span>
//         </button>

//         <button
//           onClick={onNext}
//           className="bg-[#b79e6b] cursor-pointer text-white rounded-md  text-center text-[16px] px-3 py-3"
//         >
//           <span className="flex items-center">
//             Next <ArrowRight size="18px" />
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuizTopbar;

'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Mail, SkipForward } from 'lucide-react';
import { TopbarCheckbox } from '../topbarCheckbox';

import Flag from '../reusable/icons/Flag';
import ChatBubble from '../reusable/icons/ChatBubble';
import ZoomInIcon from '../reusable/icons/ZoomInIcon';
import ZoomOutIcon from '../reusable/icons/ZoomOutIcon';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCreateAdminConversationMutation } from '@/app/redux/api/chat/chatApi';
import { useAppSelector, useAppDispatch } from '@/app/redux/hook';
import { addAdminConversationId } from '@/app/redux/api/chat/chatSlice';

interface QuizTopbarProps {
  progressValue: number;
  currentQuestion: number;
  totalQuestions: number;
  questionID: string;
  isMarked: boolean;
  testId: string;
  onToggleMark: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSkip: () => void;
}

const QuizTopbar: React.FC<QuizTopbarProps> = ({
  progressValue,
  currentQuestion,
  totalQuestions,
  questionID,
  isMarked,
  onToggleMark,
  onNext,
  onPrevious,
  onZoomIn,
  testId,
  onZoomOut,
  onSkip,
}) => {
  const [createAdminConversation, { isLoading: isStartingChat }] =
    useCreateAdminConversationMutation();
  const currentUser = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // const handleFeedback = async () => {
  //   if (!currentUser || isStartingChat) return;

  //   try {
  //     const res = await createAdminConversation({ participant_id: null }).unwrap();
  //     const conversationId = res.data.id;

      
  //     dispatch(addAdminConversationId(conversationId));

  //     router.push(`/dashboard/user/messages/${conversationId}`);
  //   } catch (err) {
  //     console.error('Failed to open feedback chat:', err);
  //   }
  // };



  return (
    <div className="md:flex items-center md:justify-between gap-4 rounded-[12px] xl:text-[18px] md:text-sm text-xs border question-bg py-4">
      <div className="md:flex items-center space-y-2">
        <div className="md:px-2 px-1 flex flex-col justify-between">
          <Progress value={progressValue} className="md:h-5 h-2 bg-white/60" />
          <div></div>
        </div>

        <div className="space-x-5 flex items-center gap-6 mx-5">
          <div className="text-sm md:text-[18px] text-white font-bold flex items-center">
            {String(currentQuestion).padStart(2, '0')} / {totalQuestions}
          </div>
          <div className="md:text-[14px] flex justify-center text-xs text-white"></div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-3 xl:gap-3 md:text-[14px] text-xs">
          <div>
            <span className="flex items-center gap-2">
              <button
                onClick={onToggleMark}
                className="text-white cursor-pointer p-2 gap-2 flex flex-col"
              >
                <TopbarCheckbox
                  checked={isMarked}
                  className="md:size-6 size-4"
                />
              </button>

              <Flag
                className={cn(
                  'size-4 md:size-8',
                  'cursor-pointer text-yellow-400',
                )}
                onClick={() =>
                  router.push(`/dashboard/user/create-test/mark/${testId}`)
                }
              />
            </span>
            <div className="text-white flex items-center justify-center">
              Mark
            </div>
          </div>

          {/* ✅ Disabled + opacity while creating the conversation */}
          {/* <button
            className={cn(
              'text-white cursor-pointer p-2 gap-2 flex flex-col items-center',
              isStartingChat && 'opacity-50 cursor-not-allowed',
            )}
            onClick={handleFeedback}
            disabled={isStartingChat}
          >
            <ChatBubble className="md:size-8 size-4" />
            {isStartingChat ? 'Opening...' : 'Feedback'}
          </button> */}
          <button className='flex items-center justify-center p-4'>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@tablerounds.ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send email via Gmail"
              className="group  text-sm font-medium text-gray-600 hover:text-[#1e5a4f] transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center my-8">
                <ChatBubble className="md:size-8 size-4 flex items-center justify-center mt-1" />
                <span className="text-white cursor-pointer flex flex-col items-center mt-1">
                  Feedback
                </span>
              </div>
            </a>
          </button>
          <button
            onClick={onZoomIn}
            className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
          >
            <ZoomInIcon className="md:size-8 size-4" />
            Zoom In
          </button>

          <button
            onClick={onZoomOut}
            className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
          >
            <ZoomOutIcon className="md:size-8 size-4" />
            Zoom Out
          </button>

          {/* <button
            onClick={onSkip}
            className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
          >
            <SkipForward className="md:size-8 size-4" />
            Skip Test
          </button> */}
        </div>
      </div>

      <div className="flex gap-3 mx-2">
        <button
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          className={cn(
            'bg-[#b79e6b] text-white cursor-pointer rounded-md text-center text-[16px] px-3 py-3',
            currentQuestion === 1 && 'opacity-50 cursor-not-allowed',
          )}
        >
          <span className="flex items-center">Previous</span>
        </button>

        <button
          onClick={onNext}
          className="bg-[#b79e6b] cursor-pointer text-white rounded-md text-center text-[16px] px-3 py-3"
        >
          <span className="flex items-center">
            Next <ArrowRight size="18px" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuizTopbar;