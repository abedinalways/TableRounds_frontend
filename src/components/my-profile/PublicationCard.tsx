'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import PublicationIcon from '../reusable/icons/PublicationIcon';
import ScholarIcon from '../reusable/icons/ScholarIcon';
import { EditIcon } from '../reusable/icons/EditIcon';
import Btn from '../reusable/button/Btn';

import { PublicationItem } from '@/types/myProfile';

interface PublicationCardProps {
  data: PublicationItem[];
}

type Mode = 'add' | 'edit' | 'editAll';

const EMPTY_FORM: PublicationItem = {
  title: '',
  author: '',
  year: '',
};

export default function PublicationCard({ data }: PublicationCardProps) {
  const [publicationList, setPublicationList] =
    useState<PublicationItem[]>(data);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('add');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<PublicationItem>(EMPTY_FORM);

  const modalRef = useRef<HTMLDivElement>(null);

  /* ---------------- GSAP Animation ---------------- */
  useEffect(() => {
    if (!open || !modalRef.current) return;

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [open]);

  /* ---------------- Handlers ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setMode('add');
    setFormData(EMPTY_FORM);
    setActiveIndex(null);
    setOpen(true);
  };

  const openEditAllModal = () => {
    setMode('editAll');
    setFormData(EMPTY_FORM);
    setActiveIndex(null);
    setOpen(true);
  };

  const openEditModal = (index: number) => {
    setMode('edit');
    setActiveIndex(index);
    setFormData(publicationList[index]);
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'add') {
      setPublicationList(prev => [...prev, formData]);
    }

    if (mode === 'edit' && activeIndex !== null) {
      setPublicationList(prev =>
        prev.map((item, i) => (i === activeIndex ? formData : item))
      );
    }

    setOpen(false);
    setFormData(EMPTY_FORM);
    setActiveIndex(null);
  };

  const isFullModal = mode === 'edit' || mode === 'editAll';

  /* ---------------- UI ---------------- */
  return (
    <Card className="font-[manrope] h-fit">
      <CardContent className="p-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#01503b]">
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] publication-bg">
              <PublicationIcon />
            </span>
            Publications
          </h3>

          <button
            onClick={openEditAllModal}
            className="flex items-center gap-2 text-[#01503b] text-[10px] md:text-[16px]"
          >
            <EditIcon />
            Edit
          </button>
        </div>

        {/* Publication List */}
        {publicationList.map((item, index) => (
          <div
            key={index}
            className="flex items-start justify-between gap-4 rounded-[12px] bg-[#f9f9f5] p-4"
          >
            <div className="flex items-start gap-2 font-medium">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[10px] bg-white shadow">
                <ScholarIcon />
              </div>

              <div className="flex flex-col gap-3 justify-center">
                <p className="text-[20px] font-semibold text-[#01281e]">
                  {item.title}
                </p>
                <p className="text-[16px] text-muted-foreground">
                  {item.author}
                </p>
              </div>
            </div>

            <div>{item.year}</div>
          </div>
        ))}

        {/* Add New */}
        <button
          onClick={openAddModal}
          className="w-full rounded-[12px] bg-[#f9f9f5] p-2 md:p-3 border border-[#00000012]"
        >
          <span className="flex items-center justify-center gap-2">
            <Image
              src="/images/dashboard/profile/plus.png"
              width={20}
              height={20}
              alt="add"
            />
            <span className="font-semibold text-[#01503b] text-[12px] md:text-[18px]">
              Add New
            </span>
          </span>
        </button>

        {/* Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent ref={modalRef}>
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle className="px-4">
                  <h3 className="flex items-center gap-2 font-semibold text-[#01503b]">
                    <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] publication-bg">
                      <PublicationIcon />
                    </span>
                    Publications
                  </h3>
                </DialogTitle>

                <DialogDescription className="space-y-3 p-3">
                  {/* Existing List */}
                  {isFullModal &&
                    publicationList.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between rounded-[12px] bg-[#f9f9f5] px-4 py-2"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-white shadow">
                            <ScholarIcon />
                          </div>

                          <div>
                            <p className="font-semibold text-[#01281e]">
                              {item.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.author}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openEditModal(index)}
                          className="text-[#01503b]"
                        >
                          <EditIcon />
                        </button>
                      </div>
                    ))}

                  {/* Form */}
                  <div className="space-y-3 rounded-[10px] bg-[#f9f9f5] p-3">
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">Title</Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border border-[#4444441A] py-[22px]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">Author</Label>
                      <Input
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="border border-[#4444441A] py-[22px]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">Year</Label>
                      <Input
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="border border-[#4444441A] py-[22px]"
                      />
                    </div>

                    <Btn
                      type="submit"
                      className="rounded-[10px] bg-[#b79e6b] px-6 py-3 text-white"
                    >
                      Save
                    </Btn>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
