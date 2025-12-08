import Image from 'next/image';
import React from 'react';

// JSON Data
const specialtiesData = {
  specialties: [
    {
      id: 1,
      name: 'Anesthesia/Medicine',
      icon: '/images/specialty/img01.png',
      label: 'Anesthesia/\nMedicine',
    },
    {
      id: 2,
      name: 'Cancer',
      icon: '/images/specialty/img02.png',
      label: 'Cancer',
    },
    {
      id: 3,
      name: 'Cleft/Craniofacial',
      icon: '/images/specialty/img03.png',
      label: 'Cleft/Craniofacial',
    },
    {
      id: 4,
      name: 'Cosmetics',
      icon: '/images/specialty/img04.png',
      label: 'Cosmetics',
    },
    {
      id: 5,
      name: 'Dentoalveolar',
      icon: '/images/specialty/img05.png',
      label: 'Dentoalveolar',
    },
    {
      id: 6,
      name: 'Implants',
      icon: '/images/specialty/img06.png',
      label: 'Implants',
    },
    {
      id: 7,
      name: 'Orthognathic',
      icon: '/images/specialty/img07.png',
      label: 'Orthognathic',
    },
    {
      id: 8,
      name: 'Pathology',
      icon: '/images/specialty/img08.png',
      label: 'Pathology',
    },
    {
      id: 9,
      name: 'Reconstruction',
      icon: '/images/specialty/img09.png',
      label: 'Reconstruction',
    },
    {
      id: 10,
      name: 'TMJ',
      icon: '/images/specialty/img10.png',
      label: 'TMJ',
    },
    {
      id: 11,
      name: 'Trauma',
      icon: '/images/specialty/img11.png',
      label: 'Trauma',
    },
  ],
};

const SpecialtyCard = () => {
  return (
    <div className="w-full px-4 py-12 font-[manrope]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {specialtiesData.specialties.map(specialty => (
            <div
              key={specialty.id}
              className="flex flex-col items-center justify-center gap-4 cursor-pointer transition-transform hover:scale-105"
            >
              <div className="background w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                    <Image
                      src={specialty.icon}
                      alt={specialty.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <p className="text-white text-center text-sm sm:text-base font-medium leading-tight whitespace-pre-line">
                {specialty.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialtyCard;
