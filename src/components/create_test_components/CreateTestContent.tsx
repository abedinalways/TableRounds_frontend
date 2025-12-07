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

  // Handler for Checkbox Toggles
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
    console.log('Test configuration:', {
      testMode,
      difficulty,
      selectedTopics,
      selectedStatus,
      numQuestions,
    });
    alert('Starting Test!');
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-2 test-container text-[#4b5563]">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Test</h2>
      </div>
      <p className="text-muted-foreground">
        Configure your test parameters and get started
      </p>

      <div className="space-y-4">
        {/* --- 1. No. of Questions --- */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-lg font-semibold">No. of Questions</h3>
          <p className="text-sm text-muted-foreground">
            Set the maximum questions allowed per block
          </p>
          <Select value={numQuestions} onValueChange={setNumQuestions}>
            <SelectTrigger className="w-48 bg-[#f7f7f3]">
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

        {/* --- 2. Test Mode (Updated with Switch) --- */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-lg font-semibold">Test Mode</h3>
          <p className="text-md text-muted-foreground">
            Choose how you want to take the test
          </p>

          {/* Switch-controlled Test Mode */}
          <div className="flex items-center space-x-4">
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

          {/* Status Checkboxes */}
          <div className="flex space-x-4 pt-4">
            {[
              'Used',
              'Unused',
              'Correct',
              'Incorrect',
              'Omitted',
              'Marked',
            ].map(status => (
              <div key={status} className="flex items-center space-x-2">
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

        {/* --- 3. Difficulty --- */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-lg font-semibold">Difficulty</h3>
          <p className="text-sm text-muted-foreground">
            Select the difficulty level for your test
          </p>

          <div className="flex space-x-8">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                value="Intern"
                id="d1"
                checked={difficulty === 'Intern'}
                onChange={() => setDifficulty('Intern')}
              />
              <Label htmlFor="d1">Intern</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                value="Senior"
                id="d2"
                checked={difficulty === 'Senior'}
                onChange={() => setDifficulty('Senior')}
              />
              <Label htmlFor="d2">Senior</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                value="Boards"
                id="d3"
                checked={difficulty === 'Boards'}
                onChange={() => setDifficulty('Boards')}
              />
              <Label htmlFor="d3">Boards</Label>
            </div>
          </div>
        </div>

        {/* --- 4. Topic Selection --- */}
        <div className="space-y-4 bg-white p-4 rounded-[12px] border border-[#e9e9e9] custom-shadow">
          <h3 className="text-lg font-semibold">Topic</h3>
          <p className="text-sm text-muted-foreground">
            Choose the topics you want to focus on
          </p>

          <div className="grid grid-cols-3 gap-4">
            {TOPICS.map(topic => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <div
                  key={topic}
                  className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors 
                    ${
                      isSelected
                        ? 'bg-green-100/50 border-green-500'
                        : 'hover:bg-gray-50'
                    }`}
                  onClick={() => handleTopicToggle(topic, !isSelected)}
                >
                  <Label
                    htmlFor={topic}
                    className="font-medium text-sm cursor-pointer"
                  >
                    {topic}
                  </Label>
                  {isSelected && <Check className="h-4 w-4 text-green-600" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Start Test Button --- */}
        <div className="pt-4">
          <Button
            onClick={handleStartTest}
            className="bg-green-600 hover:bg-green-700"
          >
            Start Test
          </Button>
        </div>
      </div>
    </div>
  );
}
