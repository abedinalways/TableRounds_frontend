'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExperienceItem } from '@/types/myProfile';
import BagIcon from '../reusable/icons/BagIcon';
import ScholarIcon from '../reusable/icons/ScholarIcon';
import LocationIcon from '../ui/LocationIcon';
import Image from 'next/image';
import { EditIcon } from '../reusable/icons/EditIcon';
import gsap from 'gsap';
import { toast } from 'sonner';

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
import { useUpsertExperienceMutation } from '@/app/redux/api/profileSectionsApi';



interface ExperienceCardProps {
  data: ExperienceItem[];
}

type Mode = 'editAll' | 'edit' | 'add';

type ExperienceFormState = {
  role: string;
  hospital: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
};

export default function ExperienceCard({ data }: ExperienceCardProps) {
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>(data);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('add');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
 const [upsertExperience, { isLoading }] = useUpsertExperienceMutation();

  const modalRef = useRef<HTMLDivElement>(null);

  const emptyForm: ExperienceFormState = {
    role: '',
    hospital: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
  };

  const [formData, setFormData] = useState<ExperienceFormState>(emptyForm);

  useEffect(() => {
    setExperienceList(data);
  }, [data]);

  useEffect(() => {
    if (!open || !modalRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
      );
    });

    return () => ctx.revert();
  }, [open]);

  const isFullModal = mode === 'editAll' || mode === 'edit';

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
    const item = experienceList[index];
    const [startDate = '', endDate = ''] = item.period
      ? item.period.split(' - ')
      : ['', ''];

    setMode('edit');
    setActiveIndex(index);
    setFormData({
      role: item.role,
      hospital: item.hospital,
      location: item.location,
      description: item.description ?? '',
      startDate,
      endDate,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.role ||
      !formData.hospital ||
      !formData.location ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (mode === 'add') {
        const response = await upsertExperience({
          data: {
            company: formData.hospital,
            position: formData.role,
            location: formData.location,
            start_date: formData.startDate,
            end_date: formData.endDate,
          },
        }).unwrap();

        const newItem: ExperienceItem = {
          id: response.data.id,
          role: response.data.position,
          hospital: response.data.company,
          location: response.data.location,
          description: formData.description,
          period: `${response.data.start_date} - ${response.data.end_date}`,
        };

        setExperienceList(prev => [...prev, newItem]);
        toast.success(response.message || 'Experience added successfully');
      }

      if (mode === 'edit' && activeIndex !== null) {
        const item = experienceList[activeIndex];

        const response = await upsertExperience({
          id: item.id,
          data: {
            company: formData.hospital,
            position: formData.role,
            location: formData.location,
            start_date: formData.startDate,
            end_date: formData.endDate,
          },
        }).unwrap();

        const updatedItem: ExperienceItem = {
          id: response.data.id,
          role: response.data.position,
          hospital: response.data.company,
          location: response.data.location,
          description: formData.description,
          period: `${response.data.start_date} - ${response.data.end_date}`,
        };

      

        setExperienceList(prev =>
          prev.map((item, i) => (i === activeIndex ? updatedItem : item)),
        );

        toast.success(response.message || 'Experience updated successfully');
      }

      setOpen(false);
      setFormData(emptyForm);
      setActiveIndex(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save experience');
    }
  };

  return (
    <Card className="font-[manrope]">
      <CardContent className="p-3 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[#01503b] flex items-center gap-2">
            <span className="w-[40px] h-[40px] rounded-[10px] bg-[#d1fae5] flex justify-center items-center">
              <BagIcon />
            </span>
            Clinical Experiences
          </h3>

          <div
            onClick={handleEditAll}
            className="flex items-center gap-2 text-[#01503b] cursor-pointer"
          >
            <EditIcon />
            Edit
          </div>
        </div>

        {experienceList.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className="bg-[#f9f9f5] p-4 rounded-[12px] flex justify-between"
          >
            <div className="flex gap-3">
              <div className="w-[48px] h-[48px] bg-white rounded-[10px] flex items-center justify-center shadow">
                <ScholarIcon />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[20px] font-semibold text-[#01281e]">
                  {item.role}
                </p>
                <p className="text-muted-foreground">{item.hospital}</p>
                <p className="flex items-center gap-2 text-[#6b7280]">
                  <LocationIcon /> {item.location}
                </p>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>

            <span>{item.period}</span>
          </div>
        ))}

        <div
          onClick={handleAddNew}
          className="bg-[#f9f9f5] rounded-[12px] p-3 cursor-pointer"
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            ref={modalRef}
            className="z-1000 h-144 overflow-y-auto overflow-x-hidden"
          >
            <form onSubmit={handleSave}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="w-[40px] h-[40px] rounded-[10px] bg-[#d1fae5] flex justify-center items-center">
                    <BagIcon />
                  </span>
                  Clinical Experiences
                </DialogTitle>

                <DialogDescription className="space-y-3">
                  {isFullModal &&
                    experienceList.map((item, index) => (
                      <div
                        key={`${item.role}-${index}`}
                        className={`bg-[#f9f9f5] p-3 rounded-[12px] flex justify-between ${
                          activeIndex === index ? 'ring-1 ring-[#b79e6b]' : ''
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{item.role}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.hospital}
                          </p>
                        </div>
                        <span
                          onClick={() => handleEdit(index)}
                          className="cursor-pointer text-[#01503b]"
                        >
                          <EditIcon />
                        </span>
                      </div>
                    ))}

                  <div className="bg-[#f9f9f5] p-3 rounded-[10px] space-y-2">
                    <div className="flex flex-col gap-2">
                      <Label>
                        Role <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>
                        Hospital/Practice{' '}
                        <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>
                        Location<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>
                        Start Date<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>
                        End Date<span className="text-red-600">*</span>
                      </Label>
                      <Input
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Description</Label>
                      <Input
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border border-[#4444441A] rounded-sm py-[22px] w-full"
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
