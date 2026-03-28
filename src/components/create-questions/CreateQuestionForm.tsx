'use client';

import React, { useRef } from 'react';
import {
  useForm,
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagSelector } from './TagSelector';
import { Difficulty } from '@/types/question';
import { RichTextEditor } from './RichTextEditor';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { useCreateQuestionMutation } from '@/app/redux/api/createQuestionsApi';

// Define topics with display names
const TOPICS = [
  { value: 'Anesthesia_Medicine', label: 'Anesthesia Medicine' },
  { value: 'Cancer', label: 'Cancer' },
  { value: 'Cleft_Craniofacial', label: 'Cleft Craniofacial' },
  { value: 'Cosmetics', label: 'Cosmetics' },
  { value: 'Dentoalveolar', label: 'Dentoalveolar' },
  { value: 'Implants', label: 'Implants' },
  { value: 'Orthognathic', label: 'Orthognathic' },
  { value: 'Pathology', label: 'Pathology' },
  { value: 'Reconstruction', label: 'Reconstruction' },
  { value: 'TMJ', label: 'TMJ' },
  { value: 'Trauma', label: 'Trauma' },
];
const DIFFICULTIES: Difficulty[] = ['Intern', 'Senior', 'Board'];

// ─── Types ────────────────────────────────────────────────────────────────────

type AnswerOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type SingleQuestionValues = {
  // questionTitle: string;
  questionStem: string;
  explanation: string;
  keyPoints: string;
  keepingPoint: string;
  memoryTrick: string;
  referance: string;
  hasMemoryTrick: boolean;
  answers: AnswerOption[];
};

type ScenarioFormValues = {
  difficulty: Difficulty;
  topic: string;
  questions: SingleQuestionValues[];
};

// ─── Default blank question ───────────────────────────────────────────────────

const blankQuestion = (): SingleQuestionValues => ({
  // questionTitle: '',
  questionStem: '',
  explanation: '',
  keyPoints: '',
  keepingPoint: '',
  memoryTrick: '',
  referance: '',
  hasMemoryTrick: false,
  answers: [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: true },
  ],
});

// ─── Single Question Block ────────────────────────────────────────────────────

type QuestionBlockProps = {
  index: number;
  control: Control<ScenarioFormValues>;
  register: UseFormRegister<ScenarioFormValues>;
  watch: UseFormWatch<ScenarioFormValues>;
  setValue: UseFormSetValue<ScenarioFormValues>;
  editorKey: number;
  attachedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function QuestionBlock({
  index,
  control,
  register,
  watch,
  setValue,
  editorKey,
  attachedFile,
  fileInputRef,
  onFileChange,
}: QuestionBlockProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.answers` as `questions.${number}.answers`,
  });

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      {/* Question number badge */}
      {index > 0 && (
        <div className="flex items-center gap-3">
          <span className="bg-[#01503b] text-white text-sm font-bold px-3 py-1 rounded-full">
            Question {index + 1}
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      )}

      {/* Question Title */}
      {/* <div className="space-y-2">
        <Label className="text-md font-bold">Question Title</Label>
        <Input
          {...register(`questions.${index}.questionTitle` as const, {
            required: true,
          })}
          placeholder="Enter question title"
        />
      </div> */}

      {/* Question Stem */}
      <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
        Question Stem
      </h2>
      <RichTextEditor
        key={`qs-stem-${index}-${editorKey}`}
        value={watch(`questions.${index}.questionStem` as const)}
        onChange={(val: string) =>
          setValue(`questions.${index}.questionStem` as const, val)
        }
      />

      {/* Answer Choices */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-bold">Answer Choices</label>
          <Button
            variant="outline"
            className="border-none font-bold bg-white font-[manrope] text-[#01503b] hover:bg-white hover:border-none cursor-pointer"
            type="button"
            onClick={() =>
              append({ id: Date.now().toString(), text: '', isCorrect: false })
            }
          >
            Add Option
          </Button>
        </div>

        {fields.map((field, aIdx) => (
          <div
            key={field.id}
            className="flex items-center gap-3 p-3 border rounded-lg bg-white"
          >
            <input
              type="radio"
              name={`correctAnswer-${index}`}
              checked={watch(
                `questions.${index}.answers.${aIdx}.isCorrect` as const,
              )}
              onChange={() => {
                fields.forEach((_, i) =>
                  setValue(
                    `questions.${index}.answers.${i}.isCorrect` as const,
                    i === aIdx,
                  ),
                );
              }}
              className="w-4 h-4 accent-[#01503b]"
            />
            <span className="text-gray-400">
              {String.fromCharCode(65 + aIdx)}.
            </span>
            <Input
              {...register(`questions.${index}.answers.${aIdx}.text` as const)}
              placeholder="Enter choice text"
              className="border-none shadow-none focus-visible:ring-0 flex-1"
            />

            {fields.length > 2 && (
              <button
                type="button"
                onClick={() => remove(aIdx)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Delete option"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Explanation */}
      <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
        Explanation
      </h2>
      <RichTextEditor
        key={`qs-exp-${index}-${editorKey}`}
        value={watch(`questions.${index}.explanation` as const)}
        onChange={(v: string) =>
          setValue(`questions.${index}.explanation` as const, v)
        }
      />

      {/* Why Incorrect */}
      <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
        Why The Other Options Are Incorrect
      </h2>
      <RichTextEditor
        key={`qs-key-${index}-${editorKey}`}
        value={watch(`questions.${index}.keyPoints` as const)}
        onChange={(v: string) =>
          setValue(`questions.${index}.keyPoints` as const, v)
        }
      />

      {/* Pimping Point */}
      <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
        Pimping Point
      </h2>
      <RichTextEditor
        key={`qs-pimp-${index}-${editorKey}`}
        value={watch(`questions.${index}.keepingPoint` as const)}
        onChange={(v: string) =>
          setValue(`questions.${index}.keepingPoint` as const, v)
        }
      />

      {/* Memory Trick */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          Memory Trick
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="text-sm font-semibold text-gray-600">Enable</span>
          <input
            type="checkbox"
            checked={watch(`questions.${index}.hasMemoryTrick` as const)}
            onChange={e => {
              setValue(
                `questions.${index}.hasMemoryTrick` as const,
                e.target.checked,
              );
              if (!e.target.checked)
                setValue(`questions.${index}.memoryTrick` as const, '');
            }}
            className="w-5 h-5 accent-[#01503b] cursor-pointer"
          />
        </label>
      </div>
      {watch(`questions.${index}.hasMemoryTrick` as const) && (
        <RichTextEditor
          key={`qs-mem-${index}-${editorKey}`}
          value={watch(`questions.${index}.memoryTrick` as const)}
          onChange={(v: string) =>
            setValue(`questions.${index}.memoryTrick` as const, v)
          }
        />
      )}

      {/* References */}
      <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
        References
      </h2>
      <RichTextEditor
        key={`qs-ref-${index}-${editorKey}`}
        value={watch(`questions.${index}.referance` as const) ?? ''}
        onChange={(v: string) =>
          setValue(`questions.${index}.referance` as const, v)
        }
      />

      {/* File attachment on first question only */}
      {index === 0 && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer md:px-6 px-3 py-2 md:py-4 rounded-[8px] border border-[#01503b] text-[#01503b] md:text-[20px] text-sm font-semibold"
          >
            Attach Explanation Image
          </button>
          {attachedFile && (
            <span className="text-green-600 text-sm font-medium">
              Attached: {attachedFile.name}
            </span>
          )}
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function CreateQuestionForm() {
  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<ScenarioFormValues>({
      defaultValues: {
        difficulty: 'Intern',
        topic: 'Anesthesia_Medicine',
        questions: [blankQuestion()],
      },
    });

  const { fields: questionFields, append: appendQuestion } = useFieldArray({
    control,
    name: 'questions',
  });

  const [editorKey, setEditorKey] = React.useState(0);
  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAttachedFile(e.target.files[0]);
      toast.success(`File "${e.target.files[0].name}" attached!`);
    }
  };

  const onSubmit = async (data: ScenarioFormValues) => {
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      if (!q.answers.some(a => a.isCorrect)) {
        toast.error(`Question ${i + 1}: Please select a correct answer`);
        return;
      }
      if (q.answers.length < 2) {
        toast.error(`Question ${i + 1}: At least two answer options required`);
        return;
      }
    }

    try {
      for (const q of data.questions) {
        const formData = new FormData();
        // formData.append('question_title', q.questionTitle);
        formData.append('question_steam', q.questionStem);
        formData.append('explanation', q.explanation ?? '');
        formData.append('why_incorrect', q.keyPoints ?? '');
        formData.append('pimping_point', q.keepingPoint ?? '');
        formData.append('memory_trick', q.memoryTrick ?? '');
        formData.append('referance', q.referance ?? '');
        formData.append('difficulty', data.difficulty);
        formData.append('topic', JSON.stringify([data.topic]));
        formData.append(
          'answerOptions',
          JSON.stringify(
            q.answers.map(a => ({
              option_text: a.text,
              is_correct: a.isCorrect,
            })),
          ),
        );
        if (attachedFile) formData.append('explanation_image', attachedFile);

        const result = await createQuestion(formData);
        if (!('data' in result)) {
          toast.error('Failed to create one or more questions');
          return;
        }
      }

      toast.success(
        `${data.questions.length} question(s) created successfully!`,
      );
      reset({
        difficulty: 'Intern',
        topic: 'Anesthesia_Medicine',
        questions: [blankQuestion()],
      });
      setEditorKey(prev => prev + 1);
      setAttachedFile(null);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl space-y-8 font-[manrope] bg-gray-50/50"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-[48px] leading-[120%] font-bold text-[#01281e]">
          Create Questions
        </h1>
        <p className="text-[12px] md:text-[18px] leading-[120%] font-normal text-[#6b7280]">
          Add a new question to the question bank
        </p>
      </div>

      {/* Shared Difficulty & Topic */}
      <TagSelector
        label="Difficulty"
        options={DIFFICULTIES}
        selected={watch('difficulty')}
        onChange={(val: string) => setValue('difficulty', val as Difficulty)}
      />
      <TagSelector
        label="Topic"
        options={TOPICS.map(t => t.label)} 
        selected={TOPICS.find(t => t.value === watch('topic'))?.label || ''}
        onChange={(selectedLabel: string) => {
          const topic = TOPICS.find(t => t.label === selectedLabel);
          setValue('topic', topic?.value || '');
        }}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          Write Questions
        </h2>
      </div>

      {/* Render all scenario questions */}
      {questionFields.map((field, index) => (
        <QuestionBlock
          key={field.id}
          index={index}
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          editorKey={editorKey}
          attachedFile={attachedFile}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />
      ))}

      {/* Add More Questions For The Same Scenario */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => appendQuestion(blankQuestion())}
          className="cursor-pointer md:px-6 px-3 py-2 md:py-4 rounded-[8px] border border-[#01503b] text-[#01503b] md:text-[20px] text-sm font-semibold hover:bg-[#01503b]/5 transition-colors"
        >
          + Add More Questions For The Same Scenario
        </button>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer text-white px-8 py-3 rounded-[8px] bg-[#01503b] disabled:opacity-60"
      >
        {isLoading
          ? 'Submitting…'
          : `Submit${questionFields.length > 1 ? ` (${questionFields.length} Questions)` : ''}`}
      </button>
    </form>
  );
}
