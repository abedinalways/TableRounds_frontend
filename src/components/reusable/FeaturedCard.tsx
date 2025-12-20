import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const FeaturedCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <Card className="group w-full cursor-pointer transition-all duration-300 hover:bg-[#01503b] hover:shadow-xl hover:-translate-y-2 hover:scale-105 border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="mb-2">
          <Image
            src={icon}
            width={48}
            height={48}
            alt={title}
            className="w-12 h-12 transition-all duration-300 group-hover:brightness-0 group-hover:invert group-hover:scale-110"
          />
        </div>
        <h3 className="text-[24px] font-semibold mb-2 text-[#01281e] group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[16px] text-[#01281e] group-hover:text-white transition-colors duration-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};
export default FeaturedCard;
