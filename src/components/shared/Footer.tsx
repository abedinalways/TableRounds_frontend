import React from 'react';
import { Instagram, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
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
                href="#"
                className="text-gray-700 hover:text-[#1e5a4f] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-[#1e5a4f] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h3>
            <a
              href="#"
              className="text-sm text-[#4a4c5] hover:text-[#1e5a4f] transition-colors"
            >
              Question Bank
            </a>
            <a
              href="#"
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
              href="#"
              className="text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              Disclaimer
            </a>
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
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
            <Link
              href="https://contact@tablerounds.ai"
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors"
            >
              <span className=" cursor-pointer">contact@tablerounds.ai</span>
            </Link>
            <a
              href="https://contact@tablerounds.ai"
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-[#1e5a4f] transition-colors underline"
            >
              <Mail className="w-4 h-4" />
              <span>tableround@email.com</span>
            </a>
          </div>
        </div>
        {/* Brand logo */}
        <div className="relative">
          <Image
            src="/images/footer-logo.png"
            width={244}
            height={244}
            alt=""
            className="absolute md:-bottom-24 bottom-28 -right-7 md:left-0"
          />
        </div>
        {/* Copyright */}
        <div className="mt-17 py-10  border border-t-[#e9e9ea]">
          <p className="text-center text-sm text-gray-700">
            Copyright © 2025 TableRounds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
