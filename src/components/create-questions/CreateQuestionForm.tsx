'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagSelector } from './TagSelector';

import { QuestionFormValues, Difficulty } from '@/types/createQuestion';
import { RichTextEditor } from './RichTextEditor';
import { toast } from 'sonner';
import { useCreateQuestionMutation } from '@/app/redux/api/createQuestionsApi';

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

const DIFFICULTIES: Difficulty[] = ['Intern', 'Senior', 'Board'];

const prepareEditorHtmlForPayload = (
  html?: string | null,
  file?: File | null,
) => {
  const safeHtml = html || '';

  return safeHtml.replace(
    /(<img[^>]+src=["'])([^"']+)(["'][^>]*>)/gi,
    (match, before, src, after) => {
      if (src.startsWith('blob:') && file) {
        return `${before}${file.name}${after}`;
      }

      return match;
    },
  );
};

export default function CreateQuestionForm() {
  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<QuestionFormValues & { combinedExplanation?: string }>({
      defaultValues: {
        difficulty: '',
        topic: '',
        questionStem: '',
        memoryTrick: '',
        combinedExplanation: '',
        answers: [
          { id: '1', text: '', isCorrect: true },
          { id: '2', text: '', isCorrect: false },
          { id: '3', text: '', isCorrect: false },
          { id: '4', text: '', isCorrect: false },
          { id: '5', text: '', isCorrect: false },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  });

  const [editorKey, setEditorKey] = React.useState(0);
  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const [questionStemImageFile, setQuestionStemImageFile] =
    React.useState<File | null>(null);
  const [explanationImageFile, setExplanationImageFile] =
    React.useState<File | null>(null);

  const parseCombinedExplanation = (html: string) => {
    if (!html) {
      return {
        explanation: '',
        keyPoints: '',
        keepingPoint: '',
        memoryTrick: '',
        referance: '',
      };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const sections: { heading: string; content: string }[] = [];
    let currentContent: string[] = [];
    let foundFirstHeading = false;

    const processNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
          foundFirstHeading = true;
          if (currentContent.length > 0 || sections.length > 0) {
            sections.push({
              heading: sections.length > 0 ? sections[sections.length - 1].heading : '',
              content: currentContent.join('').trim(),
            });
          }
          sections.push({
            heading: el.textContent?.trim() || '',
            content: '',
          });
          currentContent = [];
        } else {
          currentContent.push(el.outerHTML);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) {
          currentContent.push(`<p>${text}</p>`);
        }
      }
    };

    Array.from(doc.body.childNodes).forEach(processNode);

    if (currentContent.length > 0) {
      if (sections.length > 0) {
        sections[sections.length - 1].content = currentContent.join('').trim();
      } else {
        sections.push({
          heading: '',
          content: currentContent.join('').trim(),
        });
      }
    }

    const result = {
      explanation: '',
      keyPoints: '',
      keepingPoint: '',
      memoryTrick: '',
      referance: '',
    };

    const headingLower = (h: string) => h.toLowerCase();

    sections.forEach(section => {
      const h = headingLower(section.heading);
      if (h.includes('why the other options are incorrect') || h.includes('incorrect')) {
        result.keyPoints = section.content;
      } else if (h.includes('pimping point')) {
        result.keepingPoint = section.content;
      } else if (h.includes('memory trick')) {
        result.memoryTrick = section.content;
      } else if (h.includes('references')) {
        result.referance = section.content;
      } else if (section.heading && !result.explanation) {
        result.explanation = section.content;
      } else if (!section.heading && !result.explanation && section.content) {
        result.explanation = section.content;
      }
    });

    if (!result.explanation && sections.length > 0) {
      const firstContent = sections[0].content;
      if (firstContent) {
        result.explanation = firstContent;
      }
    }

    return result;
  };

  const onSubmit = async (data: QuestionFormValues) => {
    if (!data.difficulty) {
      toast.error('Please select a difficulty level');
      return;
    }
    if (!data.topic) {
      toast.error('Please select a topic');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('question_title', data.questionTitle || '');
      formData.append(
        'question_steam',
        prepareEditorHtmlForPayload(data.questionStem, questionStemImageFile),
      );

      const combinedExplanation = (data as QuestionFormValues & { combinedExplanation?: string }).combinedExplanation || '';
      const parsedExplanation = parseCombinedExplanation(combinedExplanation);

      formData.append(
        'explanation',
        prepareEditorHtmlForPayload(parsedExplanation.explanation || combinedExplanation, explanationImageFile),
      );

      formData.append('why_incorrect', parsedExplanation.keyPoints || '');
      formData.append('pimping_point', parsedExplanation.keepingPoint || '');
      formData.append('memory_trick', parsedExplanation.memoryTrick || '');
      formData.append('referance', parsedExplanation.referance || '');
      formData.append('difficulty', data.difficulty);

      formData.append('topic', JSON.stringify([data.topic]));

      formData.append(
        'answerOptions',
        JSON.stringify(
          data.answers.map(a => ({
            option_text: a.text,
            is_correct: a.isCorrect,
          })),
        ),
      );

      if (questionStemImageFile) {
        formData.append('steam_image', questionStemImageFile);
      }

      if (explanationImageFile) {
        formData.append('explanation_image', explanationImageFile);
      }

      await createQuestion(formData).unwrap();

      toast.success('Question created successfully!');

      reset();
      setEditorKey(prev => prev + 1);
      setQuestionStemImageFile(null);
      setExplanationImageFile(null);
    } catch (error) {
      const message = error && typeof error === 'object' && 'data' in error
        ? (error as { data?: { message?: string } }).data?.message
        : undefined;
      toast.error(message || 'Failed to create question');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl space-y-8 font-[manrope] bg-gray-50/50"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-[48px] leading-[120%] font-bold text-[#01281e]">
          Create Questions
        </h1>

        <p className="text-[12px] md:text-[18px] text-[#6b7280]">
          Add a new question to the question bank
        </p>
      </div>

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

      <h2 className="text-lg md:text-[24px] font-bold text-[#01281e]">
        Question Stem
      </h2>

      <RichTextEditor
        key={`questionStem-${editorKey}`}
        value={watch('questionStem') || ''}
        allowImageUpload
        onChange={val => setValue('questionStem', val)}
        onImageFileChange={setQuestionStemImageFile}
      />

      <div className="space-y-4">
        <div className="flex justify-between">
          <label className="font-bold">Answer Choices</label>

          <Button
            type="button"
            variant="outline"
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
              checked={watch(`answers.${index}.isCorrect`) || false}
              onChange={() =>
                fields.forEach((_, i) =>
                  setValue(`answers.${i}.isCorrect`, i === index),
                )
              }
              className="w-4 h-4 accent-[#01503b]"
            />

            <span className="text-gray-400">
              {String.fromCharCode(65 + index)}.
            </span>

            <Input
              {...register(`answers.${index}.text`)}
              placeholder="Enter choice text"
              className="border-none shadow-none focus-visible:ring-0 flex-1"
            />

            {fields.length > 2 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-lg md:text-[24px] font-bold text-[#01281e]">
        Explanation & Additional Notes
      </h2>
      <p className="text-sm text-gray-500 mb-2">
        Use headings (H1-H6) to separate sections: Why The Other Options Are Incorrect, Pimping Point, Memory Trick, References
      </p>

      <RichTextEditor
        key={`combinedExplanation-${editorKey}`}
        value={watch('combinedExplanation') || ''}
        onChange={v => setValue('combinedExplanation', v)}
        allowImageUpload
        onImageFileChange={setExplanationImageFile}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="cursor-pointer text-white px-8 py-3 rounded-[8px] bg-[#01503b]"
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
