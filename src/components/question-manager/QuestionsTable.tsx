'use client';

import { useMemo, useState } from 'react';
import { Pencil, Trash } from 'lucide-react';
import DeleteIcon from '../reusable/icons/DeleteIcon';
import EditIconAdmin from '../reusable/icons/EditIconAdmin';

export type Question = {
  id: string;
  text: string;
  topics: string;
  difficulty: string;
  attempts: number;
  correct: number;
};

type Props = {
  data: Question[];
  onEdit?: (question: Question) => void;
  onDelete?: (question: Question) => void;
};

export default function QuestionsTable({ data, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [correctFilter, setCorrectFilter] = useState('all'); // all | correct | incorrect
  const [topicFilter, setTopicFilter] = useState('all');

  const topicOptions = useMemo(() => {
    const topics = data.map(q => q.topics);
    return ['all', ...Array.from(new Set(topics))];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(q => {
      const matchSearch =
        q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.id.toLowerCase().includes(search.toLowerCase());

      const matchCorrect =
        correctFilter === 'all'
          ? true
          : correctFilter === 'correct'
          ? q.correct > 0
          : q.correct === 0;

      const matchTopic = topicFilter === 'all' || q.topics === topicFilter;

      return matchSearch && matchCorrect && matchTopic;
    });
  }, [data, search, correctFilter, topicFilter]);

  const handleEdit = (question: Question) => {
    if (onEdit) return onEdit(question);
    alert(`Edit clicked for ${question.id}`);
  };

  const handleDelete = (question: Question) => {
    if (onDelete) return onDelete(question);

    const confirmDelete = confirm(
      `Are you sure you want to delete ${question.id}?`
    );
    if (!confirmDelete) return;

    alert(`Deleted ${question.id} (connect API here)`);
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm p-5 mt-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="font-semibold text-[#01281e] text-[16px] md:text-[20px]">
          Questions
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-[#e5e7eb] rounded-md px-3 py-[6px] w-[210px] bg-[#f7f7f3]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#6b7280]"
            >
              <path
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-sm outline-none placeholder:text-[#9ca3af]"
            />
          </div>

          {/* Correct Filter */}
          <select
            value={correctFilter}
            onChange={e => setCorrectFilter(e.target.value)}
            className="border border-[#e5e7eb] rounded-md px-3 py-[6px] text-sm text-[#6b7280] outline-none w-[120px] bg-[#f7f7f3]"
          >
            <option value="all">Intern</option>
            <option value="correct">Senior</option>
            <option value="incorrect">Boards</option>
          </select>

          {/* Topic Filter */}
          <select
            value={topicFilter}
            onChange={e => setTopicFilter(e.target.value)}
            className="border border-[#e5e7eb] rounded-md px-3 py-[6px] text-sm text-[#6b7280] outline-none w-[120px] bg-[#f7f7f3]"
          >
            <option value="all">Topic</option>
            {topicOptions
              .filter(t => t !== 'all')
              .map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#e5e7eb]">
        <table className="w-full text-sm">
          <thead className="bg-[#01503b] text-white h-[89px]">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[12px] md:text-[16px]">
                Question ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-[12px] md:text-[16px]">
                Question Stem
              </th>
              <th className="px-4 py-3 text-left font-medium text-[12px] md:text-[16px]">
                Topic
              </th>
              <th className="px-4 py-3 text-left font-medium text-[12px] md:text-[16px]">
                Difficulty
              </th>
              <th className="px-4 py-3 text-center font-medium text-[12px] md:text-[16px]">
                Attempts
              </th>
              <th className="px-4 py-3 text-center font-medium text-[12px] md:text-[16px]">
                % Correct
              </th>
              <th className="px-4 py-3 text-center font-medium text-[12px] md:text-[16px]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((question, index) => (
              <tr
                key={question.id}
                className={`border-t border-[#e5e7eb] ${
                  index % 2 === 1 ? 'bg-[#f9fafb]' : 'bg-white'
                }`}
              >
                <td className="px-4 py-4 text-[#374151] text-[12px] md:text-[16px]">
                  {question.id}
                </td>

                <td className="px-4 py-4 text-[#374151] text-[12px] md:text-[16px] max-w-[280px] truncate">
                  {question.text}
                </td>

                <td className="px-4 py-4 text-[#6b7280] text-[12px] md:text-[16px]">
                  {question.topics}
                </td>

                <td className="px-4 py-4 text-[#6b7280] text-[12px] md:text-[16px]">
                  {question.difficulty}
                </td>

                <td className="px-4 py-4 text-center text-[#6b7280] text-[12px] md:text-[16px]">
                  {question.attempts}
                </td>

                <td className="px-4 py-4 text-center text-[#6b7280] text-[12px] md:text-[16px]">
                  {question.correct}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(question)}
                      className="text-[#0b4b3a] cursor-pointer"
                    >
                      <EditIconAdmin />
                    </button>
                    <button
                      onClick={() => handleDelete(question)}
                      className="text-[#0b4b3a] cursor-pointer"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-sm text-gray-500"
                >
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
