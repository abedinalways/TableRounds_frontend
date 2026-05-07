// 'use client';

// import { Card, CardContent } from '@/components/ui/card';
// import { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
// import CompleteIcon from '../reusable/icons/CompleteIcon';
// import ShareIconBlack from '../reusable/icons/ShareIconBlack';
// import { ShareModal } from './ShareModal';
// import { useDiscoverProfilesQuery } from '@/app/redux/api/discoverApi';
// import {
//   useCreateConversationMutation,
//   useSendMessageMutation,
// } from '@/app/redux/api/chat/chatApi';
// import { toast } from 'sonner';
// import { useRouter } from 'next/navigation';

// interface ResultSummaryProps {
//   score: number;
//   total: number;
//   correct: number;
//   incorrect: number;
//   used: number;
//   unused: number;
// }

// export interface Colleague {
//   id: string;
//   name: string;
//   avatar?: string;
//   training_practice?: string;
// }

// export interface TestCardData {
//   questions: number;
//   correctPercentage: number;
//   time: string;
//   percentile: number;
//   difficulty: string;
//   category: string;
// }

// export function ResultSummary({
//   score,
//   total,
//   correct,
//   incorrect,
//   used,
//   unused,
// }: ResultSummaryProps) {
//   const scoreRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState('');

//   const { data, isLoading } = useDiscoverProfilesQuery(
//     { page: 1, limit: 20, search },
//     { skip: !open },
//   );

//   const colleagues = data?.data ?? [];

//   const [createConversation] = useCreateConversationMutation();
//   const [sendMessage] = useSendMessageMutation();

//   const [testCardData, setTestCardData] = useState<TestCardData | null>(null);

//   useEffect(() => {
//     gsap.fromTo(
//       scoreRef.current,
//       { innerText: 0 },
//       {
//         innerText: score,
//         duration: 1.2,
//         ease: 'power2.out',
//         snap: { innerText: 1 },
//       },
//     );
//   }, [score]);

//   const handleShare = () => {
//     setOpen(true);

//     setTestCardData({
//       questions: total,
//       correctPercentage: Math.round((correct / total) * 100),
//       time: '—',
//       percentile: score,
//       difficulty: '—',
//       category: '—',
//     });
//   };

//   const handleSendTestCard = async (user: Colleague, card: TestCardData) => {
//     try {
//       const res = await createConversation({
//         participant_id: user.id,
//       }).unwrap();

//       const conversationId = res.data.id;

//       await sendMessage({
//         conversationId,
//         receiverId: user.id,
//         message: `📊 Test Result

// Score: ${card.percentile}
// Correct: ${correct}
// Incorrect: ${incorrect}
// Questions: ${total}

// `,
//       }).unwrap();

//       toast.success(`Result sent to ${user.name}`);

//       setOpen(false);

//       router.push(`/dashboard/user/messages/${conversationId}`);
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to send result');
//     }
//   };

//   return (
//     <>
//       <Card className="background text-white font-[manrope]">
//         <CardContent className="py-10 text-center space-y-4">
//           <div className="flex justify-end gap-3">
//             <button className="bg-[#b79e6b] text-white px-6 py-2 rounded-xl">
//               Review Test
//             </button>

//             <button
//               onClick={handleShare}
//               className="bg-white text-[#01281e] px-6 py-2 rounded-xl flex items-center gap-2"
//             >
//               Share
//               <ShareIconBlack />
//             </button>
//           </div>

//           <div className="flex justify-center items-center">
//             <CompleteIcon />
//           </div>

//           <h2 className="text-xl md:text-[36px] font-bold">Test Complete!</h2>

//           <div className="complete-card-bg w-fit py-4 px-8 rounded-[12px] mx-auto">
//             <span ref={scoreRef} className="text-4xl font-bold">
//               {correct}
//             </span>
//             <span className="text-4xl font-bold">/100</span>
//             <p className="text-sm opacity-90">Your Score</p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//             <Stat label="Correct" value={correct} />
//             <Stat label="Incorrect" value={incorrect} />
//             <Stat label="Used" value={used} />
//             <Stat label="Unused" value={unused} />
//           </div>
//         </CardContent>
//       </Card>

//       <ShareModal
//         open={open}
//         onClose={() => setOpen(false)}
//         loading={isLoading}
//         colleagues={colleagues}
//         testCardData={testCardData}
//         onSendTestCard={handleSendTestCard}
//       />
//     </>
//   );
// }

// function Stat({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="complete-card-bg px-8 py-4 rounded-[12px]">
//       <p className="font-semibold">{value}</p>
//       <p className="text-xs opacity-80">{label}</p>
//     </div>
//   );
// }

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CompleteIcon from '../reusable/icons/CompleteIcon';
import ShareIconBlack from '../reusable/icons/ShareIconBlack';
import { ShareModal } from './ShareModal';
import { useDiscoverProfilesQuery } from '@/app/redux/api/discoverApi';
import {
  useCreateConversationMutation,
  useSendMessageMutation,
} from '@/app/redux/api/chat/chatApi';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ResultSummaryProps {
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  used: number;
  unused: number;
  difficulty: string;
  testId: string;
  topics: string[];
}

export interface Colleague {
  id: string;
  name: string;
  avatar?: string;
  training_practice?: string;
}

export interface TestCardData {
  questions: number;
  correctPercentage: number;
  time: string;
  percentile: number;
  difficulty: string;
  category: string;
}

export function ResultSummary({
  score,
  total,
  correct,
  incorrect,
  used,
  unused,
  difficulty,
  testId,
  topics
}: ResultSummaryProps) {
  const scoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
 
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useDiscoverProfilesQuery(
    { page: 1, limit: 20, search },
    { skip: !open },
  );

  const colleagues = data?.data ?? [];
  const topic = topics.map((t: any) => t.topic).join(' , ');
  const [createConversation] = useCreateConversationMutation();
  const [sendMessage] = useSendMessageMutation();

  const [testCardData, setTestCardData] = useState<TestCardData | null>(null);
  // console.log(testCardData, 'card data======================')

  useEffect(() => {
    gsap.fromTo(
      scoreRef.current,
      { innerText: 0 },
      {
        innerText: score,
        duration: 1.2,
        ease: 'power2.out',
        snap: { innerText: 1 },
      },
    );
  }, [score]);

  const handleShare = () => {
    setOpen(true);

    setTestCardData({
      questions: total,
      correctPercentage: Math.round((correct / total) * 100),
      time: '5 minutes',
      percentile: score,
      difficulty: difficulty,
      category: topic,
    });
  };

  const handleSendTestCard = async (user: Colleague, card: TestCardData) => {
    try {
      const res = await createConversation({
        participant_id: user.id,
      }).unwrap();

      const conversationId = res.data.id;

      await sendMessage({
        conversationId,
        receiverId: user.id,
        message: JSON.stringify({
          type: 'test_result',
          data: {
            questions: card.questions,
            difficulty: card.difficulty,
            topic: card.category,
            percent: card.correctPercentage,
            percentile: card.percentile,
            time: card?.time,
          },
        }),
      }).unwrap();

      toast.success(`Result sent to ${user.name}`);

      setOpen(false);

      window.location.href=`/dashboard/user/messages/${conversationId}`;
    } catch (error) {
      console.error(error);
      toast.error('Failed to send result');
    }
  };

  return (
    <>
      <Card className="background text-white font-[manrope]">
        <CardContent className="py-10 text-center space-y-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                router.push(`/dashboard/user/test-review/${testId}`)
              }
              className="bg-[#b79e6b] text-white cursor-pointer px-6 py-2 md:px-12 md:py-5 rounded-md"
            >
              Review Test
            </button>

            {/* <button
              onClick={handleShare}
              className="bg-white text-[#01281e] cursor-pointer px-6 py-2 rounded-md flex items-center gap-2"
            >
              Share
              <ShareIconBlack />
            </button> */}
          </div>

          <div className="flex justify-center items-center">
            <CompleteIcon />
          </div>

          <h2 className="text-xl md:text-[36px] font-bold">Test Complete!</h2>

          <div className="complete-card-bg w-fit py-4 px-8 rounded-[12px] mx-auto">
            <span ref={scoreRef} className="text-4xl font-bold">
              {correct}
            </span>
            <span className="text-4xl font-bold">/100</span>
            <p className="text-sm opacity-90">Your Score</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Stat label="Correct" value={correct} />
            <Stat label="Incorrect" value={incorrect} />
            <Stat label="Used" value={used} />
            <Stat label="Unused" value={unused} />
          </div>
        </CardContent>
      </Card>

      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        loading={isLoading}
        colleagues={colleagues}
        testCardData={testCardData}
        onSendTestCard={handleSendTestCard}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="complete-card-bg px-8 py-4 rounded-[12px]">
      <p className="font-semibold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}