"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const mockUser = {
  role: "USER",
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const userRole = mockUser.role;
    if (allowedRoles.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthorized(true);
      return;
    }

    if (allowedRoles.includes(userRole)) {
      setIsAuthorized(true);
      return;
    }

    router.push("/unauthorized");
  }, [router, allowedRoles]);

  if (!isAuthorized) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
