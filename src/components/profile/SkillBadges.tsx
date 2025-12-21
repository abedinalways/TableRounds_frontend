import { Badge } from '@/components/ui/badge';

interface SkillBadgesProps {
  skills: string[];
}

export default function SkillBadges({ skills }: SkillBadgesProps) {
  return (
    <div className="bg-white rounded-2xl p-6">
      <h3 className="font-semibold mb-3">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <Badge key={skill} variant="secondary">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
