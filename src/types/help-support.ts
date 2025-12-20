// src/types/help-support.ts

export type SectionId = 'privacy' | 'disclaimer' | 'terms';

export interface HelpBlock {
  heading: string;
  items: string[];
}

export interface HelpSection {
  title: string;
  intro: string;
  blocks: HelpBlock[];
}

export interface HelpSupportData {
  sidebar: {
    id: SectionId;
    label: string;
  }[];
  sections: {
    [key in SectionId]: HelpSection;
  };
}
