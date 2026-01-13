'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PrivacyPolicyContent from '@/components/help-support/PrivacyPolicyContent';
import DisclaimerContent from '@/components/help-support/DisclaimerContent';
import TermsContent from '@/components/help-support/TermsContent';
import Image from 'next/image';
import ContactForm from '@/components/conatct/ContactForm';


export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'disclaimer' | 'terms' | 'contact'>('privacy');

  return (
    <div className="font-[manrope] text-[#01281E]">
      <h1 className="text-5xl font-bold  mb-8">Help & Support</h1>
      <div className="relative z-10">
        <Image
          src="/images/TR.png"
          width={309}
          height={309}
          alt=""
          className="opacity-40 absolute top-200 right-4"
        />
      </div>
      <div className="w-full md:flex gap-4">
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
            <Button
              variant={activeTab === 'contact' ? 'default' : 'ghost'}
              className="w-full mx-auto  text-lg py-6 text-center rounded-t-2xl rounded-b-none!"
              onClick={() => setActiveTab('contact')}
            >
              Contact
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1   mt-16 md:mt-0">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'disclaimer' && <DisclaimerContent />}
            {activeTab === 'privacy' && <PrivacyPolicyContent />}
            {activeTab === 'terms' && <TermsContent />}
            {activeTab === 'contact' && <ContactForm />}
          </div>
        </main>
      </div>
    </div>
  );
}
