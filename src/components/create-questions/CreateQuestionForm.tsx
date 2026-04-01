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

import { useCreateQuestionMutation } from '@/app/redux/api/createQuestionsApi';

// Define topics with display names
const TOPICS = [
  { value: 'Anesthesia_Medicine', label: 'Anesthesia / Medicine' },
  { value: 'Cancer', label: 'Cancer' },
  { value: 'Cleft_Craniofacial', label: 'Cleft / Craniofacial' },
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
  questionStem: string;
  explanation: string;
  keyPoints: string;
  keepingPoint: string;
  memoryTrick: string;
  referance: string;

  answers: AnswerOption[];
};

type ScenarioFormValues = {
  difficulty: Difficulty; // difficulty should be an array of selected difficulties
  topic: string;
  questions: SingleQuestionValues[];
};

// ─── Default blank question ───────────────────────────────────────────────────
const blankQuestion = (): SingleQuestionValues => ({
  questionStem: '',
  explanation: '',
  keyPoints: '',
  keepingPoint: '',
  memoryTrick: '',
  referance: '',

  answers: [
    { id: '1', text: '', isCorrect: false },
    { id: '2', text: '', isCorrect: true },
  ],
});

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function CreateQuestionForm() {
  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<ScenarioFormValues>({
      defaultValues: {
        difficulty: ['Intern'], // default as an array
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
    // Check if there is at least one difficulty selected
    if (data.difficulty.length === 0) {
      toast.error('Please select at least one difficulty');
      return;
    }

    // Validate questions and answers
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
      // Create questions
      for (const q of data.questions) {
        const formData = new FormData();
        formData.append('question_steam', q.questionStem);
        formData.append('explanation', q.explanation ?? '');
        formData.append('why_incorrect', q.keyPoints ?? '');
        formData.append('pimping_point', q.keepingPoint ?? '');
        formData.append('memory_trick', q.memoryTrick ?? '');
        formData.append('referance', q.referance ?? '');
        formData.append('difficulty', data.difficulty.join(', ')); // Pass difficulty as a comma-separated string
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
        difficulty: ['Intern'], // Reset to default difficulty
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

      {/* Difficulty & Topic Section */}
      <div className="space-y-4">
        <TagSelector
          label="Difficulty"
          options={DIFFICULTIES}
          selected={watch('difficulty')}
          onChange={(val: string) =>
            setValue('difficulty', [val as Difficulty])
          }
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
