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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useRouter } from 'next/navigation';

// --- Mock Data ---
const TOPICS: string[] = [
  'Anesthesia/Medicine',
  'Dental/alveolar',
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

export function CreateTestContent() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(TOPICS);
  const [testMode, setTestMode] = useState<'Tutor' | 'Timed'>('Timed');
  const [difficulty, setDifficulty] = useState<'Intern' | 'Senior' | 'Boards'>(
    'Intern'
  );
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['Used']);
  const [numQuestions, setNumQuestions] = useState<string>('');
  const router = useRouter();
  const handleTopicToggle = (
    topicName: string,
    checked: boolean | 'indeterminate'
  ) => {
    if (checked) {
      setSelectedTopics([...selectedTopics, topicName]);
    } else {
      setSelectedTopics(selectedTopics.filter(t => t !== topicName));
    }
  };

  const handleStatusToggle = (
    statusName: string,
    checked: boolean | 'indeterminate'
  ) => {
    if (checked) {
      setSelectedStatus([...selectedStatus, statusName]);
    } else {
      setSelectedStatus(selectedStatus.filter(s => s !== statusName));
    }
  };

  const handleStartTest = () => {
     router.push('create-test/1');
   
    
  };

  return (
    <div className="flex-1 max-w-5xl space-y-4 pt-2 test-container text-[#4b5563]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
        <h2 className="md:text-3xl text-xl font-bold">Create Test</h2>
      </div>

      <p className="text-sm text-[#01281e]">
        Configure your test parameters and get started
      </p>

      <div className="space-y-4  w-[280px] md:w-[720px]  xl:w-[914px]">
        {/* 1. No. of Questions */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow ">
          <h3 className="text-lg font-semibold">No. of Questions</h3>
          <p className="text-sm text-[#01281e]">
            Set the maximum questions allowed per block
          </p>

          <Select value={numQuestions} onValueChange={setNumQuestions}>
            <SelectTrigger className="w-full sm:w-[180px] h-[61px] bg-[#f7f7f3] p-[16px] rounded-[8px]">
              <SelectValue placeholder="Select a number" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. Test Mode */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-lg font-semibold">Test Mode</h3>
          <p className="text-md text-[#01281e]">
            Choose how you want to take the test
          </p>

          <div className="flex items-center flex-wrap gap-4">
            <Label
              className={`cursor-pointer ${
                testMode === 'Tutor' ? 'text-green-600 font-semibold' : ''
              }`}
            >
              Tutor
            </Label>

            <Switch
              checked={testMode === 'Tutor'}
              onCheckedChange={checked =>
                setTestMode(checked ? 'Tutor' : 'Timed')
              }
            />

            <Label
              className={`cursor-pointer ${
                testMode === 'Timed' ? 'text-green-600 font-semibold' : ''
              }`}
            >
              Timed
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
                className="flex items-center space-x-2 bg-[#f8f8f4]  md:px-[24px] md:py-[12px] px-[14px] py-[8px] rounded-[8px] text-xs md:text-sm"
              >
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatus.includes(status)}
                  onCheckedChange={checked =>
                    handleStatusToggle(status, checked)
                  }
                />
                <Label htmlFor={`status-${status}`}>{status}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Difficulty */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-lg font-semibold">Difficulty</h3>
          <p className="text-sm">Select the difficulty level for your test</p>

          <div className="flex flex-wrap gap-4">
            {['Intern', 'Senior', 'Boards'].map((level, idx) => (
              <label
                key={idx}
                className="flex items-center space-x-2 bg-[#f8f8f4] md:px-[24px] md:py-[12px] px-[14px] py-[8px] rounded-[8px] text-xs md:text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  value={level}
                  checked={difficulty === level}
                  onChange={() =>
                  setDifficulty(level as 'Intern' | 'Senior' | 'Boards')
                  }
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 4. Topic Selection */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-lg font-semibold"><Checkbox/> Topic</h3>
          <p className="text-sm text-[#01281e]">
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
                  {isSelected && (
                    <Check className="h-4 w-4 text-white bg-[#01281e] rounded-full" />
                  )}
                  <Label className="font-medium text-sm cursor-pointer">
                    {topic}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <Button
            onClick={handleStartTest}
            className="bg-[#01503b] text-white cursor-pointer w-full sm:w-auto"
          >
            Start Test
          </Button>
        </div>
      </div>
    </div>
  );
}
