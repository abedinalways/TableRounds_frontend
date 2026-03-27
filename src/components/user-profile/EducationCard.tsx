import { Card, CardContent } from '@/components/ui/card';
import { EducationItem } from '@/types/profile';
import EducationIcon from '../reusable/icons/EducationIcon';
import ScholarIcon from '../reusable/icons/ScholarIcon';

interface EducationCardProps {
  data: EducationItem[];
}

export default function EducationCard({ data }: EducationCardProps) {
  return (
    <Card className="font-[manrope]">
      <CardContent className="p-3 space-y-4">
        <h3 className="font-semibold text-[#01503b] flex items-center gap-2">
          <span className="w-[40px] h-[40px] rounded-[10px] bg-[#dbeafe] flex justify-center items-center">
            <EducationIcon />
          </span>{' '}
          Education
        </h3>

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
      </CardContent>
    </Card>
  );
}
