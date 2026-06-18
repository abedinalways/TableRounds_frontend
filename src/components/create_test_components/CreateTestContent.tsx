

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomCheckbox } from '../ui/CustomCheckbox';

import { useStartTestMutation } from '@/app/redux/api/startTestApi';
import { useGetQuestionCountQuery } from '@/app/redux/api/testSessionApi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

const TOPICS = [
  { label: 'Anesthesia/Medicine', value: 'Anesthesia_Medicine' },
  { label: 'Dentoalveolar', value: 'Dentoalveolar' },
  { label: 'Reconstruction', value: 'Recontraction' },
  { label: 'Cancer', value: 'Cancer' },
  { label: 'Implants', value: 'Implants' },
  { label: 'TMJ', value: 'TMJ' },
  { label: 'Cleft/Craniofacial', value: 'Cleft_Craniofacial' },
  { label: 'Orthognathic', value: 'Orthognathic' },
  { label: 'Trauma', value: 'Trauma' },
  { label: 'Cosmetics', value: 'Cosmetics' },
  { label: 'Pathology', value: 'Pathology' },
] as const;

const DIFFICULTY_LEVELS = ['Intern', 'Senior', 'Board'] as const;

type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

const displayDifficultyLabel = (difficulty: string): string => {
  if (difficulty === 'Board') return 'Boards';
  return difficulty;
};

export function CreateTestContent() {
  const router = useRouter();
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState('');

  const [isStarted, setIsStarted] = useState(false);

  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    TOPICS.map(topic => topic.value),
  );

  const [selectedDifficulty, setSelectedDifficulty] = useState<
    DifficultyLevel[]
  >([...DIFFICULTY_LEVELS]);

  const [selectedStatus, setSelectedStatus] = useState<string[]>(['Unused']);
  const [numQuestions, setNumQuestions] = useState<string>('');

  const [startTest, { isLoading }] = useStartTestMutation();

  const {
    data: questionCountData,
    isLoading: isQuestionCountLoading,
    isFetching: isQuestionCountFetching,
    refetch: refetchQuestionCount,
  } = useGetQuestionCountQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    refetchQuestionCount();
  }, [refetchQuestionCount]);

  const handleTopicToggle = (topicValue: string, checked: boolean) => {
    setSelectedTopics(prev =>
      checked
        ? prev.includes(topicValue)
          ? prev
          : [...prev, topicValue]
        : prev.filter(t => t !== topicValue),
    );
  };

  const allTopicsSelected = selectedTopics.length === TOPICS.length;

  const handleToggleAllTopics = () => {
    setSelectedTopics(
      allTopicsSelected ? [] : TOPICS.map(topic => topic.value),
    );
  };

  const allDifficultiesSelected =
    selectedDifficulty.length === DIFFICULTY_LEVELS.length;

  const handleToggleAllDifficulties = () => {
    setSelectedDifficulty(
      allDifficultiesSelected ? [] : [...DIFFICULTY_LEVELS],
    );
  };

  const handleStatusToggle = (status: string, checked: boolean) => {
    setSelectedStatus(prev =>
      checked ? [...prev, status] : prev.filter(s => s !== status),
    );
  };

  const handleDifficultySelect = (level: DifficultyLevel) => {
    setSelectedDifficulty(prev =>
      prev.includes(level) ? prev.filter(d => d !== level) : [...prev, level],
    );
  };

  const isQuestionCountUpdating =
    isQuestionCountLoading || isQuestionCountFetching;

  // --- CLIENT-SIDE DEDUPLICATION CALCULATION ENGINE ---

  // Helper mapping to grab state segments from server payload safely
  const getStatusArray = (status: string) => {
    if (!questionCountData?.data) return [];
    switch (status) {
      case 'Used':
        return questionCountData.data.used_questions || [];
      case 'Unused':
        return questionCountData.data.unused_questions || [];
      case 'Correct':
        return questionCountData.data.correct_count || [];
      case 'Incorrect':
        return questionCountData.data.incorrect_count || [];
      case 'Marked':
        return questionCountData.data.mark_count || [];
      default:
        return [];
    }
  };

  // 1. Calculate unique question counts for a Test Mode pill based on selected Difficulties + Topics
  const getDynamicStatusCount = (statusName: string): number => {
    const statusGroups = getStatusArray(statusName);
    const uniqueIds = new Set<string>();

    statusGroups.forEach(group => {
      if (selectedDifficulty.includes(group.difficulty)) {
        group.topic_wise_count.forEach(t => {
          if (selectedTopics.includes(t.name) && t.ids) {
            t.ids.forEach(id => uniqueIds.add(id));
          }
        });
      }
    });
    return uniqueIds.size;
  };

  // 2. Calculate unique question counts for a Difficulty item based on selected Test Modes + Topics
  const getDynamicDifficultyCount = (level: DifficultyLevel): number => {
    const uniqueIds = new Set<string>();

    selectedStatus.forEach(status => {
      const statusGroups = getStatusArray(status);
      const targetGroup = statusGroups.find(g => g.difficulty === level);
      if (targetGroup) {
        targetGroup.topic_wise_count.forEach(t => {
          if (selectedTopics.includes(t.name) && t.ids) {
            t.ids.forEach(id => uniqueIds.add(id));
          }
        });
      }
    });
    return uniqueIds.size;
  };

  // 3. Calculate unique question counts for a Topic item based on selected Test Modes + Difficulties
  const getDynamicTopicCount = (topicValue: string): number => {
    const uniqueIds = new Set<string>();

    selectedStatus.forEach(status => {
      const statusGroups = getStatusArray(status);
      statusGroups.forEach(group => {
        if (selectedDifficulty.includes(group.difficulty)) {
          const matchedTopic = group.topic_wise_count.find(
            t => t.name === topicValue,
          );
          if (matchedTopic && matchedTopic.ids) {
            matchedTopic.ids.forEach(id => uniqueIds.add(id));
          }
        }
      });
    });
    return uniqueIds.size;
  };

  const handleStartTest = async (): Promise<boolean> => {
    if (!numQuestions || selectedTopics.length === 0) {
      toast.error('Please select Question Count');
      return false;
    }

    const payload = {
      total_questions: Number(numQuestions),
      test_mode: selectedStatus
        .filter(s =>
          ['Used', 'Unused', 'Marked', 'Correct', 'Incorrect'].includes(s),
        )
        .map(s => s.toLowerCase()),
      difficulty: selectedDifficulty,
      topic: selectedTopics,
    };

    try {
      const res = await startTest(payload).unwrap();

      if (!res.success || !res.data) {
        
        if (res.message?.toLowerCase().includes('subscribe')) {
          setLimitMessage(res.message);
          setLimitModalOpen(true);
          return false;
        }
        throw new Error(res.message || 'Failed to create test');
      }

      router.push(`/dashboard/user/create-test/${res.data.id}`);
      return true;
    } catch (error) {
      console.error('Start test failed:', error);
      toast.error('Failed to start test. Please try again.');
      return false;
    }
  };

  return (
    <>
      <div className="flex-1 max-w-5xl space-y-4 pt-2 test-container text-[#4b5563]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
          <h2 className="md:text-[48px] text-3xl text-[#01281e] leading-[130%] font-bold">
            Create Test
          </h2>
        </div>

        <p className="text-sm md:text-[18px] text-[#444950] leading-[160%] font-normal">
          Configure your test parameters and get started
        </p>

        <div className="space-y-4 w-[280px] md:w-[720px] xl:w-[914px]">
          <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
            <h3 className="text-xl md:text-2xl text-[#444950] font-bold">
              Question Count
            </h3>
            <p>Set the number of questions for your test</p>
            <Select value={numQuestions} onValueChange={setNumQuestions}>
              <SelectTrigger className="w-full sm:w-[180px] h-[61px] bg-[#f7f7f3] p-4 rounded-[8px] cursor-pointer">
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={String(num)}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
            <h3 className="text-xl md:text-2xl text-[#444950] font-bold">
              Test Mode
            </h3>

            <div className="flex flex-wrap gap-3 pt-4">
              {['Unused', 'Used', 'Correct', 'Incorrect', 'Marked'].map(
                status => (
                  <div
                    key={status}
                    className="flex items-center space-x-2 bg-[#f8f8f4] px-4 py-2 rounded-[8px]"
                  >
                    <CustomCheckbox
                      checked={selectedStatus.includes(status)}
                      onCheckedChange={c =>
                        handleStatusToggle(status, Boolean(c))
                      }
                    />

                    <Label>{status}</Label>

                    <span className="min-w-[30px] h-[22px] px-2 rounded-[6px] border border-[#00B977] text-[#00B977] text-xs font-medium flex items-center justify-center bg-white">
                      {isQuestionCountUpdating
                        ? '...'
                        : getDynamicStatusCount(status)}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl md:text-[24px] font-bold text-[#444950]">
                Difficulty
              </h3>

              <button
                type="button"
                onClick={handleToggleAllDifficulties}
                className="text-[#01503b] border border-[#01503b] px-3 py-1.5 rounded-[8px] text-sm font-medium cursor-pointer hover:bg-[#01503b] hover:text-white transition"
              >
                {allDifficultiesSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              {DIFFICULTY_LEVELS.map(level => {
                const isSelected = selectedDifficulty.includes(level);

                return (
                  <div
                    key={level}
                    className="flex items-center gap-2 bg-[#f8f8f4] px-4 py-2 rounded-[8px] cursor-pointer"
                    onClick={() => handleDifficultySelect(level)}
                  >
                    <CustomCheckbox checked={isSelected} />
                    <span className="flex gap-2 items-center">
                      {displayDifficultyLabel(level)}{' '}
                      <span className="min-w-[30px] h-[22px] px-2 rounded-[6px] border border-[#00B977] text-[#00B977] text-xs font-medium flex items-center justify-center bg-white">
                        {isQuestionCountUpdating
                          ? '...'
                          : getDynamicDifficultyCount(level)}
                      </span>
                    </span>{' '}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl md:text-[24px] font-bold text-[#444950]">
                Topic
              </h3>

              <button
                type="button"
                onClick={handleToggleAllTopics}
                className="text-[#01503b] border border-[#01503b] px-3 py-1.5 rounded-[8px] text-sm font-medium cursor-pointer hover:bg-[#01503b] hover:text-white transition"
              >
                {allTopicsSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOPICS.map(topic => {
                const isSelected = selectedTopics.includes(topic.value);

                return (
                  <div
                    key={topic.value}
                    className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                      isSelected
                        ? 'bg-[#f7f7f3] border-gray-400'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleTopicToggle(topic.value, !isSelected)}
                  >
                    <CustomCheckbox checked={isSelected} />
                    <Label className="flex gap-2 items-center">
                      {topic.label}{' '}
                      <span className="min-w-[20px] h-[22px] px-2 rounded-[6px] border border-[#00B977] text-[#00B977] text-xs font-medium flex items-center justify-center bg-white">
                        {isQuestionCountUpdating
                          ? '...'
                          : getDynamicTopicCount(topic.value)}
                      </span>
                    </Label>{' '}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={async () => {
                if (isLoading || isStarted) return;

                const started = await handleStartTest();

                if (started) {
                  setIsStarted(true);
                }
              }}
              disabled={isLoading || isStarted}
              className={cn(
                'px-6 py-3 rounded-[8px] font-semibold flex items-center justify-center gap-2 transition-all duration-200',
                isStarted
                  ? 'bg-green-600 text-white cursor-not-allowed'
                  : 'bg-[#01503b] text-white',
                isLoading || isStarted
                  ? 'opacity-60 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-[#026a4d] hover:shadow-md active:scale-[0.98]',
              )}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Starting...' : isStarted ? 'Started' : 'Start Test'}
            </button>
          </div>
        </div>
      </div>
      <Dialog open={limitModalOpen} onOpenChange={setLimitModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#01281e]">
              Free Limit Reached
            </DialogTitle>
            <DialogDescription className="text-[#444950] pt-2">
              {limitMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setLimitModalOpen(false)}
              className="px-4 py-2 rounded-[8px] border border-[#e9e9e9] text-[#444950] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/user/payment')}
              className="px-4 py-2 rounded-[8px] bg-[#01503b] text-white font-medium hover:bg-[#026a4d] cursor-pointer"
            >
              Subscribe Now
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}