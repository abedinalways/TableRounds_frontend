import React from 'react';
import TraumaIcon from '../reusable/icons/TraumaIcon';
import CircularProgressData from '../statistics/CircularProgress';
import Link from 'next/link';

interface TestCardProps {
  questions: number;
  correctPercentage: number;
  time: string;
  percentile: number;
  difficulty: string;
  category: string;
}

const TestCard: React.FC<TestCardProps> = ({
  questions,
  correctPercentage,
  time,
  percentile,
  difficulty,
  category,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md  w-full font-[manrope] h-fit">
      <div className="flex flex-col text-white space-x-2 background p-6 rounded-[10px]">
        <h3 className="mt-2 text-xl font-semibold ">{questions} Questions</h3>
        <div className="text-sm">Difficulty: {difficulty} </div>
      </div>
      <div className="text-sm md:text-2xl font-bold flex gap-2 items-center my-6 ">
        <TraumaIcon /> {category}
      </div>
      {/* Progress Circle */}
      <div className="flex items-center justify-center">
        <CircularProgressData percentage={correctPercentage} />
      </div>

      {/* Additional Information */}
      <div className="mt-4 text-sm flex justify-between text-gray-600">
        <div className="flex flex-col justify-between">
          <span className="font-semibold">{percentile}th</span>
          <span>Percentile</span>
        </div>
        <div className="flex flex-col justify-between mt-1">
          <span className="font-semibold">{time}</span>
          <span>Time</span>
        </div>
      </div>
      <Link href="/dashboard/create-test">
      <button className="mt-6 w-full py-2 bg-[#B79E6B] text-white rounded-sm text-center cursor-pointer font-semibold">
        Take This Test
      </button>
      </Link>
    </div>
  );
};

export default TestCard;
