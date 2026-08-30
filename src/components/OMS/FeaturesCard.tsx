'use client';
import React from 'react';
import features from '../../../public/data/features.json';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
interface featuredProps {
  specialityName: string;
}

export default function FeaturesCard({ specialityName }:featuredProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
      <Card className="group bg-white text-[#01281e] border rounded-[16px] p-6 transition-all duration-300 hover:bg-[#01281e] hover:text-white shadow-md cursor-pointer">
        <CardHeader>
          <Image
            src="/images/osm/img01.png"
            alt=""
            width={48}
            height={48}
            className="mb-4 group-hover:brightness-0 group-hover:invert transition"
          />
          <h3 className="text-xl font-semibold">
            High-Yield {specialityName} Question Bank
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-98 group-hover:opacity-100">
            Board-style scenarios with detailed explanations, imaging pearls,
            and references.
          </p>
        </CardContent>
      </Card>
      <Card className="group bg-white text-[#01281e] border rounded-[16px] p-6 transition-all duration-300 hover:bg-[#01281e] hover:text-white shadow-md cursor-pointer">
        <CardHeader>
          <Image
            src="/images/osm/img02.png"
            alt=""
            width={48}
            height={48}
            className="mb-4 group-hover:brightness-0 group-hover:invert transition"
          />
          <h3 className="text-xl font-semibold">Verified Surgeon Network</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-98 group-hover:opacity-100">
            Connect with other {specialityName} residents, fellows, and
            attendings using profile-verified accounts.
          </p>
        </CardContent>
      </Card>
      <Card className="group bg-white text-[#01281e] border rounded-[16px] p-6 transition-all duration-300 hover:bg-[#01281e] hover:text-white shadow-md cursor-pointer">
        <CardHeader>
          <Image
            src="/images/osm/img04.png"
            alt=""
            width={48}
            height={48}
            className="mb-4 group-hover:brightness-0 group-hover:invert transition"
          />
          <h3 className="text-xl font-semibold">Leaderboard + Global Map</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-98 group-hover:opacity-100">
            See how you stack up against other surgeons and view our live,
            interactive map showing {specialityName} users across the world.
          </p>
        </CardContent>
      </Card>
      <Card className="group bg-white text-[#01281e] border rounded-[16px] p-6 transition-all duration-300 hover:bg-[#01281e] hover:text-white shadow-md cursor-pointer">
        <CardHeader>
          <Image
            src="/images/osm/img03.png"
            alt=""
            width={48}
            height={48}
            className="mb-4 group-hover:brightness-0 group-hover:invert transition"
          />
          <h3 className="text-xl font-semibold">Secure Messaging</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-98 group-hover:opacity-100">
            Direct message colleagues, share test results, and challenge others
            to take the same exam.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
