'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { TagSelector } from './TagSelector';
import { QuestionField } from './QuestionField';
import { QuestionFormValues, Difficulty } from '@/types/question';
import { RichTextEditor } from './RichTextEditor';

const TOPICS = [
  'Anesthesia/Medicine',
  'Cancer',
  'Trauma',
  'TMJ',
  'Pathology',
  'Implants',
  'Dentoalveolar',
  'Cosmetics',
  'Reconstruction',
  'Orthognathic',
];
const DIFFICULTIES: Difficulty[] = ['Intern', 'Boards', 'Senior'];

export default function CreateQuestionForm() {
  const { register, control, handleSubmit, watch, setValue } =
    useForm<QuestionFormValues>({
      defaultValues: {
        difficulty: 'Intern',
        topic: 'Anatomy & Medicine',
        answers: [
          { id: '1', text: '', isCorrect: false },
          { id: '2', text: '', isCorrect: true },
        ],
      },
    });

  const { fields, append } = useFieldArray({ control, name: 'answers' });

  const onSubmit = (data: QuestionFormValues) => {
    console.log('Form Data Submitted:', data);
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

      <div className="bg-white p-6 rounded-lg border space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-[24px] leading-[130%] text-[#01281e] font-bold">
            Write Questions
          </h2>
          <button className="bg-[#01503b] px-6 py-3 rounded-[8px] cursor-pointer font-bold text-white">
            Create New
          </button>
        </div>

        
          <RichTextEditor
            value={watch('questionStem')}
            onChange={val => setValue('questionStem', val)}
          />
        

        <div className="space-y-2 ">
          <label className="text-[16px] font-bold">Question Title</label>
          <Input
            {...register('questionTitle')}
            placeholder="Which document is used for legal identification?"
            className="h-12"
          />
        </div>

        {/* Answer Choices */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="font-bold">Answer Choices</label>
            <button
              type="button"
              className="text-emerald-600 text-sm font-bold underline"
            >
              Edit Answer
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-white"
            >
              <Checkbox
                checked={watch(`answers.${index}.isCorrect`)}
                onCheckedChange={checked => {
                  // Logic to ensure only one is correct if desired
                  setValue(`answers.${index}.isCorrect`, !!checked);
                }}
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
        <QuestionField
          label="Explanation"
          value={watch('explanation')}
          onChange={v => setValue('explanation', v)}
        />
        <QuestionField
          label="Key Points"
          value={watch('keyPoints')}
          onChange={v => setValue('keyPoints', v)}
        />
        <QuestionField
          label="Keeping Point"
          value={watch('keepingPoint')}
          onChange={v => setValue('keepingPoint', v)}
        />
        <QuestionField
          label="Memory Trick"
          value={watch('memoryTrick')}
          onChange={v => setValue('memoryTrick', v)}
        />
        <QuestionField
          label="References"
          value={watch('references')}
          onChange={v => setValue('references', v)}
        />

        <div className="flex flex-col items-center pt-6 gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() =>
              append({ id: Date.now().toString(), text: '', isCorrect: false })
            }
          >
            Add New Question to the same board
          </Button>
          <Button type="submit" className="w-24 bg-[#01503b]">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
