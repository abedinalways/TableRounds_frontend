'use client'
import QuestionsTable, { Question } from "@/components/question-manager/QuestionsTable";
import StatsCard from "@/components/question-manager/StatsCard";
import { useState } from "react";


const questionsData: Question[] = [
  {
    id: 'Q-102344',
    text: 'Management of bilateral subcondylar fractures...',
    topics: 'Trauma',
    difficulty: 'Intern',
    attempts: 50,
    correct: 49,
  },
  {
    id: 'Q-102343',
    text: 'Management of bilateral subcondylar fractures...',
    topics: 'Orthognathic',
    difficulty: 'Intern',
    attempts: 34,
    correct: 34,
  },
  {
    id: 'Q-102342',
    text: 'Management of bilateral subcondylar fractures...',
    topics: 'Pathology',
    difficulty: 'Senior',
    attempts: 40,
    correct: 38,
  },
  {
    id: 'Q-102348',
    text: 'Management of bilateral subcondylar fractures...',
    topics: 'Trauma',
    difficulty: 'Intern',
    attempts: 50,
    correct: 49,
  },
  {
    id: 'Q-102349',
    text: 'Management of bilateral subcondylar fractures...',
    topics: 'Orthognathic',
    difficulty: 'Intern',
    attempts: 34,
    correct: 34,
  },
  {
    id: 'Q-102347',
    text: 'Management of bilateral subcondylar fractures...',
    topics: 'Pathology',
    difficulty: 'Senior',
    attempts: 40,
    correct: 38,
  },
];

export default function QuestionManagerPage() {
    const [questions, setQuestions] = useState<Question[]>(questionsData);

    const handleEdit = (q: Question) => {
      alert('Open edit modal for: ' + q.id);
    };

    const handleDelete = (q: Question) => {
      setQuestions(prev => prev.filter(item => item.id !== q.id));
    };
  return (
    <div className="font-[manrope]">
      <div className="mb-8">
        <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold leading-[130%] ">
          Question Manager
        </h2>
        <p className="text-[#6b7280] text-[14px] md:text-[18px] font-normal leading-[130%] ">
          Edit previously created questions
        </p>
      </div>
      <StatsCard totalQuestions={243} totalTopics={11} />

      <QuestionsTable
        data={questions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
