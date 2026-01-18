'use client';

import React, { useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagSelector } from './TagSelector';

import { QuestionFormValues, Difficulty } from '@/types/question';
import { RichTextEditor } from './RichTextEditor';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { InputGroup, InputGroupInput } from '../ui/input-group';

const TOPICS = [
  'Anesthesia/Medicine',
  'Cancer',
  'Cleft/Craniofacial',
  'Cosmetics',
  'Dentoalveolar',
  'Implants',
  'Orthognathic',
  'Pathology',
  'Reconstruction',
  'TMJ',
  'Trauma',
];
const DIFFICULTIES: Difficulty[] = ['Intern', 'Senior', 'Boards'];

export default function CreateQuestionForm() {
  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<QuestionFormValues>({
      defaultValues: {
        difficulty: 'Intern',
        topic: 'Anatomy & Medicine',
        hasMemoryTrick: false,
        memoryTrick:'',
        answers: [
          { id: '1', text: '', isCorrect: false },
          { id: '2', text: '', isCorrect: true },
        ],
      },
    });

  const { fields, append } = useFieldArray({ control, name: 'answers' });
  const [editorKey, setEditorKey] = React.useState(0);

  // File attachment state
  const [attachedFile, setAttachedFile] = React.useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddMoreQuestionSameScenario = () => {
    const currentDifficulty = watch('difficulty');
    const currentTopic = watch('topic');

    reset({
      difficulty: currentDifficulty,
      topic: currentTopic,
      questionStem: '',
      questionTitle: '',
      explanation: '',
      keyPoints: '',
      keepingPoint: '',
      memoryTrick: '',
      references: '',
      answers: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: true },
      ],
    });

    setEditorKey(prev => prev + 1);
    setAttachedFile(null);

    toast.success('New question added for the same scenario');
  };

  const onSubmit = (data: QuestionFormValues) => {
    console.log('Form Data Submitted:', data);
    if (attachedFile) {
      console.log('Attached File:', attachedFile);
    }
    toast.success('Question created successfully!');

    reset({
      difficulty: 'Intern',
      topic: 'Anatomy/Medicine',
      questionStem: '',
      questionTitle: '',
      explanation: '',
      keyPoints: '',
      keepingPoint: '',
      memoryTrick: '',
      references: '',
      answers: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: true },
      ],
    });
    setEditorKey(prev => prev + 1);
    setAttachedFile(null);
  };

  const handleAttachFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      toast.success(`File "${e.target.files[0].name}" attached!`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl  space-y-8 font-[manrope] bg-gray-50/50"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-[48px] leading-[120%] font-bold text-[#01281e]">
          Create Questions
        </h1>
        <p className="text-[12px] md:text-[18px] leading-[120%] font-normal text-[#6b7280]">
          Add a new question to the question bank
        </p>
      </div>

      {/* Difficulty & Topic Selectors */}
      <TagSelector
        label="Difficulty"
        options={DIFFICULTIES}
        selected={watch('difficulty')}
        onChange={val => setValue('difficulty', val as Difficulty)}
      />

      <TagSelector
        label="Topic"
        options={TOPICS}
        selected={watch('topic')}
        onChange={val => setValue('topic', val)}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          Write Questions
        </h2>
        {/* <button className="bg-[#01503b] px-6 py-3 rounded-[8px] cursor-pointer font-bold text-white">
          Create New
        </button> */}
      </div>

      <div className="bg-white p-6 rounded-lg border space-y-6">
        {/* Question ID */}
        <div className="mx-2 space-y-2">
          <Label className="text-md md:text-[20px] text-[#444950] font-bold  leading-[160%]">
            Question ID
          </Label>
          <InputGroup>
            <InputGroupInput
              {...register('questionId')}
              placeholder="Unique Question ID"
              type="number"
              className="border-none"
            />
          </InputGroup>
        </div>

        {/* Question Stem */}
        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          Question Stem
        </h2>
        <RichTextEditor
          key={`questionStem-${editorKey}`}
          value={watch('questionStem')}
          onChange={val => setValue('questionStem', val)}
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
                append({
                  id: Date.now().toString(),
                  text: '',
                  isCorrect: false,
                })
              }
            >
              Add Option
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-white"
            >
              <input
                type="radio"
                name="correctAnswer"
                checked={watch(`answers.${index}.isCorrect`)}
                onChange={() => {
                  fields.forEach((f, i) =>
                    setValue(`answers.${i}.isCorrect`, i === index),
                  );
                }}
                className="w-4 h-4 accent-[#01503b]"
              />
              <span className="text-gray-400">
                {String.fromCharCode(65 + index)}.
              </span>
              <Input
                {...register(`answers.${index}.text`)}
                placeholder="Enter choice text"
                className="border-none shadow-none focus-visible:ring-0"
              />
            </div>
          ))}
        </div>

        {/* Dynamic Fields */}
        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          Explanation
        </h2>
        <RichTextEditor
          key={`explanation-${editorKey}`}
          value={watch('explanation')}
          onChange={v => setValue('explanation', v)}
        />

        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          Why The Other Options Are Incorrect
        </h2>
        <RichTextEditor
          key={`keyPoints-${editorKey}`}
          value={watch('keyPoints')}
          onChange={v => setValue('keyPoints', v)}
        />

        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          Pimping Point
        </h2>
        <RichTextEditor
          key={`keepingPoint-${editorKey}`}
          value={watch('keepingPoint')}
          onChange={v => setValue('keepingPoint', v)}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
            Memory Trick
          </h2>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm font-semibold text-gray-600">Enable</span>
            <input
              type="checkbox"
              checked={watch('hasMemoryTrick')}
              onChange={e => {
                setValue('hasMemoryTrick', e.target.checked);
                if (!e.target.checked) {
                  setValue('memoryTrick', '');
                }
              }}
              className="w-5 h-5 accent-[#01503b] cursor-pointer"
            />
          </label>
        </div>

        {watch('hasMemoryTrick') && (
          <RichTextEditor
            key={`memoryTrick-${editorKey}`}
            value={watch('memoryTrick')}
            onChange={v => setValue('memoryTrick', v)}
          />
        )}

        <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
          References
        </h2>
        <RichTextEditor
          key={`references-${editorKey}`}
          value={watch('references')}
          onChange={v => setValue('references', v)}
        />

        <div className="flex items-center justify-center md:w-fit mx-auto">
          <button
            type="button"
            onClick={handleAttachFileClick}
            className="cursor-pointer md:px-6 px-3 py-2 md:py-4 rounded-[8px] border border-[#01503b] text-[#01503b] md:text-[20px] text-sm font-semibold"
          >
            Add More Questions For The Same Scenario
          </button>
          {attachedFile && (
            <div className="text-green-600 p-3">
              Attached: {attachedFile.name}
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <button
        type="submit"
        className="cursor-pointer text-white px-8 py-3 rounded-[8px] bg-[#01503b]"
      >
        Submit
      </button>
    </form>
  );
}
