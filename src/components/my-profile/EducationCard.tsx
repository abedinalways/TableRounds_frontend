'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EducationItem } from '@/types/myProfile';
import EducationIcon from '../reusable/icons/EducationIcon';
import ScholarIcon from '../reusable/icons/ScholarIcon';
import { EditIcon } from '../reusable/icons/EditIcon';
import Image from 'next/image';
import gsap from 'gsap';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Btn from '../reusable/button/Btn';

interface EducationCardProps {
  data: EducationItem[];
}

type Mode = 'editAll'|'add' | 'edit';

export default function EducationCard({ data }: EducationCardProps) {
  const [educationList, setEducationList] = useState<EducationItem[]>(data);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('add');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const emptyForm: EducationItem = {
    title: '',
    institute: '',
    degree: '',
    year: '',
  };

  const [formData, setFormData] = useState<EducationItem>(emptyForm);

  /* ---------------- Animations ---------------- */
  useEffect(() => {
    if (open && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [open]);

  /* ---------------- Handlers ---------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditAll = () => {
    setMode('editAll');
    setFormData(emptyForm);
    setActiveIndex(null);
    setOpen(true);
  };

  const handleAddNew = () => {
    setMode('add');
    setFormData(emptyForm);
    setActiveIndex(null);
    setOpen(true);
  };

  const handleEdit = (index: number) => {
    setMode('edit');
    setActiveIndex(index);
    setFormData(educationList[index]);
    setOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'add') {
      setEducationList(prev => [...prev, formData]);
    } else if (mode === 'edit' && activeIndex !== null) {
      setEducationList(prev =>
        prev.map((item, i) => (i === activeIndex ? formData : item))
      );
    }

    setOpen(false);
    setFormData(emptyForm);
    setActiveIndex(null);
  };

  const isFullModal = mode === 'editAll' || mode === 'edit';
  const isAddMode = mode === 'add';


  return (
    <Card className="font-[manrope]">
      <CardContent className="p-3 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[#01503b] flex items-center gap-2">
            <span className="w-[40px] h-[40px] rounded-[10px] bg-[#dbeafe] flex justify-center items-center">
              <EducationIcon />
            </span>
            Education
          </h3>

          <div
            onClick={handleEditAll}
            className="flex items-center gap-2 text-[#01503b] cursor-pointer"
          >
            <EditIcon />
            Edit
          </div>
        </div>

        {/* Education List */}
        {educationList.map((item, index) => (
          <div
            key={index}
            className="bg-[#f9f9f5] p-4 rounded-[12px] flex justify-between"
          >
            <div className="flex gap-3">
              <div className="w-[48px] h-[48px] bg-white rounded-[10px] flex items-center justify-center shadow">
                <ScholarIcon />
              </div>

              <div>
                <p className="text-[20px] font-semibold text-[#01281e]">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.institute}
                </p>
                <p className="text-sm text-muted-foreground">{item.degree}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span>{item.year}</span>
              {/* <span
                onClick={() => handleEdit(index)}
                className="cursor-pointer text-[#01503b]"
              >
                <EditIcon />
              </span> */}
            </div>
          </div>
        ))}

        {/* Add New */}
        <div
          onClick={handleAddNew}
          className="bg-[#f9f9f5] rounded-[12px] p-3 cursor-pointer border border-[#00000012]"
        >
          <p className="flex justify-center items-center gap-2">
            <Image
              src="/images/dashboard/profile/plus.png"
              width={20}
              height={20}
              alt=""
            />
            <span className="text-[#01503b] font-semibold">Add New</span>
          </p>
        </div>

        {/* Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            ref={modalRef}
            className="z-1000 h-132  overflow-x-hidden"
          >
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle>
                  <div className="flex justify-between gap-2 items-center md:px-4">
                    <h3 className="font-semibold text-[#01503b] flex items-center gap-2">
                      <span className="w-[40px] h-[40px] rounded-[10px] bg-[#dbeafe] flex justify-center items-center">
                        <EducationIcon />
                      </span>
                      Education
                    </h3>
                    {/* <h4 className="flex items-center gap-2 text-[#01503b] text-[10px] md:text-[16px] cursor-pointer">
                      <span>
                        <EditIcon />
                      </span>
                      Edit
                    </h4> */}
                  </div>
                </DialogTitle>

                <DialogDescription className="space-y-3 md:p-3">
                  {isFullModal && (
                    <>
                      {educationList.map((item, index) => (
                        <div
                          key={index}
                          className="bg-[#f9f9f5] md:px-4 py-2 rounded-[12px] flex items-start justify-between gap-2"
                        >
                          <div className="font-medium flex items-start gap-2">
                            <div>
                              <h4
                                className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center"
                                style={{
                                  background: 'white',
                                  boxShadow:
                                    '0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                }}
                              >
                                <ScholarIcon />
                              </h4>
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                              <p className="text-[#01281e] md:text-[16px] font-semibold">
                                {item.title}
                              </p>
                              <p className="md:text-[12px] text-muted-foreground">
                                {item.institute}
                              </p>
                              <p className="md:text-[12px] text-muted-foreground">
                                {item.degree}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span>{item.year}</span>
                            <span
                              onClick={() => handleEdit(index)}
                              className="cursor-pointer text-[#01503b]"
                            >
                              <EditIcon />
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="bg-[#f9f9f5] space-y-3 rounded-[10px] p-3">
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">
                        Degree<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">
                        Institution Name<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="institute"
                        value={formData.institute}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">
                        Year Earned<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold">Description</Label>
                      <Input
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>
                    {isFullModal ? (
                      <Btn
                        type="submit"
                        className="bg-[#b79e6b] rounded-[10px] text-white md:px-[24px] md:py-[12px] w-full md:w-fit py-2 mt-2"
                      >
                        Save
                      </Btn>
                    ) : (
                      <Btn
                        type="submit"
                        className="bg-[#b79e6b] text-white rounded-[12px] p-3 cursor-pointer w-[102px] h-[54px] w-full  py-2 mt-2"
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
      </CardContent>
    </Card>
  );
}
