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
import {
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  parseAllInOneExplanation,
  parseMasterQuestion,
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

  // Master 1-Click Importer state
  const [masterPasteText, setMasterPasteText] = React.useState<string>('');
  const [isMasterOpen, setIsMasterOpen] = React.useState<boolean>(true);
  const [lastImportedStats, setLastImportedStats] = React.useState<{
    optionsCount: number;
    correctLetter: string | null;
    stemWords: number;
    hasExplanation: boolean;
  } | null>(null);

  const parsedAllInOne = React.useMemo(() => {
    return parseAllInOneExplanation(allInOneText);
  }, [allInOneText]);

  const sectionMetas = React.useMemo(() => {
    return getSectionMetas(parsedAllInOne);
  }, [parsedAllInOne]);

  const detectedCount = React.useMemo(() => {
    return sectionMetas.filter(m => m.detected).length;
  }, [sectionMetas]);

  const handleApplyMasterImport = (text: string) => {
    if (!text.trim()) {
      toast.error('Please paste your question text into the box first');
      return;
    }

    const parsed = parseMasterQuestion(text);

    if (!parsed.hasMasterContent) {
      toast.error('Could not detect question content from the pasted text');
      return;
    }

    // 1. Populate Question Stem
    if (parsed.stemHtml) {
      setValue('questionStem', parsed.stemHtml, { shouldDirty: true });
    }

    // 2. Populate Answer Choices (A, B, C, D, E...)
    if (parsed.options.length > 0) {
      setValue(
        'answers',
        parsed.options.map((opt, index) => ({
          id: (Date.now() + index).toString(),
          text: opt.text,
          isCorrect: opt.isCorrect,
        })),
        { shouldDirty: true },
      );
    }

    // 3. Populate Explanation sections
    if (parsed.rawExplanationHtml) {
      setAllInOneText(parsed.rawExplanationHtml);
      setValue('explanation', parsed.explanation.explanation, {
        shouldDirty: true,
      });
      setValue('keyPoints', parsed.explanation.keyPoints, {
        shouldDirty: true,
      });
      setValue('keepingPoint', parsed.explanation.keepingPoint, {
        shouldDirty: true,
      });
      setValue('memoryTrick', parsed.explanation.memoryTrick, {
        shouldDirty: true,
      });
      setValue('referance', parsed.explanation.referance, {
        shouldDirty: true,
      });
    }

    // Re-mount editors to reflect newly imported HTML immediately
    setEditorKey(prev => prev + 1);

    const plainStem = parsed.stemHtml.replace(/<[^>]+>/g, '').trim();
    const stemWordCount = plainStem ? plainStem.split(/\s+/).length : 0;

    setLastImportedStats({
      optionsCount: parsed.options.length,
      correctLetter: parsed.correctLetter,
      stemWords: stemWordCount,
      hasExplanation: Boolean(parsed.rawExplanationHtml),
    });

    toast.success(
      `Imported! Stem, ${parsed.options.length} options, and explanations populated below.`,
    );
  };

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
      setMasterPasteText('');
      setLastImportedStats(null);
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

      {/* ── Master 1-Click Question Importer ── */}
      <div className="rounded-2xl border-2 border-[#01503b]/20 bg-gradient-to-br from-[#f0f9f6] via-white to-[#f0f9f6] p-5 shadow-sm transition-all font-[manrope]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
           
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-[#01281e]">
                  Master 1-Click Question Importer
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-[#cdebe3] text-[#01503b] rounded-md">
                  All-in-One Paste
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Paste the entire question (Stem + Choices A-E + Full Explanation) here. We will auto-fill every field below instantly.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMasterOpen(prev => !prev)}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            title={isMasterOpen ? 'Collapse Importer' : 'Expand Importer'}
          >
            {isMasterOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {isMasterOpen && (
          <div className="mt-4 space-y-3 pt-3 border-t border-gray-200/60">
            <textarea
              value={masterPasteText}
              onChange={e => setMasterPasteText(e.target.value)}
              placeholder={`Paste your entire question block here... e.g.:

A 45-year-old woman presents with tingling and numbness in her right hand...
Which of the following is the most likely diagnosis?

A. Median neuropathy at the wrist
*B. C6 radiculopathy
C. Lower trunk brachial plexopathy
D. Ulnar neuropathy at the elbow
E. Upper trunk brachial plexopathy

Explanation:
This presentation is most consistent with median neuropathy...

Incorrect Answers:
• C6 radiculopathy: ...
• Lower trunk brachial plexopathy: ...

Pimping Point:
...

Memory Trick:
...

References:
...`}
              rows={8}
              className="w-full text-xs sm:text-sm font-mono p-3.5 bg-white border border-gray-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-[#01503b] focus:border-transparent resize-y"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyMasterImport(masterPasteText)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#01503b] hover:bg-[#013d2d] text-white text-xs sm:text-sm font-semibold rounded-lg shadow transition-all cursor-pointer"
                >
               
                  <span>Auto-Fill Entire Form</span>
                </button>

                {masterPasteText && (
                  <button
                    type="button"
                    onClick={() => {
                      setMasterPasteText('');
                      setLastImportedStats(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <span className="text-[11px] text-gray-400">
                Tip: Use *A. or (Correct) to mark the right answer automatically
              </span>
            </div>

            {/* Confirmation summary when imported */}
            {lastImportedStats && (
              <div className="p-3 bg-white border border-[#a3ded0] rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 font-bold text-[#01503b]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Successfully Populated:
                  </span>
                  <span className="px-2 py-0.5 bg-[#e6f4f0] text-[#01503b] rounded-md font-semibold">
                    Stem ({lastImportedStats.stemWords} words)
                  </span>
                  <span className="px-2 py-0.5 bg-[#e6f4f0] text-[#01503b] rounded-md font-semibold">
                    {lastImportedStats.optionsCount} Options (A-
                    {String.fromCharCode(64 + lastImportedStats.optionsCount)})
                  </span>
                  {lastImportedStats.correctLetter && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold">
                      Correct: Option {lastImportedStats.correctLetter}
                    </span>
                  )}
                  {lastImportedStats.hasExplanation && (
                    <span className="px-2 py-0.5 bg-[#e6f4f0] text-[#01503b] rounded-md font-semibold">
                      Explanations Split
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-500 italic">
                  Scroll down to review and adjust any field!
                </span>
              </div>
            )}
          </div>
        )}
      </div>

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
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 md:mr-40 outline-6">
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
