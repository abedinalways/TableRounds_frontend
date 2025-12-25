import { Card, CardContent } from '@/components/ui/card';
import { ExperienceItem } from '@/types/myProfile';
import BagIcon from '../reusable/icons/BagIcon';
import ScholarIcon from '../reusable/icons/ScholarIcon';
import LocationIcon from '../ui/LocationIcon';
import Image from 'next/image';
import { EditIcon } from '../reusable/icons/EditIcon';

interface ExperienceCardProps {
  data: ExperienceItem[];
}

export default function ExperienceCard({ data }: ExperienceCardProps) {
  return (
    <Card className="font-[manrope]">
      <CardContent className="p-3 space-y-4">
        <div className="flex justify-between gap-4 items-center">
          <h3 className="font-semibold text-[#01503b] text-[20px] flex items-center gap-2">
            <span className="w-[40px] h-[40px] rounded-[10px] bg-[#d1fae5] flex justify-center items-center">
              <BagIcon />
            </span>
            Experience
          </h3>
          <h4 className="flex items-center gap-2 text-[#01503b] text-[10px] md:text-[16px] cursor-pointer">
            <span>
              <EditIcon />
            </span>
            Edit
          </h4>
        </div>

        {data.map((item, index) => (
          <div
            key={index}
            className="bg-[#f9f9f5] p-4 rounded-[12px] flex items-start justify-between gap-4"
          >
            <div className="font-medium flex  items-start gap-2">
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
                  {item.role}
                </p>
                <p className=" text-muted-foreground text-[16px]">
                  {item.hospital}
                </p>
                <h4 className="flex items-center gap-2 text-[16px] text-[#6b7280]">
                  <LocationIcon /> {item.location}
                </h4>
                <p className="text-sm text-[16px] text-muted-foreground">
                  {item.specialty}
                </p>
              </div>
            </div>
            <div>{item.period}</div>
          </div>
        ))}
        <div className="bg-[#f9f9f5] rounded-[12px] p-2 md:p-3">
          <p className="p-1 rounded-2xl gap-2 flex justify-center items-center">
            <Image
              src="/images/dashboard/profile/plus.png"
              width={20}
              height={20}
              alt=""
              className="cursor-pointer"
            />
            <span className="text-[#01503b]  font-semibold text-[12px] md:text-[18px]">
              Add New
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
