import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileData, ProfileTab } from '@/types/profile';
import EducationCard from './EducationCard';
import SkillBadges from './SkillBadges';

import ExperienceCard from './ExperienceCard';
import PublicationCard from './PublicationCard';
import PeopleIcon from '../reusable/icons/PeopleIcon';
import EduIcon from '../reusable/icons/EduIcon';
import ExperienceIcon from '../reusable/icons/ExperienceIcon';
import ActivityIcon from '../reusable/icons/ActivityIcon';
import QuickActions from './QuickActions';


interface ProfileTabsProps {
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
  data: ProfileData;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
  data,
}: ProfileTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={value => setActiveTab(value as ProfileTab)}
      className="mt-6"
    >
      <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-5 md:gap-8">
        <TabsTrigger value="overview">
          <PeopleIcon /> Overview
        </TabsTrigger>
        <TabsTrigger value="education">
          <EduIcon /> Education
        </TabsTrigger>
        <TabsTrigger value="experience">
          <ExperienceIcon /> Experience
        </TabsTrigger>
        <TabsTrigger value="publications">
          <ActivityIcon /> Publications
        </TabsTrigger>
        <TabsTrigger value="activity">
          <ActivityIcon /> Activity
        </TabsTrigger>
      </TabsList>

      <div className=" mt-6">
        <div>
          <TabsContent
            value="overview"
            className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <EducationCard data={data.education} />
              <ExperienceCard data={data.experience} />
            </div>
            <div className="space-y-6">
              <PublicationCard data={data.publications} />

              <SkillBadges skills={data.skills} />
              <QuickActions />
            </div>
          </TabsContent>

          <TabsContent value="education">
            <EducationCard data={data.education} />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceCard data={data.experience} />
          </TabsContent>
          <TabsContent value="publications">
            <PublicationCard data={data.publications} />
          </TabsContent>

          <TabsContent value="activity">
            <p className="text-muted-foreground">
              Recent activity coming soon...
            </p>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
