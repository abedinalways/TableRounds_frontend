import { CardContent,} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

type Block = {
  heading: string;
  items?: string[];
  description?: string;
};

type Props = {
  title: string;
  intro: string;
  blocks: Block[];
};

export function HelpContent({ title, intro, blocks }: Props) {
  return (
    <div className="w-full font-[manrope]">
      <div className="background text-white rounded-2xl py-8">
        <h1 className="text-xl md:text-2xl text-center font-semibold">{title}</h1>
      </div>
      <CardContent className="p-4 md:p-6 space-y-6">
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {intro}
        </p>

        {blocks.map((block, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="font-semibold text-base md:text-lg">
              {block.heading}
            </h3>
            {block.description && (
              <p className="text-sm text-muted-foreground">
                {block.description}
              </p>
            )}
            {block.items && (
              <ul className="space-y-2">
                {block.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm md:text-base">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </CardContent>
    </div>
  );
}
