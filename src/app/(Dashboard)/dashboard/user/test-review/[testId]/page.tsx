'use client';

import { useParams } from 'next/navigation';
import { useGetTestDetailsQuery } from '@/app/redux/api/testSessionApi';

export default function TestReviewPage() {
  const { testId } = useParams();

  const { data, isLoading } = useGetTestDetailsQuery(testId);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  const test = data?.data;

  return (
    <div className="p-6 space-y-6  font-[manrope]">
        <h2 className="text-5xl font-bold">Test Review</h2>
      {/* Header */}
      <div className="bg-[#0f5132] text-white p-4 flex text-3xl flex-col justify-center items-center rounded-xl">
        <p>Score: {test?.score}%</p>
        <p>Total Questions: {test?.total_questions}</p>
        <p>Difficulty: {test?.difficulty}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {test?.questions?.map((q: any, index: number) => {
          const correctOption = q.answerOptions.find((o: any) => o.is_correct);

          return (
            <div
              key={q.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              {/* Question */}
              <h3 className="font-semibold mb-2">
                Q{index + 1}. {q.question_title}
              </h3>

              <p
                className="text-sm text-gray-600 mb-3"
                dangerouslySetInnerHTML={{ __html: q.question_steam }}
              />

              {/* Options */}
              <div className="space-y-2">
                {q.answerOptions.map((opt: any) => {
                  const isCorrect = opt.is_correct;
                  const isSelected = opt.id === q.user_selected_option_id;

                  return (
                    <div
                      key={opt.id}
                      className={`p-2 rounded-md text-sm border
                        ${
                          isCorrect
                            ? 'bg-green-100 border-green-400'
                            : isSelected
                              ? 'bg-red-100 border-red-400'
                              : 'bg-gray-50'
                        }
                      `}
                    >
                      {opt.option_text}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="mt-4 p-3 bg-[#f7f7f7] rounded-md text-sm">
                <p className="font-semibold mb-1">Explanation:</p>

                <div dangerouslySetInnerHTML={{ __html: q.explanation }} />

                {/* Image */}
                {q.explanation_image_url && (
                  <img
                    src={q.explanation_image_url}
                    className="mt-2 rounded-lg max-h-[200px]"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
