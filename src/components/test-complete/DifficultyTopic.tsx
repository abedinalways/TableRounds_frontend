'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import CheckIcon from '../reusable/icons/CheckIcon';

import InternStatistics from './InternStatistics';
import SeniorStatistics from './SeniorStatistics';
import BoardsStatistics from './BoardsStatistics';

type Topic = 'Intern' | 'Senior' | 'Boards';

export default function DifficultyTopic() {
  const [activeTopic, setActiveTopic] = useState<Topic>('Intern');

  return (
    <Card>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['Intern', 'Senior', 'Boards'] as Topic[]).map(topic => {
            const isActive = activeTopic === topic;

            return (
              <Button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                variant="ghost"
                className={`
          w-[122px] h-[41px] rounded-sm flex gap-2
          text-[#01281E]

          ${topic === 'Intern' && 'bg-[#ecfdf5]'}
          ${topic === 'Senior' && 'bg-[#f9f9f5]'}
          ${topic === 'Boards' && 'bg-[#fef2f2]'}

          ${isActive && 'border border-[#01281E] bg-green-800 text-white font-semibold shadow-sm'}
          ${!isActive && 'opacity-70 hover:opacity-100'}
        `}
              >
                
                {topic}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        <main className="mt-6">
          {activeTopic === 'Intern' && <InternStatistics />}
          {activeTopic === 'Senior' && <SeniorStatistics />}
          {activeTopic === 'Boards' && <BoardsStatistics />}
        </main>
      </CardContent>
    </Card>
  );
}
