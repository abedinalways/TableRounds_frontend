


import AuthProvider from '@/app/AuthProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <AuthProvider>{children}</AuthProvider>;
}
