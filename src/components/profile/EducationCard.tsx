import { Card, CardContent } from '@/components/ui/card';
import { EducationItem } from '@/types/profile';

interface EducationCardProps {
  data: EducationItem[];
}

export default function EducationCard({ data }: EducationCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">Education</h3>

        {data.map((item, index) => (
          <div key={index}>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {item.institute} • {item.year}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
