'use client';
import React from 'react';
import features from '../../../public/data/features.json';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function FeaturesCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 ">
      {features.map((item, index) => (
        <Card
          key={index}
          className="group bg-white text-green-700 border rounded-2xl p-6 transition-all duration-300 hover:bg-green-700 hover:text-white shadow-md cursor-pointer"
        >
          <CardHeader>
            <Image
              src={item.icon}
              alt={item.title}
              width={40}
              height={40}
              className="mb-4 group-hover:brightness-0 group-hover:invert transition"
            />
            <h3 className="text-xl font-semibold">{item.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm opacity-80 group-hover:opacity-100">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
