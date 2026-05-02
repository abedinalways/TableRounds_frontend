'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { toast } from 'sonner';

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
import { useUpsertPublicationMutation } from '@/app/redux/api/profileSectionsApi';
import { Button } from '../ui/button';

interface PublicationCardProps {
  data: PublicationItem[];
}

type Mode = 'add' | 'edit' | 'editAll';

const EMPTY_FORM: PublicationItem = {
  title: '',
  author: '',
  year: '',
  articleLink: '',
};

export default function PublicationCard({ data }: PublicationCardProps) {
  const [publicationList, setPublicationList] =
    useState<PublicationItem[]>(data);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('add');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<PublicationItem>(EMPTY_FORM);

  const [upsertPublication, { isLoading }] = useUpsertPublicationMutation();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPublicationList(data);
  }, [data]);

  useEffect(() => {
    if (!open || !modalRef.current) return;

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
    );
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.year) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        title: formData.title.trim(),
        topic: formData.title.trim(),
        link: formData.articleLink.trim(),
        year: formData.year.trim(),
      };

      /* ================= ADD ================= */
      if (mode === 'add') {
        const response = await upsertPublication({
          data: payload,
        }).unwrap();

        const newItem: PublicationItem = {
          title: response.data?.title,
          author: formData.author,
          articleLink: response.data.link,
          year: response.data.year,
        };

        setPublicationList(prev => [...prev, newItem]);

        toast.success(response.message || 'Publication added successfully');
      }

      /* ================= EDIT ================= */
      if (mode === 'edit' && activeIndex !== null) {
        const existing = publicationList[activeIndex];

        const response = await upsertPublication({
          id: (existing as any)?.id,
          data: payload,
        }).unwrap();

        const updatedItem: PublicationItem = {
          title: response.data.title,
          author: formData.author,
          articleLink: response.data.link,
          year: response.data.year,
        };

        setPublicationList(prev =>
          prev.map((item, i) => (i === activeIndex ? updatedItem : item)),
        );

        toast.success(response.message || 'Publication updated successfully');
      }

      setOpen(false);
      setFormData(EMPTY_FORM);
      setActiveIndex(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save publication');
    }
  };

  const isFullModal = mode === 'edit' || mode === 'editAll';

  return (
    <Card className="font-[manrope] h-fit overflow-x-hidden">
      <CardContent className="p-3 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="flex items-center gap-2 font-semibold text-[#01503b]">
            <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] publication-bg">
              <PublicationIcon />
            </span>
            Publications
          </h3>

          <button
            onClick={openEditAllModal}
            className="flex items-center gap-2 text-[#01503b] text-[10px] md:text-[16px] cursor-pointer"
          >
            <EditIcon />
            Edit
          </button>
        </div>

        {publicationList.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex items-start justify-between md:gap-4 rounded-[12px] bg-[#f9f9f5] md:p-4"
          >
            <div className="flex items-start gap-2 font-medium">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[10px] bg-white shadow">
                <ScholarIcon />
              </div>

              <div className="flex flex-col gap-3 justify-center">
                <p className="md:text-[20px] text-[14px] font-semibold text-[#01281e]">
                  {item.title}
                </p>

                <p className="md:text-[16px] text-[10px] text-[#01503b] font-semibold">
                  {item.author}
                </p>

                <a
                  href={item.articleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline md:text-sm text-[8px] cursor-pointer text-[#01503b]"
                >
                  {item.articleLink}
                </a>
              </div>
            </div>

            <div className="md:text-[14px] text-xs">{item.year}</div>
          </div>
        ))}

        <button
          onClick={openAddModal}
          className="w-full rounded-[12px] bg-[#f9f9f5] p-2 md:p-3 border border-[#00000012] cursor-pointer"
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            ref={modalRef}
            className="z-1000 h-130 overflow-y-auto overflow-x-hidden"
          >
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
                  {isFullModal &&
                    publicationList.map((item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className="flex items-start justify-between rounded-[12px] bg-[#f9f9f5] px-4 py-2"
                      >
                        <div className="flex gap-3">
                          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-white shadow">
                            <ScholarIcon />
                          </div>

                          <div className="flex flex-col gap-2">
                            <p className="font-semibold text-[#01281e]">
                              {item.title}
                            </p>

                            <p className="font-semibold text-[#01281e]">
                              {item.articleLink}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {item.author}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openEditModal(index)}
                          className="text-[#01503b] cursor-pointer"
                        >
                          <EditIcon />
                        </button>
                      </div>
                    ))}

                  <div className="space-y-3 rounded-[10px] bg-[#f9f9f5] p-3">
                    <div className="flex flex-col gap-2">
                      <Label>
                        Title<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className=''>
                        Authors
                        <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>
                        Year<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>
                        Link<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="articleLink"
                        value={formData.articleLink}
                        onChange={handleChange}
                      />
                    </div>

                    <Btn
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#b79e6b] text-white md:px-6 md:py-3 rounded-[10px] w-full md:w-fit py-2 mt-2"
                    >
                      {isLoading ? 'Saving...' : 'Save'}
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
