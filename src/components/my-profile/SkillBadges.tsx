'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import BagIcon from '../reusable/icons/BagIcon';
import { EditIcon } from '../reusable/icons/EditIcon';
import Image from 'next/image';
import gsap from 'gsap';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Btn from '../reusable/button/Btn';
import { useUpsertSkillMutation } from '@/app/redux/api/profileSectionsApi';

interface SkillBadgesProps {
  skills: string[];
}

type Mode = 'editAll' | 'edit' | 'add';

// Internal type to carry server id alongside the display name
type SkillEntry = { id?: string; name: string };

export default function SkillBadges({ skills }: SkillBadgesProps) {
  const [skillList, setSkillList] = useState<SkillEntry[]>(
    skills.map(name => ({ name })),
  );
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('add');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [skillValue, setSkillValue] = useState('');
  const [upsertSkill, { isLoading }] = useUpsertSkillMutation();

  const modalRef = useRef<HTMLDivElement>(null);

  const isFullModal = mode === 'editAll' || mode === 'edit';

  useEffect(() => {
    setSkillList(skills.map(name => ({ name })));
  }, [skills]);

  useEffect(() => {
    if (!open || !modalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' },
      );
    });

    return () => ctx.revert();
  }, [open]);

  const handleEditAll = () => {
    setMode('editAll');
    setSkillValue('');
    setActiveIndex(null);
    setOpen(true);
  };

  const handleAddNew = () => {
    setMode('add');
    setSkillValue('');
    setActiveIndex(null);
    setOpen(true);
  };

  const handleEdit = (index: number) => {
    setMode('edit');
    setActiveIndex(index);
    setSkillValue(skillList[index].name);
    setOpen(true);
  };

  const handleDeleteSkill = (index: number) => {
    setSkillList(prev => prev.filter((_, i) => i !== index));

    setActiveIndex(prev => {
      if (prev === null) return null;
      if (prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });

    setSkillValue(prev => (activeIndex === index ? '' : prev));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillValue.trim()) return;

    try {
      if (mode === 'add') {
        const response = await upsertSkill({
          data: { name: skillValue.trim() },
        }).unwrap();

        setSkillList(prev => [
          ...prev,
          { id: response.data.id, name: response.data.name },
        ]);
        toast.success(response.message || 'Skill added successfully');
      }

      if (mode === 'edit' && activeIndex !== null) {
        const existing = skillList[activeIndex];

        const response = await upsertSkill({
          id: existing.id,
          data: { name: skillValue.trim() },
        }).unwrap();

        setSkillList(prev =>
          prev.map((skill, i) =>
            i === activeIndex
              ? { id: response.data.id, name: response.data.name }
              : skill,
          ),
        );
        toast.success(response.message || 'Skill updated successfully');
      }

      setSkillValue('');
      setActiveIndex(null);
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save skill');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3 h-fit space-y-4 font-[manrope]">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-[#01503b] text-[20px] flex items-center gap-2">
          <span className="w-[40px] h-[40px] rounded-[10px] bg-[#d1fae5] flex justify-center items-center">
            <BagIcon />
          </span>
          Skills
        </h3>

        <div
          onClick={handleEditAll}
          className="flex items-center gap-2 text-[#01503b] cursor-pointer"
        >
          <EditIcon />
          Edit
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skillList.map((skill, index) => (
          <Badge
            key={`${skill.name}-${index}`}
            onClick={() => handleEdit(index)}
            className={`cursor-pointer p-3 rounded-full bg-[#d1fae5] text-[#01503b] ${
              activeIndex === index ? 'ring-1 ring-[#b79e6b]' : ''
            }`}
          >
            {skill.name}
            <button
              type="button"
              aria-label={`Delete ${skill.name}`}
              onClick={e => {
                e.stopPropagation();
                handleDeleteSkill(index);
              }}
              className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#01503b]/20 bg-[#f9f9f5] text-[#01503b] text-xs leading-none cursor-pointer"
            >
              ✕
            </button>
          </Badge>
        ))}

        <div
          onClick={handleAddNew}
          className="background text-white rounded-full p-2 md:p-3 cursor-pointer"
        >
          <p className="flex justify-center items-center gap-2">
            <Image
              src="/images/dashboard/profile/plus02.png"
              width={20}
              height={20}
              alt=""
            />
            <span className="text-white font-semibold text-[12px] md:text-[18px]">
              Add New
            </span>
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent ref={modalRef}>
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="bg-[#d1fae5] p-2 rounded-[10px]">
                  <BagIcon />
                </span>
                Skills
              </DialogTitle>

              <DialogDescription className="space-y-3">
                {isFullModal && (
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, index) => (
                      <Badge
                        key={`${skill.name}-${index}`}
                        onClick={() => handleEdit(index)}
                        className={`cursor-pointer p-3 rounded-full bg-[#d1fae5] text-[#01503b] ${
                          activeIndex === index ? 'ring-1 ring-[#b79e6b]' : ''
                        }`}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="bg-[#f9f9f5] p-3 rounded-[10px] space-y-2 mt-6 font-[manrope]">
                  <Label>Add Skill</Label>
                  <Input
                    value={skillValue}
                    onChange={e => setSkillValue(e.target.value)}
                  />

                  <Btn
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#b79e6b] text-white md:px-6 md:py-3 w-full md:w-fit"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </Btn>
                </div>
              </DialogDescription>
            </DialogHeader>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
