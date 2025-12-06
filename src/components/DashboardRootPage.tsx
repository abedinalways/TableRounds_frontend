"use client";

import AdminDashboard from "./DashboardComponent/AdminDashboard/AdminDashboard";
import UserDashboard from "./DashboardComponent/UserDashboard/UserDashboard";

type UserType = "ADMIN" | "USER";

export default function DashboardRootPage() {
  const type = "USER";
  const userRole = type as UserType;
  const isLoading = false;
  switch (userRole) {
    case "ADMIN":
      return <AdminDashboard />;
    case "USER":
      return <UserDashboard />;
    default:
      return (
        <div>
          {isLoading ? (
            <p>Loading..</p>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold text-red-600">
                Access Denied
              </h2>
              <p className="text-gray-600 mt-2">
                You don&apos;t have permission to access this dashboard.
              </p>
            </div>
          )}
        </div>
      );
  }
}
