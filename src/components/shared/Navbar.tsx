
'use client';
import { usePublicSpecialties } from '@/hooks/useSpecialtyData';
import { useState } from 'react';
import { useNavbarAuth } from '../navbar/useNavbarAuth';
import { slugify } from '../navbar/navbar.utils';
import NavLogo from '../navbar/NavLogo';
import DesktopNav from '../navbar/DesktopNav';
import UserAvatarDropdown from '../navbar/UserAvatarDropdown';
import AuthButtons from '../navbar/AuthButtons';
import MobileMenu from '../navbar/MobileMenu';



export default function Navbar({ isOms = false }) {
  const [open, setOpen] = useState(false);
  const [speciality, setSpeciality] = useState('');

  const { data: allSpecialtiesData, isLoading: isLoadingSpecialties } = usePublicSpecialties();
  const specialties: { name: string }[] = allSpecialtiesData?.data || [];
  const specialityOptions = specialties.map(s => {
    const slug = slugify(s.name);
    return { value: slug, label: s.name, href: `/${slug}` };
  });

  const { token, currentUser, isLoggingOut, handleLogout } = useNavbarAuth();

  const onLogout = async () => {
    await handleLogout();
    setOpen(false);
  };

  return (
    <nav className="fixed inset-x-0 top-0 left-0 right-0 z-50 bg-[#02533d]/90 backdrop-blur-xs border-b border-green-600/30 overflow-hidden h-[92px] flex items-center justify-between font-[manrope]">
      <div className="mx-auto w-full px-4 sm:px-0 lg:px-0 custom-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <NavLogo />

          <DesktopNav
            specialityOptions={specialityOptions}
            isLoadingSpecialties={isLoadingSpecialties}
            speciality={speciality}
            onSpecialityChange={setSpeciality}
          />

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {token && currentUser ? (
              <UserAvatarDropdown
                currentUser={currentUser}
                isLoggingOut={isLoggingOut}
                onLogout={onLogout}
              />
            ) : (
              <AuthButtons layout="desktop" />
            )}
          </div>

          <MobileMenu
            open={open}
            onOpenChange={setOpen}
            token={token}
            currentUser={currentUser}
            isLoggingOut={isLoggingOut}
            onLogout={onLogout}
            specialityOptions={specialityOptions}
            isLoadingSpecialties={isLoadingSpecialties}
          />
        </div>
      </div>
    </nav>
  );
}