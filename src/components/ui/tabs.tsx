"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-14 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // base
        'inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1 rounded-md border border-transparent md:px-5 md:py-4 px-3 py-2 text-sm md:text-[20px] font-medium whitespace-nowrap transition-all cursor-pointer',

        // inactive (default)
        'text-black [&_svg]:text-black',

        // active
        'data-[state=active]:bg-[#01503b] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:[&_svg]:text-white',

        // focus & disabled
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#01503b]/40 disabled:pointer-events-none disabled:opacity-50',

        // dark mode (optional)
        'dark:text-muted-foreground dark:[&_svg]:text-muted-foreground dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white',

        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
