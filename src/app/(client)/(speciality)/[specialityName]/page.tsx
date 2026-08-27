'use client';

import Banner from '@/components/OMS/Banner';
import Brand from '@/components/OMS/Brand';
import Elevate from '@/components/OMS/Elevate';
import Features from '@/components/OMS/Features';

import React from 'react';
import { useAllSpecialties, useSpecialityById } from '@/hooks/useSpecialtyData';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Speciality from '@/components/OMS/Speciality';

export default function OmsPage() {
  const params = useParams();
  const specialityName = params.specialityName as string;
  const { data: specialtiesData, isLoading, error } = useAllSpecialties();

  const specialties = specialtiesData?.data || [];
  const match = specialties.find(
    s =>
      s.name.toLowerCase().replace(/\s+/g, '-') ===
        specialityName.toLowerCase().replace(/\s+/g, '-') ||
      s.name.toLowerCase().replace(/[\s-]+/g, '') ===
        specialityName.toLowerCase().replace(/[\s-]+/g, ''),
  );

  // Fetch the full single-specialty data (banner/brand/topic images) by ID,
  // instead of relying only on the list which doesn't include the images.
  const { data: speciality, isLoading: isSpecialityLoading } =
    useSpecialityById(match?.id || match?._id || null);

  if (isLoading || isSpecialityLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error || !speciality) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            speciality Not Found
          </h1>
          <p className="text-gray-600">
            The speciality {specialityName} could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner
        specialityName={speciality.name}
        specialityBannerImg={speciality.speciality_banner_img}
      />
      <Features />
      <Speciality
        topics={speciality.topics}
        specialityImg={speciality.speciality_banner_img}
      />
      <Brand brandImg={speciality.brand_img} />
      <Elevate specialityName={speciality.name} />
    </div>
  );
}
