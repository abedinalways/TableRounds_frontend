import React from 'react'
import { Card, CardContent } from '../ui/card';

import CheckIcon from '../reusable/icons/CheckIcon';

export default function DifficultyTopic() {
  return (
    <Card className="">
      <CardContent>
        <ul className="md:flex gap-4 space-y-3 md:space-y-0">
          <li className="bg-[#ecfdf5] w-[142px] h-[61px] rounded-xl flex justify-center items-center gap-2">
            <CheckIcon /> Intern
          </li>
          <li className="bg-[#f9f9f5] w-[142px] h-[61px] rounded-2xl flex justify-center items-center gap-2">
            Senior
          </li>
          <li className="bg-[#fef2f2] w-[142px] h-[61px] rounded-2xl flex justify-center items-center gap-2 text-center">
            Boards
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
