import React from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className=" mx-2 md:mx-auto font-[manrope] my-40 ">
      <CardHeader className="background text-white rounded-2xl py-10">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Privacy Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Introduction
          </h2>

          <p className="text-sm md:text-[18px]">
            Welcome to our Medical & Dental Education Platform
            (&quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our
            educational testing and quiz application.
          </p>
          <br />
          <p className="text-sm md:text-[18px]">
            We are committed to protecting your privacy and ensuring the
            security of your personal information. This policy applies to all
            users of our Platform, including medical and dental students,
            residents, practitioners, and educators.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Personal Information
          </h2>

          <p className="text-[18px] leading-[160%]">
            When you register for an account, we collect:
          </p>
          <ul className="mt-3 ">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Full name
              and contact information
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Email
              address and phone number
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />{' '}
              Professional credentials and qualifications
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Profile
              information and preferences
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Usage Data
          </h2>

          <p className="text-sm md:text-[18px]">
            We automatically collect information about your interactions with
            the Platform, such as:
          </p>
          <ul className="text-sm md:text-[18px] mt-3">
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> IP
              address, browser type, and device information
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Pages
              viewed, time spent, and navigation paths
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Course
              progress and assessment results
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Communication Data
          </h2>

          <p className="text-sm md:text-[18px]">
            We automatically collect information about your interactions with
            the Platform:
          </p>
          <ul className="text-sm md:text-[18px] mt-3">
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              Direct messages with other users (instructors, peers)
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Forum
              posts, comments, and discussions
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              Customer support inquiries and feedback
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Your Privacy Rights
          </h2>
          <p className="text-sm md:text-[18px]">
            You have the following rights regarding your personal data:
          </p>
          <ul className="text-sm md:text-[18px] mt-3">
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              <span className="font-semibold">Access:</span>Request access to
              your personal data and obtain a copy of the information we hold
              about you.
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />{' '}
              <span className="font-semibold">Correction: </span> Request
              correction of inaccurate or incomplete personal data.
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              <span className="font-semibold">Deletion: </span>Request deletion
              of your personal data, subject to certain legal exceptions.
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              <span className="font-semibold">Data Portability: </span>Request a
              copy of your data in a structured, machine-readable format.
            </li>
            <li className="flex gap-2">
              {' '}
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              <span className="font-semibold">Opt-Out: </span>Opt-out of
              marketing communications and non-essential data collection.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Third-Party Services
          </h2>

          <p className="text-sm md:text-[18px]">
            Our Platform may contain links to third-party websites or integrate
            with third-party services. We are not responsible for the privacy
            practices of these external services.
          </p>
          <br />
          <p className="text-sm md:text-[18px]">
            We recommend reviewing the privacy policies of any third-party
            services before providing them with your information.
          </p>
        </section>
      </CardContent>
    </div>
  );
}
