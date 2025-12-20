'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <div className="relative w-[200px] xl:w-[397px]  ">
      <ProgressPrimitive.Root
        data-slot="progress"
        className={cn(
          'bg-primary/20 relative h-2 w-full rounded-full overflow-hidden',
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-[#b79e6b] h-full w-full flex-1 transition-all relative "
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        ></ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>

      <div
        className="w-full  transition-transform pointer-events-none h-1 relative -top-2.5 -translate-y-1/2"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      >
        <div
          className="absolute -right-4 md:top-1/2 top-2 w-6 h-6 md:w-9 md:h-9 p-0.5 rounded-full shadow-lg 
          -translate-y-1/2"
          style={{
            background: 'linear-gradient(90deg, #826F4A 0%, #E3C587 100%)',
          }}
        >
          <div
            className="w-full h-full rounded-full "
            style={{
              backgroundImage:
                'linear-gradient(90deg, #e3c587 0%, #826f4a 100%)',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export { Progress };
