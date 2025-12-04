import LoginForm from '@/components/auth_components/LoginForm'
import Image from 'next/image'
import React from 'react'

export default function LoginPage() {
  return (
    <div className="mt-20 overflow-hidden">
      <div className="relative">
        <Image
          src="/images/auth/logo.png"
          alt=""
          width={486}
          height={486}
          className="absolute -top-14 left-10"
        />
      </div>
      <div className="text-center py-6 text-black font-[roboto]">
        <h3 className="text-xl md:text-3xl lg:text-5xl font-bold">
          Login your TableRounds profile
        </h3>
        <p className="text-sm md:text-md text-gray-600 mt-4">
          Join a verified network of surgeons and trainees. We manually review
          every <br />account to keep the community authentic and professional.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
