'use client';

import { useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


import { useRouter } from 'next/navigation';
import { CustomCheckbox } from '../ui/CustomCheckbox';
import { Switch } from '../ui/CustomSwitch';


// --- Mock Data ---
const TOPICS: string[] = [
  'Anesthesia/Medicine',
  'Dentoalveolar',
  'Reconstruction',
  'Cancer',
  'Implants',
  'TMJ',
  'Cleft/Craniofacial',
  'Orthognathic',
  'Trauma',
  'Cosmetics',
  'Pathology',
];

const DIFFICULTY_LEVELS = ['Intern', 'Senior', 'Boards'] as const;

export function CreateTestContent() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(TOPICS);
  const [testMode, setTestMode] = useState<'Timed' | 'Untimed'>('Untimed');

  // ✅ Difficulty is now multi-select
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([
    'Intern',
  ]);

  const [selectedStatus, setSelectedStatus] = useState<string[]>(['Used']);
  const [numQuestions, setNumQuestions] = useState<string>('');
  const router = useRouter();

  // ✅ TOPIC toggle
  const handleTopicToggle = (topicName: string, checked: boolean) => {
    if (checked) {
      setSelectedTopics(prev => [...prev, topicName]);
    } else {
      setSelectedTopics(prev => prev.filter(t => t !== topicName));
    }
  };

  // ✅ STATUS toggle
  const handleStatusToggle = (statusName: string, checked: boolean) => {
    if (checked) {
      setSelectedStatus(prev => [...prev, statusName]);
    } else {
      setSelectedStatus(prev => prev.filter(s => s !== statusName));
    }
  };

  // ✅ DIFFICULTY toggle
  const handleDifficultyToggle = (level: string, checked: boolean) => {
    if (checked) {
      setSelectedDifficulty(prev => [...prev, level]);
    } else {
      setSelectedDifficulty(prev => prev.filter(d => d !== level));
    }
  };

  // ✅ Select All Topics
  const toggleAllTopics = () => {
    if (selectedTopics.length === TOPICS.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(TOPICS);
    }
  };

  // ✅ Select All Difficulty
  const toggleAllDifficulty = () => {
    if (selectedDifficulty.length === DIFFICULTY_LEVELS.length) {
      setSelectedDifficulty([]);
    } else {
      setSelectedDifficulty([...DIFFICULTY_LEVELS]);
    }
  };

  const handleStartTest = () => {
    router.push('create-test/1');
  };

  return (
    <div className="flex-1 max-w-5xl space-y-4 pt-2 test-container text-[#4b5563]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
        <h2 className="md:text-[48px] text-3xl text-[#01281e] leading-[130%] font-bold">
          Create Test
        </h2>
      </div>

      <p className="text-sm md:text-[18px] text-[#444950] leading-[160%] font-normal">
        Configure your test parameters and get started
      </p>

      <div className="space-y-4  w-[280px] md:w-[720px]  xl:w-[914px]">
        {/* 1. No. of Questions */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow ">
          <h3 className="text-xl md:text-2xl text-[#444950] font-bold">
            Question Count
          </h3>
          <p className="text-sm md:text-[18px] leading-[160%] font-normal text-[#01281e]">
            Set the number of questions for your test
          </p>

          <Select value={numQuestions} onValueChange={setNumQuestions}>
            <SelectTrigger className="w-full sm:w-[180px] h-[61px] bg-[#f7f7f3] p-4 rounded-[8px] cursor-pointer">
              <SelectValue
                placeholder="Select number"
                className="placeholder:text-[#4b5563] placeholder:text-[18px]"
              />
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

        {/* 2. Test Mode */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-xl md:text-2xl text-[#444950] font-bold">
            Test Mode
          </h3>
          <p className="text-md md:text-[18px] leading-[160%] font-normal text-[#01281e]">
            Choose how you want to take the test
          </p>

          <div className="flex items-center flex-wrap gap-4 text-black font-normal">
            <Label
              className={`cursor-pointer text-sm md:text-[16px] ${
                testMode === 'Timed' ? '' : ''
              }`}
            >
              Timed
            </Label>

            <Switch
              checked={testMode === 'Timed'}
              className="cursor-pointer"
              onCheckedChange={checked =>
                setTestMode(checked ? 'Timed' : 'Untimed')
              }
            />

            <Label
              className={`cursor-pointer  text-sm md:text-[16px] ${
                testMode === 'Untimed' ? '' : ''
              }`}
            >
              Untimed
            </Label>
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-3 pt-4">
            {[
              'Used',
              'Unused',
              'Correct',
              'Incorrect',
              'Omitted',
              'Marked',
            ].map(status => (
              <div
                key={status}
                className="flex items-center space-x-2 bg-[#f8f8f4]  md:px-[24px] md:py-[12px] px-[14px] py-[8px] rounded-[8px] text-sm md:text-[18px]"
              >
                <CustomCheckbox
                  className="cursor-pointer"
                  id={`status-${status}`}
                  checked={selectedStatus.includes(status)}
                  onCheckedChange={checked =>
                    handleStatusToggle(status, Boolean(checked))
                  }
                />
                <Label
                  htmlFor={`status-${status}`}
                  className="text-sm md:text-[18px]"
                >
                  {status}{' '}
                  <span className="bg-white text-[#01503b] px-2 py-0 rounded-sm text-xs border border-green-400">
                    22
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Difficulty */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-[28px] h-[28px]">
                {' '}
                <CustomCheckbox
                  className="cursor-pointer"
                  checked={
                    selectedDifficulty.length === DIFFICULTY_LEVELS.length
                  }
                  onCheckedChange={toggleAllDifficulty}
                />{' '}
              </span>{' '}
              <span className="text-xl md:text-[24px] text-[#444950] font-bold">
                Difficulty
              </span>
            </h3>
          </div>

          <p className="text-sm md:text-[18px] leading-[160%] text-[#01281e] font-normal">
            Select the difficulty level for your test
          </p>

          <div className="flex flex-wrap gap-4 md:mt-[28px]">
            {DIFFICULTY_LEVELS.map(level => {
              const isSelected = selectedDifficulty.includes(level);
              return (
                <div
                  key={level}
                  className="flex items-center space-x-2 bg-[#f8f8f4] md:px-[24px] md:py-[12px] px-[14px] py-[8px] rounded-[8px] text-sm md:text-[18px] cursor-pointer"
                  onClick={() => handleDifficultyToggle(level, !isSelected)}
                >
                  <CustomCheckbox
                    checked={isSelected}
                    className="cursor-pointer"
                  />
                  <span className="text-sm md:text-[18px]">{level}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Topic Selection */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-[24px] text-[#444950] font-bold flex items-center gap-2">
              <CustomCheckbox
                className="cursor-pointer"
                checked={selectedTopics.length === TOPICS.length}
                onCheckedChange={toggleAllTopics}
              />{' '}
              Topic
            </h3>
          </div>

          <p className="text-sm md:text-[18px] leading-[160%] text-[#01281e] font-normal">
            Choose the topics you want to focus on
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map(topic => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <div
                  key={topic}
                  className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors 
                    ${
                      isSelected
                        ? 'bg-[#f7f7f3] border-gray-400'
                        : 'hover:bg-gray-50'
                    }`}
                  onClick={() => handleTopicToggle(topic, !isSelected)}
                >
                  <CustomCheckbox
                    checked={isSelected}
                    className="cursor-pointer"
                  />

                  <Label className="text-sm md:text-[18px]">{topic}</Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <button
            onClick={handleStartTest}
            className="bg-[#01503b] text-white cursor-pointer  px-6 py-3 rounded-[8px] "
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
}
