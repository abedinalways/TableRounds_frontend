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
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Lightbulb,
  XCircle,
  Target,
  Brain,
  BookOpen,
} from 'lucide-react';
import { parseMasterQuestion } from '@/utils/explanationParser';

const DIFFICULTIES: Difficulty[] = ['Intern', 'Senior', 'Board'];

type ExplanationTabKey =
  | 'explanation'
  | 'keyPoints'
  | 'keepingPoint'
  | 'memoryTrick'
  | 'referance';

interface HighYieldTabConfig {
  key: ExplanationTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  fieldName: 'explanation' | 'keyPoints' | 'keepingPoint' | 'memoryTrick' | 'referance';
  allowImageUpload?: boolean;
}

const HIGH_YIELD_TABS: HighYieldTabConfig[] = [
  {
    key: 'explanation',
    label: 'General Explanation',
    icon: Lightbulb,
    description: 'Clinical reasoning, key principles, and why the correct answer is right.',
    fieldName: 'explanation',
    allowImageUpload: true,
  },
  {
    key: 'keyPoints',
    label: 'Why Incorrect',
    icon: XCircle,
    description: 'Detailed explanation of why each incorrect distractor is wrong.',
    fieldName: 'keyPoints',
  },
  {
    key: 'keepingPoint',
    label: 'Pimping Point',
    icon: Target,
    description: 'High-yield clinical pearl or attending rounds question for fast recall.',
    fieldName: 'keepingPoint',
  },
  {
    key: 'memoryTrick',
    label: 'Memory Trick',
    icon: Brain,
    description: 'Mnemonic, acronym, or memory anchor to easily recall the concept.',
    fieldName: 'memoryTrick',
  },
  {
    key: 'referance',
    label: 'References',
    icon: BookOpen,
    description: 'Medical guidelines, textbooks, PubMed IDs, or study citations.',
    fieldName: 'referance',
  },
];

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

  const [activeTab, setActiveTab] =
    React.useState<ExplanationTabKey>('explanation');

  // Master 1-Click Importer state
  const [masterPasteText, setMasterPasteText] = React.useState<string>('');
  const [isMasterOpen, setIsMasterOpen] = React.useState<boolean>(true);
  const [lastImportedStats, setLastImportedStats] = React.useState<{
    optionsCount: number;
    correctLetter: string | null;
    stemWords: number;
    hasExplanation: boolean;
  } | null>(null);

  const activeTabConfig = React.useMemo(() => {
    return (
      HIGH_YIELD_TABS.find(t => t.key === activeTab) || HIGH_YIELD_TABS[0]
    );
  }, [activeTab]);

  const watchedExplanation = watch('explanation');
  const watchedKeyPoints = watch('keyPoints');
  const watchedKeepingPoint = watch('keepingPoint');
  const watchedMemoryTrick = watch('memoryTrick');
  const watchedReferance = watch('referance');

  const filledSectionsCount = React.useMemo(() => {
    const list = [
      watchedExplanation,
      watchedKeyPoints,
      watchedKeepingPoint,
      watchedMemoryTrick,
      watchedReferance,
    ];
    return list.filter(
      val =>
        typeof val === 'string' &&
        val.replace(/<[^>]+>/g, '').trim().length > 0,
    ).length;
  }, [
    watchedExplanation,
    watchedKeyPoints,
    watchedKeepingPoint,
    watchedMemoryTrick,
    watchedReferance,
  ]);

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

      formData.append(
        'explanation',
        prepareEditorHtmlForPayload(data.explanation || '', explanationImageFile),
      );

      formData.append('why_incorrect', data.keyPoints || '');
      formData.append('pimping_point', data.keepingPoint || '');
      formData.append('memory_trick', data.memoryTrick || '');
      formData.append('referance', data.referance || '');
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
      setActiveTab('explanation');
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

      {/* ── Explanation & High-Yield Sections ── */}
      <div className="pt-6 border-t font-[manrope] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg md:text-[22px] font-bold text-[#01281e] flex items-center gap-2">
              Explanation & High-Yield Sections
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Select any tab below to review or fine-tune each section. Auto-populated instantly from the Master Importer.
            </p>
          </div>

          {/* Quick summary badge */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 bg-[#f0f9f6] border border-[#a3ded0] rounded-full text-xs font-semibold text-[#01503b]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{filledSectionsCount} of 5 Sections Populated</span>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {HIGH_YIELD_TABS.map(tab => {
            const isSelected = activeTab === tab.key;
            const content = watch(tab.fieldName);
            const hasContent = Boolean(
              content &&
                typeof content === 'string' &&
                content.replace(/<[^>]+>/g, '').trim().length > 0,
            );

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#01503b] text-white border-[#01503b] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <tab.icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-amber-300' : 'text-gray-500'
                  }`}
                />
                <span>{tab.label}</span>
                {hasContent ? (
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    ✓ Filled
                  </span>
                ) : (
                  <span
                    className={`text-[10px] ${
                      isSelected ? 'text-white/60' : 'text-gray-400'
                    }`}
                  >
                    Optional
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Helper / Description bar */}
        {activeTabConfig && (
          <div className="flex items-center justify-between gap-3 p-3 bg-[#f8faf9] border border-gray-200/70 rounded-xl text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <activeTabConfig.icon className="w-4 h-4 text-[#01503b] shrink-0" />
              <span>{activeTabConfig.description}</span>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
              Field:{' '}
              {activeTabConfig.fieldName === 'keyPoints'
                ? 'why_incorrect'
                : activeTabConfig.fieldName === 'keepingPoint'
                  ? 'pimping_point'
                  : activeTabConfig.fieldName}
            </span>
          </div>
        )}

        {/* Tab Editor Display */}
        {HIGH_YIELD_TABS.map(tab => {
          if (tab.key !== activeTab) return null;
          return (
            <div key={tab.key} className="space-y-2">
              <RichTextEditor
                key={`${tab.key}-${editorKey}`}
                value={watch(tab.fieldName) || ''}
                onChange={v =>
                  setValue(tab.fieldName, v, { shouldDirty: true })
                }
                allowImageUpload={tab.allowImageUpload}
                onImageFileChange={
                  tab.allowImageUpload ? setExplanationImageFile : undefined
                }
              />
            </div>
          );
        })}
      </div>

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
