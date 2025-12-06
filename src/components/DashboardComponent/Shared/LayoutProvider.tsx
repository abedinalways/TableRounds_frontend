"use client";

import type React from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

interface LayoutProviderProps {
  children?: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  return (
    <div className="flex bg-[#F6F6F6] min-h-screen">
      <AdminSidebar />

      <div className="flex-1 overflow-auto  lg:ml-[230px] xl:ml-[245px]">
        <AdminTopBar />
        <div>{children}</div>
      </div>
    </div>
  );
}
