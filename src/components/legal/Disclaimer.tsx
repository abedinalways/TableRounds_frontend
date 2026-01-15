import React from 'react'
import { CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
export default function Disclaimer() {
  return (
    <div className="font-[manrope] my-40 mx-2 md:mx-auto">
      <CardHeader className="background text-white rounded-2xl py-10">
        <CardTitle className="text-3xl md:text-[48px] font-bold text-center">
          Disclaimer
        </CardTitle>
      </CardHeader>
      <div className="space-y-10 mt-10 text-gray-700 leading-relaxed mx-4 ">
        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Disclaimer
          </h2>

          <p className="text-sm md:text-[18px] leading-[160%]">
            Educational and Medical Information Disclaimer
          </p>
        </section>
        <section className="py-6 px-4 background-clr rounded-lg border-l-4 border-[#b79e6b]">
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3 text-amber-900">
            Important Notice
          </h2>
          <p className="text-sm md:text-[18px]">
            The information provided on this platform is for educational
            purposes only and should not be considered as medical advice,
            diagnosis, or treatment. Always seek the advice of qualified
            healthcare professionals with any questions you may have regarding
            medical conditions or treatments.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Educational Content
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            All quizzes, tests, study materials, and educational content
            provided on the Medical & Dental Education Platform are designed for
            training and educational purposes. While we strive to ensure
            accuracy and relevance, this content:
          </p>
          <ul className="mt-3 ">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Should
              not replace clinical judgment or professional medical education
              programs
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Is
              intended to supplement, not substitute, formal medical or dental
              education
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> May not
              reflect the most current medical research or practices
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Should be
              verified through additional authoritative sources
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            No Medical Advice
          </h2>

          <p className="text-sm md:text-[18px] leading-[160%]">
            The Platform does not provide medical advice, diagnosis, or
            treatment. Always seek the advice of qualified healthcare
            professionals for any medical condition or before making clinical
            decisions.
          </p>
          <section className="  text-sm md:text-[18px] bg-[#F0F2F4] rounded-lg border-l-4 border-[#6b7280] py-4 my-6">
            <ul className="list-disc px-6 space-y-3">
              <li>
                {' '}
                <span className="font-semibold">
                  {' '}
                  Never disregard professional medical advice:{' '}
                </span>
                or delay seeking it because of information accessed through this
                platform.
              </li>
              <li>
                {' '}
                <span className="font-semibold">
                  {' '}
                  Always consult qualified healthcare providers:{' '}
                </span>
                regarding any medical condition or treatment.
              </li>
              <li>
                {' '}
                <span className="font-semibold">
                  {' '}
                  Call emergency services immediately:{' '}
                </span>
                if you believe you have a medical emergency.
              </li>
            </ul>
          </section>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px]  font-semibold mb-3">
            Accuracy and Completeness
          </h2>
          <p className="text-sm md:text-[18px] leading-[160%]">
            While we make every effort to ensure that the educational content on
            our platform is accurate, current, and complete:
          </p>
          <ul className="mt-3 ">
            <li className="flex gap-2 text-sm md:text-[18px] ">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Medical
              knowledge is constantly evolving, and information may become
              outdated
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Errors or
              omissions may occur despite our best efforts
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Content
              may not be applicable to all situations or jurisdictions
            </li>
            <li className="flex gap-2 text-sm md:text-[18px]">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" /> Users are
              responsible for verifying information before applying it in
              practice
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Third-Party Content
          </h2>

          <p className="text-sm md:text-[18px] leading-[160%]">
            Our platform may contain links to third-party websites or reference
            third-party materials. We do not endorse, warrant, or assume
            responsibility for the accuracy, completeness, or usefulness of any
            third-party content. Users access such content at their own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            Updates and Modifications
          </h2>

          <p className="text-sm md:text-[18px] leading-[160%]">
            We reserve the right to modify, update, or discontinue any content
            on this platform at any time without notice. We are not obligated to
            update information or correct inaccuracies, though we strive to
            maintain current and accurate content.
          </p>
        </section>
        <section className=" px-6 background-color text-sm md:text-[18px] bg-[#F0F2F4] rounded-lg border-l-4 border-[#01503b] py-4 my-6">
          <h2 className="text-2xl md:text-[32px] font-semibold mb-3">
            By Using This Platform
          </h2>
          <p className="text-sm md:text-[18px] font-normal mb-3">
            By accessing and using the Medical & Dental Education Platform, you
            acknowledge that you have read, understood, and agree to this
            disclaimer. If you do not agree with any part of this disclaimer,
            please discontinue use of the platform immediately.
          </p>
        </section>
      </div>
    </div>
  );
}
