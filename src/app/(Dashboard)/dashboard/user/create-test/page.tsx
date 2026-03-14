import { CreateTestContent } from '@/components/create_test_components/CreateTestContent'
import React from 'react'

export default function CreateTestMainPage() {
  return (
    <div className="grid grid-cols-12 font-[manrope] gap-4">
      <div className="grid grid-cols-12">
        <CreateTestContent />
      </div>
    </div>
  );
}
