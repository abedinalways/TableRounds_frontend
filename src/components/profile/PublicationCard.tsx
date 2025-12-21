import { Card, CardContent } from '@/components/ui/card';
import { PublicationItem } from '@/types/profile';

interface PublicationCardProps {
  data: PublicationItem[];
}

export default function PublicationCard({ data }: PublicationCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold">Publications</h3>

        {data.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="flex items-start gap-3"
          >
            <div className="h-2 w-2 mt-2 rounded-full bg-green-600" />

            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                Published in {item.year}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
