'use client';
import { HelpContent } from '@/components/help-support/HelpContent';
import { Sidebar } from '@/components/help-support/Sidebar';
import { useState, useEffect } from 'react';
import type { HelpSupportData, SectionId } from '@/types/help-support';

export default function HelpSupportPage() {
  const [active, setActive] = useState<SectionId>('privacy');
  const [data, setData] = useState<HelpSupportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/help-support.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load help data');
        return res.json();
      })
      .then((json: HelpSupportData) => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">Loading help content...</div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-6">
        Failed to load help content.
      </div>
    );
  }

  const section = data.sections[active];

  return (
    <div className="container mx-auto px-4 py-6 font-[manrope]">
      <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-semibold mb-2">Help & Support</h2>
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 md:gap-6">
        <Sidebar
          items={data.sidebar}
          active={active}
          onChange={id => setActive(id as SectionId)}
        />
        <HelpContent
          title={section.title}
          intro={section.intro}
          blocks={section.blocks}
        />
      </div>
    </div>
  );
}
