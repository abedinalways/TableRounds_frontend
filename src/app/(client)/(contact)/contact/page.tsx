'use client';

import ContactForm from '@/components/conatct/ContactForm';
import Image from 'next/image';


export default function ContactPage() {
  return (
    <section className="w-full bg-[#f9f9f4] py-20 mt-10 font-[manrope] relative">
      <div className="max-w-7xl mx-auto px-4 z-30 mt-10">
        <h2 className="text-center text-3xl md:text-[48px] font-semibold text-[#01281E] mb-2">
          Get in Touch
        </h2>

        <p className="text-center text-sm md:text-[18px] text-gray-500 mb-8 max-w-[676px] mx-auto">
          Have questions or ideas on how we can improve your TableRounds
          experience? Send us a message and we&apos;ll reply as soon as
          possible!
        </p>

        <ContactForm />
      </div>

      <div className="absolute top-2 left-0 opacity-50">
        <Image src="/images/contact/TR.png" width={486} height={486} alt="" />
      </div>
    </section>
  );
}
