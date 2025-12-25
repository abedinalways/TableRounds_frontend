import { Badge } from '@/components/ui/badge';
import BagIcon from '../reusable/icons/BagIcon';
import { EditIcon } from '../reusable/icons/EditIcon';
import Image from 'next/image';

interface SkillBadgesProps {
  skills: string[];
}

export default function SkillBadges({ skills }: SkillBadgesProps) {
  return (
    <div className="bg-white rounded-2xl p-3 h-fit space-y-4 font-[manrope]">
      <div className="flex justify-between gap-4 items-center">
        <h3 className="font-semibold text-[#01503b] text-[20px] flex items-center gap-2">
          <span className="w-[40px] h-[40px] rounded-[10px] bg-[#d1fae5] flex justify-center items-center">
            <BagIcon />
          </span>
          Skills
        </h3>
        <h4 className="flex items-center gap-2 text-[#01503b] text-[10px] md:text-[16px] cursor-pointer">
          <span>
            <EditIcon />
          </span>
          Edit
        </h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <Badge
            key={skill}
            variant="secondary"
            className="bg-[#d1fae5] text-[#01503b] text-sm md:text-[18px] font-normal rounded-full px-[16px] py-[12px]"
          >
            {skill}
          </Badge>
        ))}
        <div className="background text-white rounded-full p-2 md:p-3">
          <p className="  flex justify-center items-center gap-2 ">
            <Image
              src="/images/dashboard/profile/plus02.png"
              width={20}
              height={20}
              alt=""
              className="cursor-pointer"
            />
            <span className="text-white  font-semibold text-[12px] md:text-[18px]">Add New</span>
          </p>
        </div>
      </div>
    </div>
  );
}
