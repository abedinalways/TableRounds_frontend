'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TagSelector } from './TagSelector';

import { QuestionFormValues, Difficulty } from '@/types/createQuestion';
import { RichTextEditor } from './RichTextEditor';
import { SpecialtyTopicSelector } from './SpecialtyTopicSelector';
import { toast } from 'sonner';
import { useCreateQuestionMutation } from '@/app/redux/api/createQuestionsApi';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  parseAllInOneExplanation,
  getSectionMetas,
  ParsedExplanation,
} from '@/utils/explanationParser';

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
    useForm<QuestionFormValues>({
      defaultValues: {
        difficulty: '',
        specialtyTopics: [],
        questionStem: '',
        memoryTrick: '',
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

  const [inputMode, setInputMode] = React.useState<'allInOne' | 'separate'>(
    'allInOne',
  );
  const [allInOneText, setAllInOneText] = React.useState<string>('');
  const [activePreviewTab, setActivePreviewTab] =
    React.useState<keyof ParsedExplanation>('explanation');

  const parsedAllInOne = React.useMemo(() => {
    return parseAllInOneExplanation(allInOneText);
  }, [allInOneText]);

  const sectionMetas = React.useMemo(() => {
    return getSectionMetas(parsedAllInOne);
  }, [parsedAllInOne]);

  const detectedCount = React.useMemo(() => {
    return sectionMetas.filter(m => m.detected).length;
  }, [sectionMetas]);

  const onSubmit = async (data: QuestionFormValues) => {
    if (!data.difficulty) {
      toast.error('Please select a difficulty level');
      return;
    }

    const specialtyTopicPairs = data.specialtyTopics;

    // Create: specialty_topics is REQUIRED — at least one speciality, and
    // every selected speciality needs a topic.
    if (specialtyTopicPairs.length === 0) {
      toast.error('Please add at least one speciality');
      return;
    }

    if (specialtyTopicPairs.some(pair => !pair.topicId)) {
      toast.error('Please select a topic for every speciality');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('question_title', data.questionTitle || '');
      formData.append(
        'question_steam',
        prepareEditorHtmlForPayload(data.questionStem, questionStemImageFile),
      );

      let finalExplanation = data.explanation || '';
      let finalWhyIncorrect = data.keyPoints || '';
      let finalPimpingPoint = data.keepingPoint || '';
      let finalMemoryTrick = data.memoryTrick || '';
      let finalReference = data.referance || '';

      if (inputMode === 'allInOne') {
        const parsed = parseAllInOneExplanation(allInOneText);
        finalExplanation = parsed.explanation;
        finalWhyIncorrect = parsed.keyPoints;
        finalPimpingPoint = parsed.keepingPoint;
        finalMemoryTrick = parsed.memoryTrick;
        finalReference = parsed.referance;
      }

      formData.append(
        'explanation',
        prepareEditorHtmlForPayload(finalExplanation, explanationImageFile),
      );

      formData.append('why_incorrect', finalWhyIncorrect);
      formData.append('pimping_point', finalPimpingPoint);
      formData.append('memory_trick', finalMemoryTrick);
      formData.append('referance', finalReference);
      formData.append('difficulty', data.difficulty);

      // Create: specialty_topics is REQUIRED — always sent, IDs only.
      formData.append(
        'specialty_topics',
        JSON.stringify(
          specialtyTopicPairs.map(pair => ({
            speciality_id: pair.specialityId,
            topic_id: pair.topicId,
          })),
        ),
      );

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
      setAllInOneText('');
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

      <SpecialtyTopicSelector
        value={watch('specialtyTopics')}
        onChange={pairs => setValue('specialtyTopics', pairs)}
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

      {/* ── Explanation & High-Yield Sections Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-6 border-t font-[manrope]">
        <div>
          <h2 className="text-lg md:text-[22px] font-bold text-[#01281e] flex items-center gap-2">
            Explanation & High-Yield Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {inputMode === 'allInOne'
              ? 'Paste your complete explanation block below. Sections (Explanation, Incorrect Answers, Pimping Point, Memory Trick, References) are automatically detected.'
              : 'Enter each section individually in its dedicated editor.'}
          </p>
        </div>

        {/* Mode Toggle Button */}
        <div className="inline-flex self-start sm:self-auto rounded-lg border border-gray-200 bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setInputMode('allInOne')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              inputMode === 'allInOne'
                ? 'bg-[#01503b] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {/* <Sparkles className="w-3.5 h-3.5" /> */}
            <span>All-in-One Box</span>
          </button>
          <button
            type="button"
            onClick={() => {
              // Prepopulate separate fields with current parsed content when switching
              if (allInOneText.trim()) {
                if (parsedAllInOne.explanation) {
                  setValue('explanation', parsedAllInOne.explanation);
                }
                if (parsedAllInOne.keyPoints) {
                  setValue('keyPoints', parsedAllInOne.keyPoints);
                }
                if (parsedAllInOne.keepingPoint) {
                  setValue('keepingPoint', parsedAllInOne.keepingPoint);
                }
                if (parsedAllInOne.memoryTrick) {
                  setValue('memoryTrick', parsedAllInOne.memoryTrick);
                }
                if (parsedAllInOne.referance) {
                  setValue('referance', parsedAllInOne.referance);
                }
              }
              setInputMode('separate');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              inputMode === 'separate'
                ? 'bg-[#01503b] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Separate Fields</span>
          </button>
        </div>
      </div>

      {inputMode === 'allInOne' ? (
        <div className="space-y-4">
          <RichTextEditor
            key={`allInOne-${editorKey}`}
            value={allInOneText}
            onChange={setAllInOneText}
            allowImageUpload
            onImageFileChange={setExplanationImageFile}
          />

          {/* Live Section Detection Preview */}
          <div className="p-4 bg-[#f8faf9] border border-[#cdebe3] rounded-xl space-y-3 font-[manrope]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#01281e]">
                  Preview Sections ({detectedCount}/5)
                </span>
                <span className="text-xs text-gray-500">
                  (Click any badge to preview extracted content)
                </span>
              </div>
              <span className="text-xs text-gray-400">
                Matches: Explanation, Incorrect Answers, Pimping Point, Memory Trick, References
              </span>
            </div>

            {/* Badges / Tabs */}
            <div className="flex flex-wrap gap-2">
              {sectionMetas.map(meta => {
                const isSelected = activePreviewTab === meta.key;
                return (
                  <button
                    key={meta.key}
                    type="button"
                    onClick={() => setActivePreviewTab(meta.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      meta.detected
                        ? isSelected
                          ? 'bg-[#01503b] text-white border-[#01503b] shadow-sm'
                          : 'bg-[#e6f4f0] text-[#01503b] border-[#a3ded0] hover:bg-[#d5eee7]'
                        : isSelected
                          ? 'bg-gray-200 text-gray-700 border-gray-400'
                          : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {meta.detected ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-300 inline-block" />
                    )}
                    <span>{meta.label}</span>
                    {meta.detected && (
                      <span className="opacity-70 text-[10px]">
                        ({meta.length} chars)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Section Preview Box */}
            <div className="bg-white border rounded-lg p-3.5 text-sm text-gray-700 min-h-20 max-h-56 overflow-y-auto">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>
                  Preview: {sectionMetas.find(s => s.key === activePreviewTab)?.label}
                </span>
                {/* <span className="text-[10px] text-gray-400 font-normal">
                  Backend Field: {activePreviewTab === 'keyPoints' ? 'why_incorrect' : activePreviewTab === 'keepingPoint' ? 'pimping_point' : activePreviewTab === 'referance' ? 'referance' : activePreviewTab === 'memoryTrick' ? 'memory_trick' : 'explanation'}
                </span> */}
              </div>
              {parsedAllInOne[activePreviewTab] ? (
                <div
                  className="prose prose-sm max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: parsedAllInOne[activePreviewTab],
                  }}
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-400 italic text-xs py-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    No content detected for {sectionMetas.find(s => s.key === activePreviewTab)?.label}. Include the heading (e.g.{' '}
                    <strong>{sectionMetas.find(s => s.key === activePreviewTab)?.label}:</strong>) in your pasted text.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Separate fields view */
        <div className="space-y-6 font-[manrope]">
          <div>
            <h3 className="text-md font-bold text-[#01281e] mb-2">Explanation</h3>
            <RichTextEditor
              key={`explanation-${editorKey}`}
              value={watch('explanation') || ''}
              onChange={v => setValue('explanation', v)}
              allowImageUpload
              onImageFileChange={setExplanationImageFile}
            />
          </div>

          <div>
            <h3 className="text-md font-bold text-[#01281e] mb-2">
              Why The Other Options Are Incorrect
            </h3>
            <RichTextEditor
              key={`keyPoints-${editorKey}`}
              value={watch('keyPoints') || ''}
              onChange={v => setValue('keyPoints', v)}
            />
          </div>

          <div>
            <h3 className="text-md font-bold text-[#01281e] mb-2">Pimping Point</h3>
            <RichTextEditor
              key={`keepingPoint-${editorKey}`}
              value={watch('keepingPoint') || ''}
              onChange={v => setValue('keepingPoint', v)}
            />
          </div>

          <div>
            <h3 className="text-md font-bold text-[#01281e] mb-2">Memory Trick</h3>
            <RichTextEditor
              key={`memoryTrick-${editorKey}`}
              value={watch('memoryTrick') || ''}
              onChange={v => setValue('memoryTrick', v)}
            />
          </div>

          <div>
            <h3 className="text-md font-bold text-[#01281e] mb-2">References</h3>
            <RichTextEditor
              key={`references-${editorKey}`}
              value={watch('referance') || ''}
              onChange={v => setValue('referance', v)}
            />
          </div>
        </div>
      )}

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
