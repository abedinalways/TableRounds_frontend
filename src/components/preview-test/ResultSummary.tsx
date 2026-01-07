'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CompleteIcon from '../reusable/icons/CompleteIcon';
import { Button } from '../ui/button';
import { ShareModal } from './ShareModal';
import ShareIcon from '../reusable/icons/ShareIcon';
import ShareIconBlack from '../reusable/icons/ShareIconBlack';
import TestCard from '../message/TestCard'; // Import the TestCard component
import Link from 'next/link';

// Define the type for the ResultSummary props
interface ResultSummaryProps {
  score: number;
  total: number;
  correct: number;
  incorrect: number;
  used: number;
  unused: number;
}

// Define the type for Colleague
 export interface Colleague {
  id: number;
  name: string;
  title: string;
  university: string;
  avatar: string;
}

// Define the type for the testCardData
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
}: ResultSummaryProps) {
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      scoreRef.current,
      { innerText: 0 },
      {
        innerText: score,
        duration: 1.2,
        ease: 'power2.out',
        snap: { innerText: 1 },
      }
    );
  }, [score]);

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [testCardData, setTestCardData] = useState<TestCardData | null>(null); // Updated type

  const handleShare = () => {
    setOpen(true);
    setLoading(true);

    // Simulate API call to load colleagues
    setTimeout(() => {
      setColleagues([
        {
          id: 1,
          name: 'Alex Martinez, MD',
          title: 'UCLA',
          university: '',
          avatar: '/images/dashboard/main_dashboard/doc01.png',
        },
        {
          id: 2,
          name: 'Olivia Smith, DMD',
          title: 'NYU',
          university: '',
          avatar: '/images/dashboard/main_dashboard/doc02.png',
        },
        {
          id: 3,
          name: 'Tim Brown, DDS',
          title: 'Parkland',
          university: '',
          avatar: '/images/dashboard/main_dashboard/doc03.png',
        },
      ]);
      setLoading(false);
    }, 1200);

    // Set the test card data when the user clicks share
    setTestCardData({
      questions: 15,
      correctPercentage: 60,
      time: '10m 30s',
      percentile: 88,
      difficulty: 'Senior',
      category: 'Trauma',
    });
  };

  return (
    <>
      <Card className="background text-white font-[manrope]">
        <CardContent className="py-10 text-center space-y-4">
          <div className="flex justify-end gap-3">
            <button className="cursor-pointer bg-[#b79e6b] text-white md:px-[65px] px-6 py-2 md:py-3.5 rounded-xl flex items-center gap-2">
              Review Test
            </button>

            <button
              onClick={handleShare}
              className="cursor-pointer bg-white text-[#01281e] md:px-[65px] md:py-3.5 px-6 py-2 rounded-xl flex items-center gap-2"
            >
              Share
              <span>
                <ShareIconBlack />
              </span>
            </button>
          </div>
          {/* <div className="flex justify-center items-center">
            <CompleteIcon />
          </div> */}
          {/* <h2 className="text-xl md:text-[36px] leading-[170%] font-bold">
            Test Complete!
          </h2> */}
          <div className="complete-card-bg w-fit py-4 px-8 rounded-[12px] mx-auto">
            <span ref={scoreRef} className="text-4xl font-bold">
              {correct}
            </span>
            <span className="text-4xl font-bold">/50</span>
            <p className="text-sm opacity-90">Your Score</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm md:text-[16px] max-w-[873px] mx-auto">
            <Stat label="Correct" value={correct} />
            <Stat label="Incorrect" value={incorrect} />
            <Stat label="Used" value={used} />
            <Stat label="Unused" value={unused} />
          </div>
        </CardContent>
      </Card>

      {/* Pass testCardData to ShareModal */}
      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        loading={loading}
        colleagues={colleagues}
        testCardData={testCardData}
        onSendTestCard={(selectedUser, testCardData) => {
          console.log('TestCard sent to:', selectedUser);
          // Handle sending the test card to the selected user
        }}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="complete-card-bg md:px-8 md:py-4 rounded-[12px]">
      <p className="font-semibold">{value}</p>
      <p className="text-xs opacity-80">{label}</p>
    </div>
  );
}
