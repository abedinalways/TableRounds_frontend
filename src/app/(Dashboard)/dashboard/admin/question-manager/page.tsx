'use client';

import { useState } from 'react';
import {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} from '@/app/redux/api/allQuestionApi';

import QuestionsTable, {
  Question as TableQuestion,
} from '@/components/question-manager/QuestionsTable';

import StatsCard from '@/components/question-manager/StatsCard';
import { toast } from 'sonner';

export default function QuestionManagerPage() {
  const [search, setSearch] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<TableQuestion | null>(
    null,
  );

  const { data, isLoading } = useGetQuestionsQuery({
    page: 1,
    limit: 10,
    search,
  });

  const [deleteQuestion] = useDeleteQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  /* ================= MAP ================= */

  const questions: TableQuestion[] =
    data?.data.map(q => ({
      id: q.id, // Mongo _id
      question_id: q.question_id,
      text: q.question_title,
      topic: q.topic ?? [],
      difficulty: q.difficulty,
      total_attempts: q.total_attempts,
      correct_percentage: q.correct_percentage,
    })) ?? [];

  /* ================= DELETE (SONNER V2) ================= */

  const handleDelete = (q: TableQuestion) => {
    toast.custom(
      id => (
        <div className="bg-white shadow-lg rounded-lg p-4 w-[350px] space-y-4 font-[manrope]">
          <p className="text-sm font-medium">
            Are you sure you want to delete this question?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(id)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                try {
                  await deleteQuestion(q.id).unwrap();
                  toast.success('Question deleted successfully');
                } catch (error: any) {
                  toast.error(
                    error?.data?.message || 'Failed to delete question',
                  );
                } finally {
                  toast.dismiss(id);
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer font-[inter]"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );
  };

  /* ================= EDIT ================= */

  const handleEdit = (q: TableQuestion) => {
    setEditingQuestion(q);
  };

  const handleUpdateSubmit = async () => {
    if (!editingQuestion) return;

    try {
      await updateQuestion({
        id: editingQuestion.id,
        data: {
          question_title: editingQuestion.text,
          difficulty: editingQuestion.difficulty,
        },
      }).unwrap();

      toast.success('Question updated successfully');
      setEditingQuestion(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update question');
    }
  };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="font-[manrope]">
      <div className="mb-8">
        <h2 className="text-[32px] font-bold">Question Manager</h2>
      </div>

      <StatsCard totalQuestions={data?.meta?.total ?? 0} totalTopics={11} />

      <QuestionsTable
        data={questions}
        search={search}
        setSearch={setSearch}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* EDIT MODAL */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h3 className="text-lg font-semibold">Edit Question</h3>

            <input
              value={editingQuestion.text}
              onChange={e =>
                setEditingQuestion({
                  ...editingQuestion,
                  text: e.target.value,
                })
              }
              className="w-full border px-3 py-2 rounded"
            />

            <select
              value={editingQuestion.difficulty}
              onChange={e =>
                setEditingQuestion({
                  ...editingQuestion,
                  difficulty: e.target.value as TableQuestion['difficulty'],
                })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Intern">Intern</option>
              <option value="Senior">Senior</option>
              <option value="Boards">Boards</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-[#01503b] text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
