'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EducationItem } from '@/types/myProfile';
import EducationIcon from '../reusable/icons/EducationIcon';
import ScholarIcon from '../reusable/icons/ScholarIcon';
import { EditIcon } from '../reusable/icons/EditIcon';
import Image from 'next/image';

import {
  Dialog,

  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Btn from '../reusable/button/Btn';

interface EducationCardProps {
  data: EducationItem[];
}

export default function EducationCard({ data }: EducationCardProps) {
  const [educationList, setEducationList] = useState<EducationItem[]>(data);

  const [formData, setFormData] = useState<EducationItem>({
    title: '',
    institute: '',
    degree: '',
    year: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEducationList(prev => [...prev, formData]);
    setFormData({
      title: '',
      institute: '',
      degree: '',
      year: '',
    });
  };

  return (
    <Card className="font-[manrope]">
      <CardContent className="p-3 space-y-4">
        {/* Header */}
        <div className="flex justify-between gap-4 items-center">
          <h3 className="font-semibold text-[#01503b] flex items-center gap-2">
            <span className="w-[40px] h-[40px] rounded-[10px] bg-[#dbeafe] flex justify-center items-center">
              <EducationIcon />
            </span>
            Education
          </h3>
          <h4 className="flex items-center gap-2 text-[#01503b] text-[10px] md:text-[16px] cursor-pointer">
            <span>
              <EditIcon />
            </span>
            Edit
          </h4>
        </div>

        {/* Education List */}
        {educationList.map((item, index) => (
          <div
            key={index}
            className="bg-[#f9f9f5] p-4 rounded-[12px] flex items-start justify-between gap-4"
          >
            <div className="font-medium flex items-start gap-2">
              <div>
                <h4
                  className="w-[48px] h-[48px] rounded-[10px] flex items-center justify-center"
                  style={{
                    background: 'white',
                    boxShadow:
                      '0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <ScholarIcon />
                </h4>
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <p className="text-[#01281e] text-[20px] font-semibold">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.institute}
                </p>
                <p className="text-sm text-muted-foreground">{item.degree}</p>
              </div>
            </div>
            <div>{item.year}</div>
          </div>
        ))}

        {/* Dialog */}
        <Dialog>
          <form onSubmit={handleSubmit} className="font-[manrope]">
            <DialogTrigger asChild>
              <div className="bg-[#f9f9f5] rounded-[12px] p-2 md:p-3">
                <p className="p-1 rounded-2xl flex justify-center items-center gap-2">
                  <Image
                    src="/images/dashboard/profile/plus.png"
                    width={20}
                    height={20}
                    alt=""
                    className="cursor-pointer"
                  />
                  <span className="text-[#01503b] font-semibold text-[12px] md:text-[18px]">
                    Add New
                  </span>
                </p>
              </div>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <div className="flex justify-between gap-2 items-center px-4">
                    <h3 className="font-semibold text-[#01503b] flex items-center gap-2">
                      <span className="w-[40px] h-[40px] rounded-[10px] bg-[#dbeafe] flex justify-center items-center">
                        <EducationIcon />
                      </span>
                      Education
                    </h3>
                    <h4 className="flex items-center gap-2 text-[#01503b] text-[10px] md:text-[16px] cursor-pointer">
                      <span>
                        <EditIcon />
                      </span>
                      Edit
                    </h4>
                  </div>
                </DialogTitle>
               {/* education list */}
                <DialogDescription className="p-2 space-y-2">
                  {educationList.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#f9f9f5] px-4 py-2 rounded-[12px] flex items-start justify-between gap-2"
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
                      <div>{item.year}</div>
                    </div>
                  ))}

                  {/* Input Form */}
                  <div className="bg-[#f9f9f5] rounded-[12px] p-3 space-y-2">
                    <div className="space-y-1">
                      <Label>Degree Name</Label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Institute Name</Label>
                      <Input
                        name="institute"
                        value={formData.institute}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Year</Label>
                      <Input
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Description</Label>
                      <Input
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                      />
                    </div>
                    <Btn type="submit" className="bg-[#b79e6b] px-[32px] py-[14px] rounded-[8px] text-white">
                      Save
                    </Btn>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                {/* <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                  
                </DialogClose> */}
                <div className="bg-[#f9f9f5] rounded-[12px] p-2 md:p-3 w-full mx-2">
                  <p className="p-1 rounded-2xl flex justify-center items-center gap-2">
                    <Image
                      src="/images/dashboard/profile/plus.png"
                      width={20}
                      height={20}
                      alt=""
                      className="cursor-pointer"
                    />
                    <span className="text-[#01503b] font-semibold text-[12px] md:text-[18px]">
                      Add New
                    </span>
                  </p>
                </div>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </CardContent>
    </Card>
  );
}
