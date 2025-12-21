import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileData, ProfileTab } from '@/types/profile';
import EducationCard from './EducationCard';
import SkillBadges from './SkillBadges';
import SidebarActions from './SidebarActions';
import ExperienceCard from './ExperienceCard';
import PublicationCard from './PublicationCard';


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
      <TabsList className="grid grid-cols-4 md:w-[500px]">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <TabsContent value="overview">
            <EducationCard data={data.education} />
            <PublicationCard data={data.publications} />
          </TabsContent>

          <TabsContent value="education">
            <EducationCard data={data.education} />
          </TabsContent>

          <TabsContent value="experience">
            <ExperienceCard data={data.experience} />
          </TabsContent>

          <TabsContent value="activity">
            <p className="text-muted-foreground">
              Recent activity coming soon...
            </p>
          </TabsContent>
        </div>

        <div className="space-y-6">
          <SkillBadges skills={data.skills} />
          <SidebarActions />
        </div>
      </div>
    </Tabs>
  );
}
