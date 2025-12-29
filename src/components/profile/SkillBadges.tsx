import { Badge } from '@/components/ui/badge';
import BagIcon from '../reusable/icons/BagIcon';

interface SkillBadgesProps {
  skills: string[];
}

export default function SkillBadges({ skills }: SkillBadgesProps) {
  return (
    <div className="bg-white rounded-2xl p-3 h-fit space-y-4 font-[manrope]">
      <h3 className="font-semibold text-[#01503b] text-[20px] flex items-center gap-2">
        <span className="w-[40px] h-[40px] rounded-[10px] bg-[#d1fae5] flex justify-center items-center">
          <BagIcon />
        </span>
        Skills
      </h3>
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
      </div>
    </div>
  );
}
