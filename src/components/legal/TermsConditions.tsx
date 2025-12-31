import React from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, X } from 'lucide-react';
export default function TermsConditions() {
  return (
    <div className="mx-2 md:mx-auto font-[manrope] my-40">
      <CardHeader className="background text-white rounded-lg py-10">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Terms & Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Terms & Conditions
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            Platform usage agreement and user responsibilities
          </p>
        </section>
        <section className="py-6 px-4 background-clr rounded-lg border-l-4 border-[#b79e6b]">
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3 text-amber-900">
            Agreement to Terms
          </h2>
          <p className="text-sm md:text-[18px]">
            By accessing and using the Medical & Dental Education Platform, you
            agree to be bound by these Terms and Conditions. Please read them
            carefully before using our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Acceptance of Terms
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            These Terms and Conditions (&quot;Terms&quot;) govern your access to
            and use of the Medical & Dental Education Platform
            (&quot;Platform&quot;, &quot;Service&quot;, &quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;). By creating an account or using
            our Platform, you acknowledge that you have read, understood, and
            agree to be bound by these Terms.
          </p>
        </section>
        {/*  */}
        <section className=" px-6 text-sm md:text-[18px] bg-[#F0F2F4] rounded-lg border-l-4 border-[#6b7280] py-4 my-6">
          <p className="text-sm md:text-[18px] leading-[160%]">
            If you do not agree to these Terms, you must not access or use the
            Platform. We reserve the right to modify these Terms at any time,
            and your continued use constitutes acceptance of any changes.
          </p>
        </section>
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            User Accounts
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            Registration Requirements
          </p>
        </section>
        <section className=" p-6 text-sm md:text-[18px] bg-[#F0F2F4] rounded-lg border-l-4 border-[#6b7280] py-4 my-6">
          <p className="text-md md:text-[20px] font-semibold leading-[160%]">
            Account Responsibilities
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              You must be at least 18 years old to create an account
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Provide
              accurate, current, and complete information
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Maintain
              and update your information as needed
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              Keep your password secure and confidential
            </li>
          </ul>
        </section>
        {/*  */}
        <section className=" px-6 text-sm md:text-[18px] bg-[#F0F2F4] rounded-lg border-l-4 border-[#6b7280] py-4 my-6">
          <p className="text-md md:text-[20px] font-semibold leading-[160%]">
            Account Responsibilities
          </p>
          <p className="text-sm md:text-[18px] leading-[160%]">
            You are responsible for all activities under your account. You agree
            to:
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Notify us
              immediately of any unauthorized use
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Not share
              your account credentials with others
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Accept
              responsibility for all account activity
            </li>
          </ul>
        </section>
        {/*  */}
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Acceptable Use Policy
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            You agree NOT to use the Platform to:
          </p>
        </section>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div className="px-4 text-sm md:text-[14px] font-bold bg-color rounded-lg border-l-4 border-[#f00] py-4 ">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Violate any laws or regulations
              </span>
            </div>
            <div className="px-4 text-sm md:text-[14px] font-bold bg-color rounded-lg border-l-4 border-[#f00] py-4 ">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Violate any laws or regulations
              </span>
            </div>
            <div className="px-4 text-sm md:text-[14px] font-bold bg-color rounded-lg border-l-4 border-[#f00] py-4 ">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Violate any laws or regulations
              </span>
            </div>
            <div className="px-4 text-sm md:text-[14px] font-bold bg-color rounded-lg border-l-4 border-[#f00] py-4 ">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Harass, abuse, or harm others
              </span>
            </div>
            <div className="px-4 text-sm md:text-[14px] font-bold bg-color rounded-lg border-l-4 border-[#f00] py-4 ">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Attempt unauthorized access
              </span>
            </div>
            <div className="px-4 text-sm md:text-[14px] font-bold bg-color rounded-lg border-l-4 border-[#f00] py-4 ">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Share or distribute content illegally
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Intellectual Property
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            All content on the Platform, including text, graphics, logos,
            images, videos, software, and educational materials, is owned by or
            licensed to us and protected by copyright, trademark, and other
            intellectual property laws.
          </p>
        </section>
        {/*  */}
        <section className=" px-6 text-sm md:text-[18px] bg-[#F0F2F4] rounded-lg border-l-4 border-[#6b7280] py-4 my-6">
          <p className="text-md md:text-[20px] font-semibold leading-[160%]">
            What You Can Do:
          </p>

          <ul className="mt-3 space-y-2">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Use
              materials for personal educational purposes
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Download
              content for offline study (where permitted)
            </li>
          </ul>
        </section>
        {/*  */}
        <section className=" px-6 text-sm md:text-[18px] bg-color rounded-lg border-l-4 border-[#f00] py-4 my-6">
          <p className="text-md md:text-[20px] font-semibold leading-[160%]">
            What You Cannot Do:
          </p>

          <ul className="mt-3 space-y-2">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Reproduce, distribute, or sell our content
              </span>
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <span className="flex items-center text-[#314158] gap-2">
                <span className="text-red-600">
                  <X size="24px" />
                </span>{' '}
                Modify or create derivative works
              </span>
            </li>
            <span className="flex items-center text-[#314158] gap-2">
              <span className="text-red-600">
                <X size="24px" />
              </span>{' '}
              Remove copyright or proprietary notices
            </span>
          </ul>
        </section>
        {/*  */}
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Termination
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            We reserve the right to suspend or terminate your access to the
            Platform at any time, with or without notice, for:
          </p>
        </section>
        {/*  */}
        <section className=" px-6 text-sm md:text-[18px] background-clr rounded-lg border-l-4 border-[#b79e6b] py-4 my-6">
          <p className="text-sm md:text-[18px] leading-[160%]">
            To the maximum extent permitted by law, we shall not be liable for
            any indirect, incidental, special, consequential, or punitive
            damages, including loss of profits, data, or other intangible losses
            resulting from:
          </p>
          <ul className="mt-3 space-y-2">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Your
              access to or use of (or inability to use) the Platform
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Any
              conduct or content of third parties on the Platform
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
              Unauthorized access to or alteration of your data
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Governing Law
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            These Terms shall be governed by and construed in accordance with
            the laws of the State of Illinois, United States, without regard to
            its conflict of law provisions. Any disputes arising from these
            Terms or your use of the Platform shall be resolved in the courts
            located in Chicago, Illinois.
          </p>
        </section>
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Changes to Terms
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            We reserve the right to modify these Terms at any time. We will
            notify users of material changes via email or prominent notice on
            the Platform. Your continued use after changes become effective
            constitutes acceptance of the modified Terms.
          </p>
        </section>
      </CardContent>
    </div>
  );
}
