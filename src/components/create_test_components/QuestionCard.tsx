/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CardContent, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuizDetailsUI, QuizQuestionDataUI } from '@/types/test-session';
import Btn from '../reusable/button/Btn';
import { cn } from '@/lib/utils';
import { CircularProgress } from '../progress-10';
import CorrectIcon from '../reusable/icons/CorrectIcon';
import WrongIcon from '../reusable/icons/WrongIcon';
import { useAnswerQuestionMutation } from '@/app/redux/api/testSessionApi';
import { AnswerToast } from './AnswerToast';
import { Loader2 } from 'lucide-react';

// ✅ Shuffle ফাংশন — র‍্যান্ডম অর্ডার তৈরি করে
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface QuestionCardProps {
  testId: string;
  questionID: string;
  currentQuestion: number;
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestionDataUI[]>>;
  quizDetails: QuizDetailsUI;
  selectedAnswerId: string | null;
  showExplanation: boolean;
  isUserCorrect: boolean;
  onAnswerChange: (value: string) => void;
  onToggleHide: () => void;
  isQuestionHidden: boolean;
  hideActions?: boolean;
  hideToggleButton?: boolean;
  hideResult?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  testId,
  questionID,
  currentQuestion,
  setQuestions,
  quizDetails,
  selectedAnswerId,
  showExplanation,
  isUserCorrect,
  onAnswerChange,
  onToggleHide,
  isQuestionHidden,
  hideActions = false,
  hideToggleButton = false,
  hideResult = false,
}) => {
  const [answerQuestion] = useAnswerQuestionMutation();

  const [showToast, setShowToast] = useState(false);
  const [toastCorrect, setToastCorrect] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const [localShowExplanation, setLocalShowExplanation] = useState(false);
  const [localSelectedAnswerId, setLocalSelectedAnswerId] = useState<
    string | null
  >(quizDetails.userAnswerId ? String(quizDetails.userAnswerId) : null);
  const [localCorrectAnswerId, setLocalCorrectAnswerId] = useState<
    string | null
  >(quizDetails.correctAnswerId ? String(quizDetails.correctAnswerId) : null);
  const [localAnswerOptions, setLocalAnswerOptions] = useState<
    QuizDetailsUI['answerOptions']
  >(quizDetails.answerOptions ?? []);

  const [localExplanation, setLocalExplanation] = useState(
    quizDetails.explanation ?? null,
  );


  const [shuffleOrder, setShuffleOrder] = useState<string[]>([]);

 
  useEffect(() => {
    const options = quizDetails.answerOptions ?? [];
    if (options.length > 0) {
      const shuffled = shuffleArray(options);
      setShuffleOrder(shuffled.map(opt => String(opt.id)));
    }
  }, [quizDetails.id]); 

  const hideToast = useCallback(() => setShowToast(false), []);

  useEffect(() => {
    const nextSelectedAnswer = quizDetails.userAnswerId
      ? String(quizDetails.userAnswerId)
      : null;

    const nextCorrectAnswerId = quizDetails.correctAnswerId
      ? String(quizDetails.correctAnswerId)
      : null;

    setLocalSelectedAnswerId(nextSelectedAnswer);
    setLocalCorrectAnswerId(nextCorrectAnswerId);

    
    setLocalAnswerOptions(prev => {
      const hasPercentageData = prev.some(
        opt => Number(opt.percentage ?? 0) > 0,
      );
      if (hasPercentageData) {
        return prev;
      }
      return quizDetails.answerOptions ?? [];
    });

    setLocalExplanation(quizDetails.explanation ?? null);
    setLocalShowExplanation(Boolean(nextSelectedAnswer && nextCorrectAnswerId));
    setShowToast(false);

    onAnswerChange(nextSelectedAnswer ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    quizDetails.id,
    quizDetails.userAnswerId,
    quizDetails.correctAnswerId,
    quizDetails.explanation,
  ]);

  const answerOptions = localAnswerOptions?.length
    ? localAnswerOptions
    : (quizDetails.answerOptions ?? []);

  
  const shuffledOptions = useMemo(() => {
    if (shuffleOrder.length === 0) return answerOptions;

    const optionMap = new Map(answerOptions.map(opt => [String(opt.id), opt]));

    
    const ordered = shuffleOrder
      .map(id => optionMap.get(id))
      .filter(Boolean) as typeof answerOptions;

    
    const orderedIds = new Set(shuffleOrder);
    const remaining = answerOptions.filter(
      opt => !orderedIds.has(String(opt.id)),
    );

    return [...ordered, ...remaining];
  }, [answerOptions, shuffleOrder]);

  const answeredOptionId = localSelectedAnswerId
    ? String(localSelectedAnswerId)
    : quizDetails.userAnswerId
      ? String(quizDetails.userAnswerId)
      : null;

  const activeSelectedAnswerId = selectedAnswerId
    ? String(selectedAnswerId)
    : answeredOptionId;

  const correctAnswerId = localCorrectAnswerId
    ? String(localCorrectAnswerId)
    : quizDetails.correctAnswerId
      ? String(quizDetails.correctAnswerId)
      : null;

  const displayShowExplanation =
    localShowExplanation || showExplanation || Boolean(answeredOptionId);

  const isAlreadyAnswered = Boolean(answeredOptionId);
  const isLocked = isAlreadyAnswered || displayShowExplanation;

  const handleAnswerChange = useCallback(
    (value: string) => {
      if (isLocked) return;

      onAnswerChange(String(value));
    },
    [isLocked, onAnswerChange],
  );

  const handleSubmit = async (): Promise<boolean> => {
    if (!activeSelectedAnswerId || isLocked || isSubmittingAnswer) {
      return false;
    }

    try {
      setIsSubmittingAnswer(true);

      const res = await answerQuestion({
        test_id: testId,
        question_id: questionID,
        answer_option_id: activeSelectedAnswerId,
      }).unwrap();

      if (!res?.success || !res?.data) {
        throw new Error(res?.message || 'Failed to submit answer');
      }

      const answerOptionsResponse = res.data.answerOptions ?? [];

      console.log('Answer response:', answerOptionsResponse);

      const totalSelectsFromResponse = answerOptionsResponse.reduce(
        (sum: number, o: any) => sum + Number(o.total_select ?? 0),
        0,
      );

      const mappedAnswerOptions = answerOptionsResponse.map((o: any) => {
        let percentage = 0;

        if (o.percentage) {
          percentage = Number(o.percentage);
        } else if (totalSelectsFromResponse > 0 && o.total_select) {
          percentage = Math.round(
            (Number(o.total_select) / totalSelectsFromResponse) * 100,
          );
        }

        return {
          id: String(o.id),
          option_text: o.option_text,
          is_correct: Boolean(o.is_correct),
          total_select: Number(o.total_select ?? 0),
          percentage: percentage,
        };
      });

      const selectedOptionId = String(
        res.data.selected_option_id ?? activeSelectedAnswerId,
      );

      const correctOption = answerOptionsResponse.find(
        (o: any) => o.is_correct,
      );
      const correctOptionId = correctOption?.id
        ? String(correctOption.id)
        : null;

      const isCorrect = selectedOptionId === correctOptionId;

      const explanation = {
        main: res.data.explanation,
        image: res.data.explanation_image_url
          ? res.data.explanation_image_url
          : res.data.explanation_image
            ? `https://backend.tablerounds.ai/public/storage/question/${res.data.explanation_image}`
            : null,
        whyIncorrect: res.data.why_incorrect
          ? [{ option: '', text: res.data.why_incorrect }]
          : [],
        pinningPoint: res.data.pimping_point,
        memoryTrick: res.data.memory_trick,
        referance: res.data.referance
          ? Array.isArray(res.data.referance)
            ? res.data.referance
            : [res.data.referance]
          : [],
      };

      setLocalSelectedAnswerId(selectedOptionId);
      setLocalCorrectAnswerId(correctOptionId);
      setLocalAnswerOptions(mappedAnswerOptions);
      setLocalExplanation(explanation);
      setLocalShowExplanation(true);

      setQuestions(prev => {
        const copy = [...prev];
        const idx = currentQuestion - 1;
        const existing = copy[idx];

        if (!existing) return prev;

        copy[idx] = {
          ...existing,
          quizDetails: {
            ...existing.quizDetails,
            userAnswerId: selectedOptionId,
            correctAnswerId: correctOptionId,
            explanation,
            answerOptions: mappedAnswerOptions,
          },
        };

        return copy;
      });

      setToastCorrect(isCorrect);
      setShowToast(true);

      return isCorrect;
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Submit failed';
      const isAlreadyAnswered =
        typeof message === 'string' &&
        message.toLowerCase().includes('already answered');

      if (isAlreadyAnswered) {
        const fallbackSelectedOptionId =
          quizDetails.userAnswerId ?? activeSelectedAnswerId;
        const fallbackCorrectOptionId =
          quizDetails.correctAnswerId ??
          answerOptions.find((option: any) => option.is_correct)?.id ??
          null;

        if (fallbackSelectedOptionId) {
          const selectedId = String(fallbackSelectedOptionId);
          const correctId = fallbackCorrectOptionId
            ? String(fallbackCorrectOptionId)
            : null;

          setLocalSelectedAnswerId(selectedId);
          setLocalCorrectAnswerId(correctId);
          setLocalShowExplanation(Boolean(correctId));

          setQuestions(prev => {
            const copy = [...prev];
            const idx = currentQuestion - 1;
            const existing = copy[idx];

            if (!existing) return prev;

            copy[idx] = {
              ...existing,
              quizDetails: {
                ...existing.quizDetails,
                userAnswerId: selectedId,
                correctAnswerId: correctId,
                answerOptions: existing.quizDetails.answerOptions.map(
                  option => ({
                    ...option,
                    id: String(option.id),
                    is_correct:
                      Boolean(option.is_correct) ||
                      String(option.id) === String(correctId),
                  }),
                ),
              },
            };

            return copy;
          });

          return correctId ? selectedId === correctId : false;
        }
      }

      console.error('Submit failed:', error);
      return false;
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const progressValue = 0;

  const isCorrectAnswer =
    Boolean(answeredOptionId) &&
    Boolean(correctAnswerId) &&
    String(answeredOptionId) === String(correctAnswerId);

  const handleToggleHide = () => {
    if (!displayShowExplanation) return;
    onToggleHide();
  };

  return (
    <div className="w-full bg-[#f9f9f5] md:my-8 md:p-[32px] rounded-[16px]">
      <AnswerToast
        show={showToast}
        isCorrect={toastCorrect}
        onHide={hideToast}
      />

      {displayShowExplanation && !hideToggleButton && (
        <div className="mb-4">
          <Btn
            text={isQuestionHidden ? 'Show Question' : 'Hide Question'}
            onClick={handleToggleHide}
            className="bg-[#b79e6b] text-white px-6 py-2 text-sm font-semibold cursor-pointer"
          />
        </div>
      )}

      <CardHeader>
        {quizDetails?.question_title && (
          <h2 className="text-lg md:text-2xl font-bold text-[#01281e] mb-3">
            {quizDetails.question_title}
          </h2>
        )}

        <div
          className="prose prose-sm md:prose-base max-w-none text-gray-700 mb-5 text-lg md:text-xl"
          dangerouslySetInnerHTML={{
            __html: quizDetails?.question_steam || '',
          }}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup
          value={activeSelectedAnswerId ?? ''}
          onValueChange={handleAnswerChange}
          className="space-y-4"
        >
        
          {shuffledOptions.map((option, index) => {
            const optionId = String(option.id);
            const isCorrect =
              Boolean(correctAnswerId) && optionId === correctAnswerId;
            const isSelected =
              Boolean(activeSelectedAnswerId) &&
              optionId === activeSelectedAnswerId;
            const isWrongSelected = isLocked && isSelected && !isCorrect;

            const hasStatsData =
              Number(option.total_select ?? 0) > 0 ||
              Number(option.percentage ?? 0) > 0;

            return (
              <div
                key={optionId}
                className={cn(
                  'relative flex items-center justify-between p-3 rounded-xl border border-[#00000026] transition-all',
                  isLocked && isCorrect && 'bg-green-100 border-green-500',
                  isWrongSelected && 'bg-red-100 border-red-500',
                  !isLocked && 'bg-gray-50 hover:bg-gray-100',
                )}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    variant="default"
                    value={optionId}
                    id={`option-${optionId}`}
                    disabled={isLocked}
                  />
                  <Label
                    htmlFor={`option-${optionId}`}
                    className={cn(
                      'cursor-pointer text-base md:text-lg',
                      isLocked && 'cursor-not-allowed',
                      isCorrect && 'text-black',
                      isSelected && !isCorrect && 'text-black',
                    )}
                  >
                    <span className="font-bold mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option.option_text}
                  </Label>
                </div>

                {isLocked && hasStatsData && (
                  <CircularProgress
                    showLabel
                    value={Number(option.percentage ?? 0)}
                    className="text-sm md:text-md font-semibold text-gray-600"
                  />
                )}
              </div>
            );
          })}
        </RadioGroup>

        {isLocked && !hideResult && correctAnswerId && (
          <div
            className={cn(
              'mt-6 border-l-[4px] p-[16px] rounded-[12px]',
              isCorrectAnswer
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50',
            )}
          >
            <CardContent className="flex items-center justify-between">
              <div className="font-bold text-lg">
                {isCorrectAnswer ? (
                  <h4 className="text-[#20AC19] flex items-center gap-2 text-xs md:text-sm">
                    <CorrectIcon /> Correct
                  </h4>
                ) : (
                  <h4 className="text-red-600 flex gap-2 items-center text-xs md:text-sm">
                    <WrongIcon /> Wrong Answer
                  </h4>
                )}
              </div>

             
              {!isCorrectAnswer && (
                <div className="text-xs md:text-sm text-gray-600">
                  <p className="flex items-center gap-2 font-semibold text-[#20AC19]">
                    <CorrectIcon /> Correct Answer:{' '}
                    {(() => {
                      const idx = shuffledOptions.findIndex(
                        option => String(option.id) === correctAnswerId,
                      );

                      return idx >= 0 ? String.fromCharCode(65 + idx) : '—';
                    })()}
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        )}

        {!hideActions && (
          <div className="md:flex justify-between items-center space-y-2 md:space-y-0">
            <button
              type="button"
              onClick={async () => {
                if (isSubmittingAnswer || isLocked) return;

                const isCorrect = await handleSubmit();
                setToastCorrect(isCorrect);
                setShowToast(true);
              }}
              disabled={
                !activeSelectedAnswerId || isLocked || isSubmittingAnswer
              }
              className={cn(
                'w-full md:w-[164px] h-[50px] rounded-md text-md font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                isLocked
                  ? 'bg-green-800 text-white cursor-not-allowed'
                  : 'bg-[#01281e] text-white',
                !activeSelectedAnswerId || isSubmittingAnswer || isLocked
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer hover:bg-[#014432] hover:shadow-md active:scale-[0.98]',
              )}
            >
              {isSubmittingAnswer && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isSubmittingAnswer
                ? 'Submitting...'
                : isAlreadyAnswered
                  ? 'Submitted Answer'
                  : displayShowExplanation
                    ? 'Submitted'
                    : 'Submit Answer'}
            </button>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default QuestionCard;

// =============
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import React, { useCallback, useEffect, useState } from 'react';
// import { CardContent, CardHeader } from '@/components/ui/card';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';
// import { QuizDetailsUI, QuizQuestionDataUI } from '@/types/test-session';
// import Btn from '../reusable/button/Btn';
// import { cn } from '@/lib/utils';
// import { CircularProgress } from '../progress-10';
// import CorrectIcon from '../reusable/icons/CorrectIcon';
// import WrongIcon from '../reusable/icons/WrongIcon';
// import { useAnswerQuestionMutation } from '@/app/redux/api/testSessionApi';
// import { AnswerToast } from './AnswerToast';
// import { Loader2 } from 'lucide-react';

// interface QuestionCardProps {
//   testId: string;
//   questionID: string;
//   currentQuestion: number;
//   setQuestions: React.Dispatch<React.SetStateAction<QuizQuestionDataUI[]>>;
//   quizDetails: QuizDetailsUI;
//   selectedAnswerId: string | null;
//   showExplanation: boolean;
//   isUserCorrect: boolean;
//   onAnswerChange: (value: string) => void;
//   onToggleHide: () => void;
//   isQuestionHidden: boolean;
//   hideActions?: boolean;
//   hideToggleButton?: boolean;
//   hideResult?: boolean;
// }

// const QuestionCard: React.FC<QuestionCardProps> = ({
//   testId,
//   questionID,
//   currentQuestion,
//   setQuestions,
//   quizDetails,
//   selectedAnswerId,
//   showExplanation,
//   isUserCorrect,
//   onAnswerChange,
//   onToggleHide,
//   isQuestionHidden,
//   hideActions = false,
//   hideToggleButton = false,
//   hideResult = false,
// }) => {
//   const [answerQuestion] = useAnswerQuestionMutation();

//   const [showToast, setShowToast] = useState(false);
//   const [toastCorrect, setToastCorrect] = useState(false);
//   const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

//   const [localShowExplanation, setLocalShowExplanation] = useState(false);
//   const [localSelectedAnswerId, setLocalSelectedAnswerId] = useState<
//     string | null
//   >(quizDetails.userAnswerId ? String(quizDetails.userAnswerId) : null);
//   const [localCorrectAnswerId, setLocalCorrectAnswerId] = useState<
//     string | null
//   >(quizDetails.correctAnswerId ? String(quizDetails.correctAnswerId) : null);
//   const [localAnswerOptions, setLocalAnswerOptions] = useState<
//     QuizDetailsUI['answerOptions']
//   >(quizDetails.answerOptions ?? []);

//   const [localExplanation, setLocalExplanation] = useState(
//     quizDetails.explanation ?? null,
//   );

//   const hideToast = useCallback(() => setShowToast(false), []);

//   useEffect(() => {
//     const nextSelectedAnswer = quizDetails.userAnswerId
//       ? String(quizDetails.userAnswerId)
//       : null;

//     const nextCorrectAnswerId = quizDetails.correctAnswerId
//       ? String(quizDetails.correctAnswerId)
//       : null;

//     setLocalSelectedAnswerId(nextSelectedAnswer);
//     setLocalCorrectAnswerId(nextCorrectAnswerId);

//     // ✅ Only update if not already answered with stats
//     setLocalAnswerOptions(prev => {
//       // If we already have percentage data (after submit), keep it
//       const hasPercentageData = prev.some(opt => Number(opt.percentage ?? 0) > 0);
//       if (hasPercentageData) {
//         return prev;
//       }
//       // Otherwise use new data from parent
//       return quizDetails.answerOptions ?? [];
//     });

//     setLocalExplanation(quizDetails.explanation ?? null);
//     setLocalShowExplanation(Boolean(nextSelectedAnswer && nextCorrectAnswerId));
//     setShowToast(false);

//     // keep parent selection in sync
//     onAnswerChange(nextSelectedAnswer ?? '');
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     quizDetails.id,
//     quizDetails.userAnswerId,
//     quizDetails.correctAnswerId,
//     quizDetails.explanation,
//   ]);

//   const answerOptions = localAnswerOptions?.length
//     ? localAnswerOptions
//     : (quizDetails.answerOptions ?? []);

//   const answeredOptionId = localSelectedAnswerId
//     ? String(localSelectedAnswerId)
//     : quizDetails.userAnswerId
//       ? String(quizDetails.userAnswerId)
//       : null;

//   const activeSelectedAnswerId = selectedAnswerId
//     ? String(selectedAnswerId)
//     : answeredOptionId;

//   const correctAnswerId = localCorrectAnswerId
//     ? String(localCorrectAnswerId)
//     : quizDetails.correctAnswerId
//       ? String(quizDetails.correctAnswerId)
//       : null;

//   const displayShowExplanation =
//     localShowExplanation || showExplanation || Boolean(answeredOptionId);

//   const isAlreadyAnswered = Boolean(answeredOptionId);
//   const isLocked = isAlreadyAnswered || displayShowExplanation;

//   const handleAnswerChange = useCallback(
//     (value: string) => {
//       if (isLocked) return;

//       onAnswerChange(String(value));
//     },
//     [isLocked, onAnswerChange],
//   );

//   const handleSubmit = async (): Promise<boolean> => {
//     if (!activeSelectedAnswerId || isLocked || isSubmittingAnswer) {
//       return false;
//     }

//     try {
//       setIsSubmittingAnswer(true);

//       const res = await answerQuestion({
//         test_id: testId,
//         question_id: questionID,
//         answer_option_id: activeSelectedAnswerId,
//       }).unwrap();

//       if (!res?.success || !res?.data) {
//         throw new Error(res?.message || 'Failed to submit answer');
//       }

//       const answerOptionsResponse = res.data.answerOptions ?? [];

//       console.log('Answer response:', answerOptionsResponse);

//       // ✅ Calculate percentage only if total_select exists
//       const totalSelectsFromResponse = answerOptionsResponse.reduce(
//         (sum: number, o: any) => sum + Number(o.total_select ?? 0),
//         0,
//       );

//       const mappedAnswerOptions = answerOptionsResponse.map((o: any) => {
//         let percentage = 0;

//         // If backend sends percentage, use it
//         if (o.percentage) {
//           percentage = Number(o.percentage);
//         }
//         // Calculate from total_select if we have data
//         else if (totalSelectsFromResponse > 0 && o.total_select) {
//           percentage = Math.round(
//             (Number(o.total_select) / totalSelectsFromResponse) * 100,
//           );
//         }

//         return {
//           id: String(o.id),
//           option_text: o.option_text,
//           is_correct: Boolean(o.is_correct),
//           total_select: Number(o.total_select ?? 0),
//           percentage: percentage,
//         };
//       });

//       const selectedOptionId = String(
//         res.data.selected_option_id ?? activeSelectedAnswerId,
//       );

//       const correctOption = answerOptionsResponse.find(
//         (o: any) => o.is_correct,
//       );
//       const correctOptionId = correctOption?.id
//         ? String(correctOption.id)
//         : null;

//       const isCorrect = selectedOptionId === correctOptionId;

//       const explanation = {
//         main: res.data.explanation,
//         image: res.data.explanation_image_url
//           ? res.data.explanation_image_url
//           : res.data.explanation_image
//             ? `https://backend.tablerounds.ai/public/storage/question/${res.data.explanation_image}`
//             : null,
//         whyIncorrect: res.data.why_incorrect
//           ? [{ option: '', text: res.data.why_incorrect }]
//           : [],
//         pinningPoint: res.data.pimping_point,
//         memoryTrick: res.data.memory_trick,
//         referance: res.data.referance
//           ? Array.isArray(res.data.referance)
//             ? res.data.referance
//             : [res.data.referance]
//           : [],
//       };

//       setLocalSelectedAnswerId(selectedOptionId);
//       setLocalCorrectAnswerId(correctOptionId);
//       setLocalAnswerOptions(mappedAnswerOptions);
//       setLocalExplanation(explanation);
//       setLocalShowExplanation(true);

//       setQuestions(prev => {
//         const copy = [...prev];
//         const idx = currentQuestion - 1;
//         const existing = copy[idx];

//         if (!existing) return prev;

//         copy[idx] = {
//           ...existing,
//           quizDetails: {
//             ...existing.quizDetails,
//             userAnswerId: selectedOptionId,
//             correctAnswerId: correctOptionId,
//             explanation,
//             answerOptions: mappedAnswerOptions,
//           },
//         };

//         return copy;
//       });

//       setToastCorrect(isCorrect);
//       setShowToast(true);

//       return isCorrect;
//     } catch (error: any) {
//       const message = error?.data?.message || error?.message || 'Submit failed';
//       const isAlreadyAnswered =
//         typeof message === 'string' &&
//         message.toLowerCase().includes('already answered');

//       if (isAlreadyAnswered) {
//         const fallbackSelectedOptionId =
//           quizDetails.userAnswerId ?? activeSelectedAnswerId;
//         const fallbackCorrectOptionId =
//           quizDetails.correctAnswerId ??
//           answerOptions.find((option: any) => option.is_correct)?.id ??
//           null;

//         if (fallbackSelectedOptionId) {
//           const selectedId = String(fallbackSelectedOptionId);
//           const correctId = fallbackCorrectOptionId
//             ? String(fallbackCorrectOptionId)
//             : null;

//           setLocalSelectedAnswerId(selectedId);
//           setLocalCorrectAnswerId(correctId);
//           setLocalShowExplanation(Boolean(correctId));

//           setQuestions(prev => {
//             const copy = [...prev];
//             const idx = currentQuestion - 1;
//             const existing = copy[idx];

//             if (!existing) return prev;

//             copy[idx] = {
//               ...existing,
//               quizDetails: {
//                 ...existing.quizDetails,
//                 userAnswerId: selectedId,
//                 correctAnswerId: correctId,
//                 answerOptions: existing.quizDetails.answerOptions.map(
//                   option => ({
//                     ...option,
//                     id: String(option.id),
//                     is_correct:
//                       Boolean(option.is_correct) ||
//                       String(option.id) === String(correctId),
//                   }),
//                 ),
//               },
//             };

//             return copy;
//           });

//           return correctId ? selectedId === correctId : false;
//         }
//       }

//       console.error('Submit failed:', error);
//       return false;
//     } finally {
//       setIsSubmittingAnswer(false);
//     }
//   };

//   const progressValue = 0;

//   const isCorrectAnswer =
//     Boolean(answeredOptionId) &&
//     Boolean(correctAnswerId) &&
//     String(answeredOptionId) === String(correctAnswerId);

//   const handleToggleHide = () => {
//     if (!displayShowExplanation) return;
//     onToggleHide();
//   };

//   return (
//     <div className="w-full bg-[#f9f9f5] md:my-8 md:p-[32px] rounded-[16px]">
//       <AnswerToast
//         show={showToast}
//         isCorrect={toastCorrect}
//         onHide={hideToast}
//       />

//       {displayShowExplanation && !hideToggleButton && (
//         <div className="mb-4">
//           <Btn
//             text={isQuestionHidden ? 'Show Question' : 'Hide Question'}
//             onClick={handleToggleHide}
//             className="bg-[#b79e6b] text-white px-6 py-2 text-sm font-semibold cursor-pointer"
//           />
//         </div>
//       )}

//       <CardHeader>
//         {quizDetails?.question_title && (
//           <h2 className="text-lg md:text-2xl font-bold text-[#01281e] mb-3">
//             {quizDetails.question_title}
//           </h2>
//         )}

//         <div
//           className="prose prose-sm md:prose-base max-w-none text-gray-700 mb-5 text-lg md:text-xl"
//           dangerouslySetInnerHTML={{
//             __html: quizDetails?.question_steam || '',
//           }}
//         />
//       </CardHeader>

//       <CardContent className="space-y-4">
//         <RadioGroup
//           value={activeSelectedAnswerId ?? ''}
//           onValueChange={handleAnswerChange}
//           className="space-y-4"
//         >
//           {answerOptions.map((option, index) => {
//             const optionId = String(option.id);
//             const isCorrect =
//               Boolean(correctAnswerId) && optionId === correctAnswerId;
//             const isSelected =
//               Boolean(activeSelectedAnswerId) &&
//               optionId === activeSelectedAnswerId;
//             const isWrongSelected = isLocked && isSelected && !isCorrect;

//             // ✅ Check if we have real stats data
//             const hasStatsData =
//               Number(option.total_select ?? 0) > 0 ||
//               Number(option.percentage ?? 0) > 0;

//             return (
//               <div
//                 key={optionId}
//                 className={cn(
//                   'relative flex items-center justify-between p-3 rounded-xl border border-[#00000026] transition-all',
//                   isLocked && isCorrect && 'bg-green-100 border-green-500',
//                   isWrongSelected && 'bg-red-100 border-red-500',
//                   !isLocked && 'bg-gray-50 hover:bg-gray-100',
//                 )}
//               >
//                 <div className="flex items-center gap-3">
//                   <RadioGroupItem
//                     variant="default"
//                     value={optionId}
//                     id={`option-${optionId}`}
//                     disabled={isLocked}
//                   />
//                   <Label
//                     htmlFor={`option-${optionId}`}
//                     className={cn(
//                       'cursor-pointer text-base md:text-lg',
//                       isLocked && 'cursor-not-allowed',
//                       isCorrect && 'text-black',
//                       isSelected && !isCorrect && 'text-black',
//                     )}
//                   >
//                     <span className="font-bold mr-2">
//                       {String.fromCharCode(65 + index)}.
//                     </span>
//                     {option.option_text}
//                   </Label>
//                 </div>

//                 {/* ✅ Only show CircularProgress if we have actual stats data */}
//                 {isLocked && hasStatsData && (
//                   <CircularProgress
//                     showLabel
//                     value={Number(option.percentage ?? 0)}
//                     className="text-sm md:text-md font-semibold text-gray-600"
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </RadioGroup>

//         {isLocked && !hideResult && correctAnswerId && (
//           <div
//             className={cn(
//               'mt-6 border-l-[4px] p-[16px] rounded-[12px]',
//               isCorrectAnswer
//                 ? 'border-green-500 bg-green-50'
//                 : 'border-red-500 bg-red-50',
//             )}
//           >
//             <CardContent className="flex items-center justify-between">
//               <div className="font-bold text-lg">
//                 {isCorrectAnswer ? (
//                   <h4 className="text-[#20AC19] flex items-center gap-2 text-xs md:text-sm">
//                     <CorrectIcon /> Correct
//                   </h4>
//                 ) : (
//                   <h4 className="text-red-600 flex gap-2 items-center text-xs md:text-sm">
//                     <WrongIcon /> Wrong Answer
//                   </h4>
//                 )}
//               </div>

//               {!isCorrectAnswer && (
//                 <div className="text-xs md:text-sm text-gray-600">
//                   <p className="flex items-center gap-2 font-semibold text-[#20AC19]">
//                     <CorrectIcon /> Correct Answer:{' '}
//                     {(() => {
//                       const idx = answerOptions.findIndex(
//                         option => String(option.id) === correctAnswerId,
//                       );

//                       return idx >= 0 ? String.fromCharCode(65 + idx) : '—';
//                     })()}
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </div>
//         )}

//         {!hideActions && (
//           <div className="md:flex justify-between items-center space-y-2 md:space-y-0">
//             <button
//               type="button"
//               onClick={async () => {
//                 if (isSubmittingAnswer || isLocked) return;

//                 const isCorrect = await handleSubmit();
//                 setToastCorrect(isCorrect);
//                 setShowToast(true);
//               }}
//               disabled={
//                 !activeSelectedAnswerId || isLocked || isSubmittingAnswer
//               }
//               className={cn(
//                 'w-full md:w-[164px] h-[50px] rounded-md text-md font-semibold transition-all duration-200 flex items-center justify-center gap-2',
//                 isLocked
//                   ? 'bg-green-800 text-white cursor-not-allowed'
//                   : 'bg-[#01281e] text-white',
//                 !activeSelectedAnswerId || isSubmittingAnswer || isLocked
//                   ? 'cursor-not-allowed opacity-60'
//                   : 'cursor-pointer hover:bg-[#014432] hover:shadow-md active:scale-[0.98]',
//               )}
//             >
//               {isSubmittingAnswer && (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               )}

//               {isSubmittingAnswer
//                 ? 'Submitting...'
//                 : isAlreadyAnswered
//                   ? 'Submitted Answer'
//                   : displayShowExplanation
//                     ? 'Submitted'
//                     : 'Submit Answer'}
//             </button>
//           </div>
//         )}
//       </CardContent>
//     </div>
//   );
// };

// export default QuestionCard;
