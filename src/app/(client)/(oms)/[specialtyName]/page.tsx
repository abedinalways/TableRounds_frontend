'use client';

import Banner from '@/components/OMS/Banner'
import Brand from '@/components/OMS/Brand'
import Elevate from '@/components/OMS/Elevate'
import Features from '@/components/OMS/Features'
import Specialty from '@/components/OMS/Specialty'
import React from 'react'
import { useAllSpecialties } from '@/hooks/useSpecialtyData'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function OmsPage() {
  const params = useParams();
  const specialtyName = params.specialtyName as string;
  const { data: specialtiesData, isLoading, error } = useAllSpecialties();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const specialties = specialtiesData?.data || [];
  const specialty = specialties.find(s => 
    s.specialty_name.toLowerCase().replace(/\s+/g, '-') === specialtyName.toLowerCase().replace(/\s+/g, '-') ||
    s.specialty_name.toLowerCase().replace(/[\s-]+/g, '') === specialtyName.toLowerCase().replace(/[\s-]+/g, '')
  );

  if (error || !specialty) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Specialty Not Found</h1>
          <p className="text-gray-600">The specialty {specialtyName} could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner 
        specialtyName={specialty.specialty_name}
        specialtyBannerImg={specialty.specialty_banner_img}
      />
      <Features />
      <Specialty 
        topics={specialty.topics}
        specialtyImg={specialty.specialty_banner_img}
      />
      <Brand brandImg={specialty.brand_img} />
      <Elevate specialtyName={specialty.specialty_name}/>
    </div>
  )
}
