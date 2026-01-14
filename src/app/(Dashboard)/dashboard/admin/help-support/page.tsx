'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import PrivacyPolicyContent from '@/components/admin-support/PrivacyPolicyContent';
import DisclaimerContent from '@/components/admin-support/DisclaimerContent';
import TermsContent from '@/components/admin-support/TermsContent';


export default function AdminSupportPage() {
  const [activeTab, setActiveTab] = useState<
    'privacy' | 'disclaimer' | 'terms'
  >('privacy');

  return (
    <div className="font-[manrope] text-[#01281E]">
      <h1 className="text-5xl font-bold  mb-8">Legal</h1>

      <div className="min-h-screen md:flex gap-4">
        {/* Sidebar */}
        <aside className="h-[216px] md:w-[266px] bg-white rounded-lg ">
          <nav className="">
            <Button
              variant={activeTab === 'disclaimer' ? 'default' : 'ghost'}
              className="w-full mx-auto  text-lg py-6 text-center rounded-t-2xl rounded-b-none!"
              onClick={() => setActiveTab('disclaimer')}
            >
              Disclaimer
            </Button>
            <Button
              variant={activeTab === 'privacy' ? 'default' : 'ghost'}
              className="w-full mx-auto  text-lg py-6 text-center rounded-t-2xl rounded-b-none!"
              onClick={() => setActiveTab('privacy')}
            >
              Privacy Policy
            </Button>

            <Button
              variant={activeTab === 'terms' ? 'default' : 'ghost'}
              className="w-full mx-auto  text-lg py-6 text-center rounded-t-2xl rounded-b-none!"
              onClick={() => setActiveTab('terms')}
            >
              Terms & Conditions
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1  overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'privacy' && <PrivacyPolicyContent />}
            {activeTab === 'disclaimer' && <DisclaimerContent />}
            {activeTab === 'terms' && <TermsContent />}
          </div>
        </main>
      </div>
    </div>
  );
}
