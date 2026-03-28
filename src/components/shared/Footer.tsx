'use client';
import React, { useState } from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type EmailProvider =
  | 'mailto'
  | 'gmail'
  | 'outlook'
  | 'yahoo'
  | 'protonmail'
  | 'aol'
  | 'icloud'
  | 'zoho';

const Footer = () => {
  const email = 'michaeljcimba@gmail.com';
  const [showOptions, setShowOptions] = useState(false);

  const emailProviders: Record<Exclude<EmailProvider, 'mailto'>, string> = {
    gmail: `https://mail.google.com/mail/u/0/#inbox?compose=new&to=${encodeURIComponent(email)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}`,
    yahoo: `https://mail.yahoo.com/d/compose?to=${encodeURIComponent(email)}`,
    protonmail: `https://mail.proton.me/u/0/compose?to=${encodeURIComponent(email)}`,
    aol: `https://mail.aol.com/webmail-std/en-us/compose?to=${encodeURIComponent(email)}`,
    icloud: `https://www.icloud.com/mail/compose?to=${encodeURIComponent(email)}`,
    zoho: `https://mail.zoho.com/zm/compose?to=${encodeURIComponent(email)}`,
  };

  const openEmailClient = (provider: EmailProvider) => {
    if (provider === 'mailto') {
      window.location.href = `mailto:${email}`;
    } else {
      window.open(emailProviders[provider], '_blank');
    }
    setShowOptions(false);
  };

  return (
    <footer
      className="relative w-full bg-[#f5f1e8] pt-30 font-[manrope]"
      style={{
        backgroundImage: 'url(/images/footer-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-10 md:mx-40 gap-4 ">
          {/* Logo Section */}
          <div className="flex flex-col items-start space-y-5 md:px-6">
            <div className="flex items-center ">
              <div className="w-12 h-12 rounded-full  flex items-center justify-center">
                <Image
                  src="/images/footer_logo.png"
                  width={40}
                  height={40}
                  alt="TableRounds Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-[#205248]">
                  TableRounds
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-2 ml-5">
              <span className="text-sm text-gray-700">Social:</span>
              <a
                href="https://instagram.com/TableRounds.ai"
                className="text-gray-700 hover:text-[#1e5a4f] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {/* <div className="relative mt-1">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-gray-700 hover:text-[#1e5a4f] transition-colors cursor-pointer"
                  aria-label="Email"
                >
                  <Mail className="w-6 h-6" />
                </button>

                {showOptions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowOptions(false)}
                    />
                    <div className="absolute bottom-full mb-2 right-0 bg-white shadow-lg rounded-lg overflow-hidden z-20 min-w-[180px]">
                      <button
                        onClick={() => openEmailClient('mailto')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
                      >
                        📧 Default Email App
                      </button>
                      <button
                        onClick={() => openEmailClient('gmail')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
                      >
                        🔴 Gmail
                      </button>
                      <button
                        onClick={() => openEmailClient('outlook')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
                      >
                        📘 Outlook
                      </button>
                      <button
                        onClick={() => openEmailClient('yahoo')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
                      >
                        🟣 Yahoo Mail
                      </button>
                      <button
                        onClick={() => openEmailClient('protonmail')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
                      >
                        🔒 Proton Mail
                      </button>
                      <button
                        onClick={() => openEmailClient('icloud')}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-colors"
                      >
                        🍎 iCloud Mail
                      </button>
                    </div>
                  </>
                )}
              </div> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <a
              href="/pricing"
              className="text-sm text-[#4a4c5] hover:text-[#1e5a4f] transition-colors"
            >
              Question Bank
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              How It Works
            </a>
            <a
              href="/contact"
              className="text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Legal */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <a
              href="/disclaimer"
              className="text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              Disclaimer
            </a>
            <a
              href="/privacy-policy"
              className="text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-conditions"
              className="text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              Terms & Conditions
            </a>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Us
            </h3>
            <p className="text-sm text-gray-700">We&apos;re Here to Help</p>
            <a
              href="mailto:contact@tablerounds.ai"
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>contact@tablerounds.ai</span>
            </a>
          </div>
        </div>
        {/* Brand logo */}
        <div className="relative">
          <Image
            src="/images/footer-logo.png"
            width={244}
            height={244}
            alt="Footer logo"
            className="absolute md:-bottom-24 bottom-28 -right-7 md:left-0"
          />
        </div>
        {/* Copyright */}
        <div className="mt-17 py-10 border-t border-[#e9e9ea]">
          <p className="text-center text-sm text-gray-700">
            Copyright © {new Date().getFullYear()} TableRounds. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
