import Banner from '@/components/OMS/Banner'
import Brand from '@/components/OMS/Brand'
import Elevate from '@/components/OMS/Elevate'
import Features from '@/components/OMS/Features'
import Specialty from '@/components/OMS/Specialty'
import React from 'react'

export default function OmsPage() {
  return (
    <div>
      <Banner />
      <Features />
      <Specialty />
      <Brand />
      <Elevate/>
    </div>
  )
}
