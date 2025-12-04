import React from 'react'
import FeaturesCard from './FeaturesCard'

export default function Features() {
  return (
    <div className='custom-container bg-card py-10 px-4 md:px-0'>
      <h2 className='text-md md:text-3xl text-teal-700'>What We Get</h2>
      <FeaturesCard/>
    </div>
  )
}
