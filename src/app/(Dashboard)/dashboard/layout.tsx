


import AuthProvider from '@/app/AuthProvider';
import { ChatProvider } from '../context/ChatContext';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <AuthProvider>
      <ChatProvider>

        {children}
      </ChatProvider>
      
    </AuthProvider>
  )
}
