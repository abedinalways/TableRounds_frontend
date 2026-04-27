// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   useGetQuestionsQuery,
//   useDeleteQuestionMutation,
//   useUpdateQuestionMutation,
//   useGetSingleQuestionQuery,
//   type UpdateQuestionData,
//   type AnswerOption,
//   type Difficulty, // Import Difficulty type
// } from '@/app/redux/api/allQuestionApi';

// import QuestionsTable, {
//   Question as TableQuestion,
// } from '@/components/question-manager/QuestionsTable';

// import StatsCard from '@/components/question-manager/StatsCard';
// import { toast } from 'sonner';
// import { RichTextEditor } from '@/components/create-questions/RichTextEditor';
// import { X } from 'lucide-react';

// // Define the error type
// interface ApiError {
//   data?: {
//     message?: string;
//   };
//   message?: string;
// }

// export default function QuestionManagerPage() {
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
//     null,
//   );
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { data, isLoading, refetch } = useGetQuestionsQuery({
//     page,
//     limit: 10,
//     search,
//   });

//   const { data: singleQuestionData, isLoading: isLoadingSingle } =
//     useGetSingleQuestionQuery(editingQuestionId || '', {
//       skip: !editingQuestionId,
//     });

//   useEffect(() => {
//     setPage(1);
//   }, [search]);

//   const [deleteQuestion] = useDeleteQuestionMutation();
//   const [updateQuestion] = useUpdateQuestionMutation();

//   // Form state for editing
//   const [editFormData, setEditFormData] = useState<UpdateQuestionData>({});
//   console.log(editFormData, '{{{{{{{{{{{{{{{{{{{{{{{')
//   const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);

//   // Populate form when single question data is loaded
//   useEffect(() => {
//     if (singleQuestionData?.data) {
//       const q = singleQuestionData.data;
//       setEditFormData({
//         question_steam: q.question_steam,
//         difficulty: q.difficulty,
//         topic: q.topic,
//         explanation: q.explanation,
//         why_incorrect: q.why_incorrect,
//         pimping_point: q.pimping_point,
//         memory_trick: q.memory_trick,
//         referance: q.referance,
//         answerOptions: q.answerOptions,
//       });
//       setAnswerOptions(q.answerOptions || []);
//     }
//   }, [singleQuestionData]);

//   const questions: TableQuestion[] =
//     data?.data.map(q => ({
//       id: q.id,
//       question_id: q.question_id,
//       text: q.question_title,
//       topic: q.topic ?? [],
//       difficulty: q.difficulty,
//       total_attempts: q.total_attempts,
//       correct_percentage: q.correct_percentage,
//     })) ?? [];

//   const handleDelete = (q: TableQuestion) => {
//     toast.custom(
//       (id: string | number) => (
//         <div className="bg-white shadow-lg rounded-lg p-4 w-[350px] space-y-4 font-[manrope]">
//           <p className="text-sm font-medium">
//             Are you sure you want to delete this question?
//           </p>

//           <div className="flex justify-end gap-3">
//             <button
//               onClick={() => toast.dismiss(id)}
//               className="px-3 py-1 border rounded"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={async () => {
//                 try {
//                   await deleteQuestion(q.id).unwrap();
//                   toast.success('Question deleted successfully');
//                   refetch();
//                 } catch (error) {
//                   const apiError = error as ApiError;
//                   toast.error(
//                     apiError?.data?.message ||
//                       apiError?.message ||
//                       'Failed to delete question',
//                   );
//                 } finally {
//                   toast.dismiss(id);
//                 }
//               }}
//               className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       ),
//       { duration: 10000 },
//     );
//   };

//   const handleEdit = (q: TableQuestion) => {
//     setEditingQuestionId(q.id);
//     setIsModalOpen(true);
//   };

//   const handleUpdateSubmit = async () => {
//     if (!editingQuestionId) return;

//     try {
//       // Create the update data object
//       const updateData: UpdateQuestionData = {
//         ...editFormData,
//         answerOptions: answerOptions, // Include answerOptions in the update
//       };

//       await updateQuestion({
//         id: editingQuestionId,
//         data: updateData,
//       }).unwrap();

//       toast.success('Question updated successfully');
//       setIsModalOpen(false);
//       setEditingQuestionId(null);
//       refetch();
//     } catch (error) {
//       const apiError = error as ApiError;
//       toast.error(
//         apiError?.data?.message ||
//           apiError?.message ||
//           'Failed to update question',
//       );
//     }
//   };

//   const handleAnswerChange = (
//     index: number,
//     field: keyof AnswerOption,
//     value: string | boolean,
//   ) => {
//     const updated = [...answerOptions];
//     updated[index] = { ...updated[index], [field]: value };
//     setAnswerOptions(updated);
//   };

//   const addAnswerOption = () => {
//     setAnswerOptions([
//       ...answerOptions,
//       { id: Date.now().toString(), option_text: '', is_correct: false },
//     ]);
//   };

//   const removeAnswerOption = (index: number) => {
//     if (answerOptions.length > 2) {
//       const updated = answerOptions.filter((_, i) => i !== index);
//       setAnswerOptions(updated);
//     } else {
//       toast.error('Minimum 2 answer options required');
//     }
//   };

//   if (isLoading) return <p className="p-6">Loading...</p>;

//   return (
//     <div className="font-[manrope]">
//       <div className="mb-8">
//         <h2 className="text-[32px] font-bold">Question Manager</h2>
//       </div>

//       <StatsCard totalQuestions={data?.meta?.total ?? 0} totalTopics={11} />

//       <QuestionsTable
//         data={questions}
//         search={search}
//         setSearch={setSearch}
//         onDelete={handleDelete}
//         onEdit={handleEdit}
//         page={page}
//         setPage={setPage}
//         meta={data?.meta}
//       />

//       {/* EDIT MODAL */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
//           <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto space-y-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-bold">Edit Question</h3>

//               <button
//                 onClick={() => {
//                   setIsModalOpen(false);
//                   setEditingQuestionId(null);
//                 }}
//                 className="p-1 rounded hover:bg-gray-100 transition cursor-pointer text-red-800"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {isLoadingSingle ? (
//               <div className="py-8 text-center">Loading question data...</div>
//             ) : (
//               <>
//                 {/* Question ID Display */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Question ID
//                   </label>
//                   <input
//                     value={singleQuestionData?.data?.question_id || ''}
//                     disabled
//                     className="w-full border px-3 py-2 rounded bg-gray-50"
//                   />
//                 </div>

//                 {/* Question Stem (Rich Text) */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Question Stem
//                   </label>
//                   <RichTextEditor
//                     key={editingQuestionId}
//                     value={editFormData.question_steam || ''}
//                     onChange={(val: string) =>
//                       setEditFormData({ ...editFormData, question_steam: val })
//                     }
//                   />
//                 </div>

//                 {/* Difficulty */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Difficulty
//                   </label>
//                   <select
//                     value={editFormData.difficulty || 'Intern'}
//                     onChange={e =>
//                       setEditFormData({
//                         ...editFormData,
//                         difficulty: e.target.value as Difficulty,
//                       })
//                     }
//                     className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#01503b]"
//                   >
//                     <option value="Intern">Intern</option>
//                     <option value="Senior">Senior</option>
//                     <option value="Board">Board</option>
//                   </select>
//                 </div>

//                 {/* Topics */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Topics
//                   </label>
//                   <input
//                     value={editFormData.topic?.join(', ') || ''}
//                     onChange={e =>
//                       setEditFormData({
//                         ...editFormData,
//                         topic: e.target.value.split(',').map(t => t.trim()),
//                       })
//                     }
//                     placeholder="Enter topics separated by commas"
//                     className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#01503b]"
//                   />
//                 </div>

//                 {/* Answer Options */}
//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <label className="text-sm font-medium text-gray-700">
//                       Answer Options
//                     </label>
//                     <button
//                       type="button"
//                       onClick={addAnswerOption}
//                       className="text-sm text-[#01503b] hover:text-[#01281e]"
//                     >
//                       + Add Option
//                     </button>
//                   </div>
//                   {answerOptions.map((option, idx) => (
//                     <div
//                       key={option.id}
//                       className="flex items-center gap-3 p-3 border rounded-lg"
//                     >
//                       <input
//                         type="radio"
//                         name="correctAnswer"
//                         checked={option.is_correct}
//                         onChange={() => {
//                           const updated = answerOptions.map((opt, i) => ({
//                             ...opt,
//                             is_correct: i === idx,
//                           }));
//                           setAnswerOptions(updated);
//                         }}
//                         className="w-4 h-4 accent-[#01503b]"
//                       />
//                       <span className="text-gray-400">
//                         {String.fromCharCode(65 + idx)}.
//                       </span>
//                       <input
//                         value={option.option_text}
//                         onChange={e =>
//                           handleAnswerChange(idx, 'option_text', e.target.value)
//                         }
//                         placeholder="Enter choice text"
//                         className="flex-1 border-none focus:outline-none"
//                       />
//                       {answerOptions.length > 2 && (
//                         <button
//                           type="button"
//                           onClick={() => removeAnswerOption(idx)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           Delete
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Explanation */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Explanation
//                   </label>
//                   <RichTextEditor
//                     key={editingQuestionId}
//                     value={editFormData.explanation || ''}
//                     onChange={(val: string) =>
//                       setEditFormData({ ...editFormData, explanation: val })
//                     }
//                   />
//                 </div>

//                 {/* Why Incorrect */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Why The Other Options Are Incorrect
//                   </label>
//                   <RichTextEditor
//                     key={editingQuestionId}
//                     value={editFormData.why_incorrect || ''}
//                     onChange={(val: string) =>
//                       setEditFormData({ ...editFormData, why_incorrect: val })
//                     }
//                   />
//                 </div>

//                 {/* Jumping Points (Pimping Point) */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Pimping Point
//                   </label>
//                   <RichTextEditor
//                     key={editingQuestionId}
//                     value={editFormData.pimping_point || ''}
//                     onChange={(val: string) =>
//                       setEditFormData({ ...editFormData, pimping_point: val })
//                     }
//                   />
//                 </div>

//                 {/* Memory Trick */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Memory Trick
//                   </label>
//                   <RichTextEditor
//                     key={editingQuestionId}
//                     value={editFormData.memory_trick || ''}
//                     onChange={(val: string) =>
//                       setEditFormData({ ...editFormData, memory_trick: val })
//                     }
//                   />
//                 </div>

//                 {/* Reference */}
//                 <div className="space-y-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Reference
//                   </label>
//                   <RichTextEditor
//                     key={editingQuestionId}
//                     value={editFormData.referance || ''}
//                     onChange={(val: string) =>
//                       setEditFormData({ ...editFormData, referance: val })
//                     }
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     onClick={() => {
//                       setIsModalOpen(false);
//                       setEditingQuestionId(null);
//                     }}
//                     className="px-4 py-2 border rounded hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleUpdateSubmit}
//                     className="px-4 py-2 bg-[#01503b] text-white rounded hover:bg-[#01281e]"
//                   >
//                     Update Question
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  useGetSingleQuestionQuery,
  type UpdateQuestionData,
  type AnswerOption,
  type Difficulty, // Import Difficulty type
} from '@/app/redux/api/allQuestionApi';

import QuestionsTable, {
  Question as TableQuestion,
} from '@/components/question-manager/QuestionsTable';

import StatsCard from '@/components/question-manager/StatsCard';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/create-questions/RichTextEditor';
import { X } from 'lucide-react';


const TOPICS = [
  { value: 'Anesthesia_Medicine', label: 'Anesthesia / Medicine' },
  { value: 'Cancer', label: 'Cancer' },
  { value: 'Cleft_Craniofacial', label: 'Cleft / Craniofacial' },
  { value: 'Cosmetics', label: 'Cosmetics' },
  { value: 'Dentoalveolar', label: 'Dentoalveolar' },
  { value: 'Implants', label: 'Implants' },
  { value: 'Orthognathic', label: 'Orthognathic' },
  { value: 'Pathology', label: 'Pathology' },
  { value: 'Recontraction', label: 'Reconstruction' },
  { value: 'TMJ', label: 'TMJ' },
  { value: 'Trauma', label: 'Trauma' },
];

// Define the error type
interface ApiError {
  data?: {
    message?: string;
  };
  message?: string;
}

export default function QuestionManagerPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetQuestionsQuery({
    page,
    limit: 10,
    search,
  });

  const { data: singleQuestionData, isLoading: isLoadingSingle } =
    useGetSingleQuestionQuery(editingQuestionId || '', {
      skip: !editingQuestionId,
    });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const [deleteQuestion] = useDeleteQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  // Form state for editing
  const [editFormData, setEditFormData] = useState<UpdateQuestionData>({});
  console.log(editFormData, '{{{{{{{{{{{{{{{{{{{{{{{');
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([]);

  // Populate form when single question data is loaded
  useEffect(() => {
    if (singleQuestionData?.data) {
      const q = singleQuestionData.data;
      setEditFormData({
        question_steam: q.question_steam,
        difficulty: q.difficulty,
        topic: q.topic,
        explanation: q.explanation,
        why_incorrect: q.why_incorrect,
        pimping_point: q.pimping_point,
        memory_trick: q.memory_trick,
        referance: q.referance,
        answerOptions: q.answerOptions,
      });
      setAnswerOptions(q.answerOptions || []);
    }
  }, [singleQuestionData]);

  // Helper: convert backend topic value to display label
  const toDisplayLabel = (value: string) =>
    TOPICS.find(t => t.value === value)?.label ?? value.replace(/_/g, ' / ');

  const questions: TableQuestion[] =
    data?.data.map(q => ({
      id: q.id,
      question_id: q.question_id,
      text: q.question_title,
      topic: (q.topic ?? []).map(toDisplayLabel),
      difficulty: q.difficulty,
      total_attempts: q.total_attempts,
      correct_percentage: q.correct_percentage,
    })) ?? [];

  const handleDelete = (q: TableQuestion) => {
    toast.custom(
      (id: string | number) => (
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
                  refetch();
                } catch (error) {
                  const apiError = error as ApiError;
                  toast.error(
                    apiError?.data?.message ||
                      apiError?.message ||
                      'Failed to delete question',
                  );
                } finally {
                  toast.dismiss(id);
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );
  };

  const handleEdit = (q: TableQuestion) => {
    setEditingQuestionId(q.id);
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!editingQuestionId) return;

    try {
      // Create the update data object
      const updateData: UpdateQuestionData = {
        ...editFormData,
        answerOptions: answerOptions, // Include answerOptions in the update
      };

      await updateQuestion({
        id: editingQuestionId,
        data: updateData,
      }).unwrap();

      toast.success('Question updated successfully');
      setIsModalOpen(false);
      setEditingQuestionId(null);
      refetch();
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(
        apiError?.data?.message ||
          apiError?.message ||
          'Failed to update question',
      );
    }
  };

  const handleAnswerChange = (
    index: number,
    field: keyof AnswerOption,
    value: string | boolean,
  ) => {
    const updated = [...answerOptions];
    updated[index] = { ...updated[index], [field]: value };
    setAnswerOptions(updated);
  };

  const addAnswerOption = () => {
    setAnswerOptions([
      ...answerOptions,
      { id: Date.now().toString(), option_text: '', is_correct: false },
    ]);
  };

  const removeAnswerOption = (index: number) => {
    if (answerOptions.length > 2) {
      const updated = answerOptions.filter((_, i) => i !== index);
      setAnswerOptions(updated);
    } else {
      toast.error('Minimum 2 answer options required');
    }
  };

  // Toggle a topic in the selected list (stores backend format)
  const handleTopicToggle = (topic: string) => {
    const current = editFormData.topic ?? [];
    const updated = current.includes(topic)
      ? current.filter(t => t !== topic)
      : [...current, topic];
    setEditFormData({ ...editFormData, topic: updated });
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
        page={page}
        setPage={setPage}
        meta={data?.meta}
      />

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Edit Question</h3>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingQuestionId(null);
                }}
                className="p-1 rounded hover:bg-gray-100 transition cursor-pointer text-red-800"
              >
                <X size={20} />
              </button>
            </div>

            {isLoadingSingle ? (
              <div className="py-8 text-center">Loading question data...</div>
            ) : (
              <>
                {/* Question ID Display */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Question ID
                  </label>
                  <input
                    value={singleQuestionData?.data?.question_id || ''}
                    disabled
                    className="w-full border px-3 py-2 rounded bg-gray-50"
                  />
                </div>

                {/* Question Stem (Rich Text) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Question Stem
                  </label>
                  <RichTextEditor
                    key={editingQuestionId}
                    value={editFormData.question_steam || ''}
                    onChange={(val: string) =>
                      setEditFormData({ ...editFormData, question_steam: val })
                    }
                  />
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    value={editFormData.difficulty || 'Intern'}
                    onChange={e =>
                      setEditFormData({
                        ...editFormData,
                        difficulty: e.target.value as Difficulty,
                      })
                    }
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                  >
                    <option value="Intern">Intern</option>
                    <option value="Senior">Senior</option>
                    <option value="Board">Board</option>
                  </select>
                </div>

                {/* Topics — multi-select checkboxes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Topics
                  </label>
                  <div className="border rounded p-3 grid grid-cols-2 gap-2">
                    {TOPICS.map(topic => (
                      <label
                        key={topic.value}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={
                            editFormData.topic?.includes(topic.value) ?? false
                          }
                          onChange={() => handleTopicToggle(topic.value)}
                          className="accent-[#01503b] w-4 h-4"
                        />
                        {topic.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-gray-700">
                      Answer Options
                    </label>
                    <button
                      type="button"
                      onClick={addAnswerOption}
                      className="text-sm text-[#01503b] hover:text-[#01281e]"
                    >
                      + Add Option
                    </button>
                  </div>
                  {answerOptions.map((option, idx) => (
                    <div
                      key={option.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={option.is_correct}
                        onChange={() => {
                          const updated = answerOptions.map((opt, i) => ({
                            ...opt,
                            is_correct: i === idx,
                          }));
                          setAnswerOptions(updated);
                        }}
                        className="w-4 h-4 accent-[#01503b]"
                      />
                      <span className="text-gray-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        value={option.option_text}
                        onChange={e =>
                          handleAnswerChange(idx, 'option_text', e.target.value)
                        }
                        placeholder="Enter choice text"
                        className="flex-1 border-none focus:outline-none"
                      />
                      {answerOptions.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeAnswerOption(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Explanation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Explanation
                  </label>
                  <RichTextEditor
                    key={editingQuestionId}
                    value={editFormData.explanation || ''}
                    onChange={(val: string) =>
                      setEditFormData({ ...editFormData, explanation: val })
                    }
                  />
                </div>

                {/* Why Incorrect */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Why The Other Options Are Incorrect
                  </label>
                  <RichTextEditor
                    key={editingQuestionId}
                    value={editFormData.why_incorrect || ''}
                    onChange={(val: string) =>
                      setEditFormData({ ...editFormData, why_incorrect: val })
                    }
                  />
                </div>

                {/* Jumping Points (Pimping Point) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Pimping Point
                  </label>
                  <RichTextEditor
                    key={editingQuestionId}
                    value={editFormData.pimping_point || ''}
                    onChange={(val: string) =>
                      setEditFormData({ ...editFormData, pimping_point: val })
                    }
                  />
                </div>

                {/* Memory Trick */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Memory Trick
                  </label>
                  <RichTextEditor
                    key={editingQuestionId}
                    value={editFormData.memory_trick || ''}
                    onChange={(val: string) =>
                      setEditFormData({ ...editFormData, memory_trick: val })
                    }
                  />
                </div>

                {/* Reference */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Reference
                  </label>
                  <RichTextEditor
                    key={editingQuestionId}
                    value={editFormData.referance || ''}
                    onChange={(val: string) =>
                      setEditFormData({ ...editFormData, referance: val })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingQuestionId(null);
                    }}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateSubmit}
                    className="px-4 py-2 bg-[#01503b] text-white rounded hover:bg-[#01281e]"
                  >
                    Update Question
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}