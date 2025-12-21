import { Card, CardContent } from '@/components/ui/card';
import { ExperienceItem } from '@/types/profile';

interface ExperienceCardProps {
  data: ExperienceItem[];
}

export default function ExperienceCard({ data }: ExperienceCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">Experience</h3>

        {data.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className="border-l-2 border-green-600 pl-4"
          >
            <p className="font-medium">{item.role}</p>
            <p className="text-sm text-muted-foreground">{item.hospital}</p>
            <p className="text-xs text-muted-foreground">{item.period}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
