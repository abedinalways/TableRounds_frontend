'use client';

import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileData, ProfileTab } from '@/types/myProfile';

import EducationCard from './EducationCard';
import SkillBadges from './SkillBadges';
import ExperienceCard from './ExperienceCard';
import PublicationCard from './PublicationCard';
import QuickActions from './QuickActions';

import PeopleIcon from '../reusable/icons/PeopleIcon';
import EduIcon from '../reusable/icons/EduIcon';
import ExperienceIcon from '../reusable/icons/ExperienceIcon';
import ActivityIcon from '../reusable/icons/ActivityIcon';
import QuestionBankSolved from './ActivityCard';
import AccountSettings from '../settings/AccountSettings';
import { useGetStatisticsQuery } from '@/app/redux/api/StatisTicsApi';
import { useMeQuery } from '@/app/redux/api/authApi';

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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const { data: user } = useMeQuery();
  console.log(user, 'user data=====================++++++++++++++++');
  const { data: statisticsData, isLoading: statisticsLoading } =
    useGetStatisticsQuery();

  const questionBankStats = useMemo(() => {
    const stats = statisticsData?.data;

    if (!stats) {
      return {
        completion: 0,
        ranking: '-',
        correctRate: 0,
        bestTopic: 'N/A',
      };
    }

    const bestTopicItem = [...stats.performance_by_topic].sort(
      (a, b) => b.correct_percentage - a.correct_percentage,
    )[0];

    return {
      completion: Math.round(stats.question_bank.progress_percentage ?? 0),
      ranking: bestTopicItem?.percentile_rank ?? '-',
      correctRate: Math.round(stats.performance.correct_percentage_avg ?? 0),
      bestTopic: bestTopicItem?.topic ?? 'N/A',
    };
  }, [statisticsData]);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
      );
    });

    return () => ctx.revert();
  }, [activeTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={value => setActiveTab(value as ProfileTab)}
      className="mt-6"
    >
      <TabsList className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-full rounded-2xl md:p-4 xl:p-6 p-3 bg-white mb-20 md:mb-4 h-fit">
        <TabsTrigger value="overview">
          <PeopleIcon /> Overview
        </TabsTrigger>
        <TabsTrigger value="education">
          <EduIcon /> Education
        </TabsTrigger>
        <TabsTrigger value="experience">
          <ExperienceIcon />
          Experience
        </TabsTrigger>
        <TabsTrigger value="publications">
          <ActivityIcon /> Publications
        </TabsTrigger>
        <TabsTrigger value="activity">
          <ActivityIcon /> Activity
        </TabsTrigger>
      </TabsList>

      <div ref={contentRef} className="mt-6">
        <TabsContent value="overview" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <EducationCard data={data.education} />
              <ExperienceCard data={data.experience} />

              {statisticsLoading ? (
                <div className="p-6 rounded-2xl border bg-white">
                  Loading question bank statistics...
                </div>
              ) : (
                <QuestionBankSolved data={questionBankStats} />
              )}
            </div>

            <div className="space-y-6">
              <PublicationCard data={data.publications} />
              <SkillBadges skills={data.skills} />
              <QuickActions />
            </div>
          </div>
          <div>
            <AccountSettings />
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
          <div className="max-w-xl">
            {statisticsLoading ? (
              <div className="p-6 rounded-2xl border bg-white">
                Loading question bank statistics...
              </div>
            ) : (
              <QuestionBankSolved data={questionBankStats} />
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
