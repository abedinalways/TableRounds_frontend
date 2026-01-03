'use client';

import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import BagIcon from '../reusable/icons/BagIcon';
import { EditIcon } from '../reusable/icons/EditIcon';
import Image from 'next/image';
import gsap from 'gsap';

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

interface SkillBadgesProps {
  skills: string[];
}

type Mode = 'editAll' | 'edit' | 'add';

export default function SkillBadges({ skills }: SkillBadgesProps) {
  const [skillList, setSkillList] = useState<string[]>(skills);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('add');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [skillValue, setSkillValue] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  const isFullModal = mode === 'editAll' || mode === 'edit';

  /* ---------------- Animation ---------------- */
  useEffect(() => {
    if (!open || !modalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }
      );
    });

    return () => ctx.revert();
  }, [open]);

  /* ---------------- Handlers ---------------- */
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
    setSkillValue(skillList[index]);
  };

    const handleDeleteSkill = (index: number) => {
      setSkillList(prev => prev.filter((_, i) => i !== index));

      // keep current selection sane (no UI/logic changes beyond preventing broken state)
      setActiveIndex(prev => {
        if (prev === null) return null;
        if (prev === index) return null;
        return prev > index ? prev - 1 : prev;
      });

      // if the deleted one was selected, clear the input
      setSkillValue(prev => (activeIndex === index ? '' : prev));
    };


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillValue.trim()) return;

    if (mode === 'add') {
      setSkillList(prev => [...prev, skillValue.trim()]);
    }

    if (mode === 'edit' && activeIndex !== null) {
      setSkillList(prev =>
        prev.map((skill, i) => (i === activeIndex ? skillValue.trim() : skill))
      );
    }

    setSkillValue('');
    setActiveIndex(null);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-3 h-fit space-y-4 font-[manrope]">
      {/* Header */}
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

      {/* Skill badges */}
      <div className="flex flex-wrap gap-2">
        {skillList.map((skill, index) => (
          <Badge
            key={skill}
            onClick={() => handleEdit(index)}
            className={`cursor-pointer p-3 rounded-full bg-[#d1fae5] text-[#01503b] ${
              activeIndex === index ? 'ring-1 ring-[#b79e6b]' : ''
            }`}
          >
            {skill}

            {/* rounded delete button (edit section only) */}
            <button
              type="button"
              aria-label={`Delete ${skill}`}
              onClick={e => {
                e.stopPropagation(); // don't trigger handleEdit
                handleDeleteSkill(index);
              }}
              className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#01503b]/20 bg-[#f9f9f5] text-[#01503b] text-xs leading-none cursor-pointer"
            >
              ✕
            </button>
          </Badge>
        ))}

        {/* Add New */}
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

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent ref={modalRef}>
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {' '}
                <span className="bg-[#d1fae5] p-2 rounded-[10px]">
                  <BagIcon />
                </span>
                Skills
              </DialogTitle>

              <DialogDescription className="space-y-3">
                {/* Existing skills (Edit mode only) */}
                {isFullModal && (
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill, index) => (
                      <Badge
                        key={skill}
                        onClick={() => handleEdit(index)}
                        className={`cursor-pointer p-3 rounded-full bg-[#d1fae5] text-[#01503b] ${
                          activeIndex === index ? 'ring-1 ring-[#b79e6b]' : ''
                        }`}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="bg-[#f9f9f5] p-3 rounded-[10px] space-y-2 mt-6 font-[manrope]">
                  <Label>Add Skill</Label>
                  <Input
                    value={skillValue}
                    onChange={e => setSkillValue(e.target.value)}
                  />

                  {isFullModal ? (
                    <Btn
                      type="submit"
                      className="bg-[#b79e6b] text-white md:px-6 md:py-3"
                    >
                      Save
                    </Btn>
                  ) : (
                    <Btn
                      type="submit"
                      className="bg-[#b79e6b] text-white w-[102px] h-[54px] rounded-[12px] p-3 cursor-pointer  "
                    >
                      Save
                    </Btn>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
