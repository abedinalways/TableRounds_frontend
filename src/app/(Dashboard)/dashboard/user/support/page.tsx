'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ContactForm from '@/components/conatct/ContactForm';
import { useGetHelpQuery } from '@/app/redux/api/helpApi';
import DisclaimerContent from '@/components/help-support/DisclaimerContent';
import PrivacyPolicyContent from '@/components/help-support/PrivacyPolicyContent';
import TermsContent from '@/components/help-support/TermsContent';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<
    'privacy' | 'disclaimer' | 'terms' | 'contact'
  >('privacy');

  const { data, isLoading } = useGetHelpQuery();

  if (isLoading) {
    return <p className="p-10">Loading...</p>;
  }

  const helpData = data?.data?.[0];

  return (
    <div className="font-[manrope] text-[#01281E]">
      <h1 className="text-5xl font-bold mb-8">Help & Support</h1>

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
        <aside className="h-[216px] md:w-[266px] bg-white rounded-lg">
          <nav>
            <Button
              variant={activeTab === 'disclaimer' ? 'default' : 'ghost'}
              className="w-full py-6 text-lg"
              onClick={() => setActiveTab('disclaimer')}
            >
              Disclaimer
            </Button>

            <Button
              variant={activeTab === 'privacy' ? 'default' : 'ghost'}
              className="w-full py-6 text-lg"
              onClick={() => setActiveTab('privacy')}
            >
              Privacy Policy
            </Button>

            <Button
              variant={activeTab === 'terms' ? 'default' : 'ghost'}
              className="w-full py-6 text-lg"
              onClick={() => setActiveTab('terms')}
            >
              Terms & Conditions
            </Button>

            <Button
              variant={activeTab === 'contact' ? 'default' : 'ghost'}
              className="w-full py-6 text-lg"
              onClick={() => setActiveTab('contact')}
            >
              Contact
            </Button>
          </nav>
        </aside>

        <main className="flex-1 mt-16 md:mt-0">
          {activeTab === 'disclaimer' && (
            <DisclaimerContent html={helpData?.disclaimer ?? ''} />
          )}

          {activeTab === 'privacy' && (
            <PrivacyPolicyContent html={helpData?.privacy_policy ?? ''} />
          )}

          {activeTab === 'terms' && (
            <TermsContent html={helpData?.terms_of_conditions ?? ''} />
          )}

          {activeTab === 'contact' && <ContactForm />}
        </main>
      </div>
    </div>
  );
}
