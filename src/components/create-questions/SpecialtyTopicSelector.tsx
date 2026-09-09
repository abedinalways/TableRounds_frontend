'use client';

import { useMemo, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useGetQuestionSpecialitiesQuery,
  useGetQuestionSpecialityTopicsQuery,
} from '@/app/redux/api/createQuestionsApi';

import { cn } from '@/lib/utils';
import type { SpecialtyTopicPair } from '@/types/createQuestion';

interface SpecialtyTopicSelectorProps {
  value: SpecialtyTopicPair[];
  onChange: (pairs: SpecialtyTopicPair[]) => void;
}

export function SpecialtyTopicSelector({
  value,
  onChange,
}: SpecialtyTopicSelectorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const {
    data: specialitiesData,
    isLoading: loadingSpecialities,
  } = useGetQuestionSpecialitiesQuery();

  const specialities = Array.isArray(specialitiesData?.data)
    ? specialitiesData.data
    : [];

  const selectedIds = useMemo(
    () => new Set(value.map(pair => pair.specialityId)),
    [value],
  );

  const availableSpecialities = specialities?.filter(
    speciality => !selectedIds.has(speciality.id),
  );

  const activeIdValue =
    activeId ?? (value.length > 0 ? value[0].specialityId : null);

  const activePair =
    value.find(pair => pair.specialityId === activeIdValue) ?? null;

  const {
    data: activeSpecialityData,
    isLoading: loadingTopics,
    isError: topicsError,
  } = useGetQuestionSpecialityTopicsQuery(activeId ?? '', {
    skip: !activeId,
  });

  const activeTopics = Array.isArray(activeSpecialityData?.data?.topics)
    ? activeSpecialityData.data.topics
    : [];

  const handleAddSpeciality = (id: string) => {
    if (selectedIds.has(id)) return;

    const speciality = specialities.find(s => s.id === id);
    if (!speciality) return;

    onChange([
      ...value,
      {
        specialityId: speciality.id,
        specialityName: speciality.name,
        topicId: '',
        topicName: '',
      },
    ]);
    setActiveId(speciality.id);
  };

  const handleRemoveSpeciality = (pair: SpecialtyTopicPair) => {
    const next = value.filter(p => p.specialityId !== pair.specialityId);
    onChange(next);

    if (activeId === pair.specialityId) {
      setActiveId(next[0]?.specialityId ?? null);
    }
  };

  const handleSelectTopic = (topicId: string) => {
    if (!activePair) return;

    const topic = activeTopics.find(t => t.id === topicId);
    if (!topic) return;

    onChange(
      value.map(pair =>
        pair.specialityId === activePair.specialityId
          ? { ...pair, topicId: topic.id, topicName: topic.name }
          : pair,
      ),
    );
  };

  return (
    <div className="space-y-3 p-4 bg-white border rounded-lg font-[manrope]">
      <div>
        <h3 className="text-md md:text-[20px] text-[#444950] font-bold leading-[160%]">
          Speciality &amp; Topic
        </h3>
        <p className="text-sm text-gray-400">
          A question can belong to multiple specialities — pick one topic for
          each.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* ── Speciality selection ── */}
        <div className="space-y-3 bg-[#f8f8f4] p-3 md:p-4 rounded-[8px]">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Add Speciality
            </label>

            <Select
              key={`speciality-add-${value.length}`}
              onValueChange={handleAddSpeciality}
              disabled={loadingSpecialities || availableSpecialities.length === 0}
            >
              <SelectTrigger size="lg" className="w-full mt-2">
                <SelectValue
                  placeholder={
                    loadingSpecialities
                      ? 'Loading specialities...'
                      : availableSpecialities.length === 0
                        ? 'All specialities added'
                        : 'Select a speciality to add'
                  }
                />
              </SelectTrigger>

              <SelectContent align="start" position="popper" className="w-64">
                {availableSpecialities.map(speciality => (
                  <SelectItem key={speciality.id} value={speciality.id}>
                    {speciality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {value.length === 0 ? (
            <div className="text-sm text-gray-400 py-6 text-center bg-white rounded-[8px] border border-dashed border-gray-200 animate-in fade-in-0 duration-200">
              No speciality added yet.
            </div>
          ) : (
            <div className="flex flex-col gap-2 animate-in fade-in-0 duration-200">
              {value.map(pair => {
                const isActive = pair.specialityId === activeIdValue;
                const hasTopic = Boolean(pair.topicId);

                return (
                  <div
                    key={pair.specialityId}
                    className={cn(
                      'flex items-center justify-between gap-2 px-3 py-2 rounded-[8px] border transition-all duration-200',
                      isActive
                        ? 'border-[#01503b] bg-white ring-1 ring-[#01503b]/30 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-[#01503b]/40',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(pair.specialityId)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full shrink-0',
                          hasTopic ? 'bg-[#01503b]' : 'bg-amber-400',
                        )}
                      />

                      <span className="text-sm font-semibold text-[#01281e] truncate">
                        {pair.specialityName}
                      </span>

                      <span
                        className={cn(
                          'text-xs truncate',
                          hasTopic ? 'text-[#01503b]' : 'text-amber-500',
                        )}
                      >
                        {hasTopic ? pair.topicName : 'No topic selected'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSpeciality(pair)}
                      aria-label={`Remove ${pair.specialityName}`}
                      className="p-1 rounded-[6px] text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
{/* ── Topic selection ── */}
        <div className="space-y-3 bg-[#f8f8f4] p-3 md:p-4 rounded-[8px]">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Select Topic
            </label>

            <p className="text-xs text-gray-400 mt-0.5">
              {activePair
                ? `Topics under ${activePair.specialityName}`
                : 'Choose a speciality first'}
            </p>
          </div>

          {!activePair ? (
            <div className="text-sm text-gray-400 py-6 text-center bg-white rounded-[8px] border border-dashed border-gray-200">
              Select a speciality to see its topics
            </div>
          ) : loadingTopics ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-6 bg-white rounded-[8px] border border-dashed border-gray-200">
              <Loader2 className="animate-spin" size={16} />
              Loading topics...
            </div>
          ) : topicsError ? (
            <div className="text-sm text-red-500 py-6 text-center bg-white rounded-[8px] border border-dashed border-gray-200">
              Failed to load topics. Please try again.
            </div>
          ) : activeTopics.length === 0 ? (
            <div className="text-sm text-gray-400 py-6 text-center bg-white rounded-[8px] border border-dashed border-gray-200">
              No topics available for this speciality
            </div>
          ) : (
            <div
              key={activePair.specialityId}
              className="flex flex-wrap gap-2 animate-in fade-in-0 slide-in-from-bottom-1 duration-200"
            >
              {activeTopics.map(topic => {
                const isSelected = activePair.topicId === topic.id;

                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSelectTopic(topic.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-sm border transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'bg-[#01503b] text-white border-[#01503b] shadow-sm scale-[1.02]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#01503b]/40 hover:text-[#01503b]',
                    )}
                  >
                    {isSelected && <Check size={14} />}
                    {topic.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}