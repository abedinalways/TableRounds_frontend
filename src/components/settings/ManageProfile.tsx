// 'use client';

// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { UserProfile } from '@/types/profile';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { FaXTwitter } from 'react-icons/fa6';
// import { Facebook, Instagram, Linkedin } from 'lucide-react';
// import AttachImageIcon from '../reusable/icons/AttachImageIcon';
// import LocationIcon from '../ui/LocationIcon';
// import BagIcon from '../reusable/icons/BagIcon';
// import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
// import { Card } from '../ui/card';
// import FollowersFollowingModal from '../my-profile/FollowersFollowingModal';
// import { Switch } from '../ui/CustomSwitch';
// import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';
// import { useUpdateUserMutation } from '@/app/redux/api/authApi';
// import Link from 'next/link';

// type ProfileFormData = {
//   name: string;
//   credentials: string;
//   location: string;
//   year: string;
//   joiningDate: string;
//   instagram: string;
//   linkedin: string;
//   twitter: string;
//   facebook: string;
//   is_public: boolean;
//   bio: string;
//   practiceName: string;
// };

// interface ProfileHeaderProps {
//   user: UserProfile;
// }

// export default function ManageProfile({ user }: ProfileHeaderProps) {

//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [isPublic, setIsPublic] = useState<boolean>(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<'followers' | 'following'>(
//     'followers',
//   );

//   const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

//   const { register, handleSubmit, reset } = useForm<ProfileFormData>({
//     defaultValues: {
//       name: '',
//       credentials: '',
//       location: '',
//       year: '',
//       joiningDate: '',
//       instagram: '',
//       linkedin: '',
//       twitter: '',
//       facebook: '',
//       bio: '',
//       practiceName: '',
//     },
//   });

//   useEffect(() => {
//     if (!user) return;

//     reset({
//       name: user.name || '',
//       credentials: user.credentials || '',
//       location: user.location || '',
//       year: user.year || '',
//       joiningDate: user.joiningDate || '',
//       instagram: user.instagram || '',
//       linkedin: user.linkedin || '',
//       twitter: user.twitter || '',
//       facebook: user.facebook || '',
//       bio: user.bio || '',
//       practiceName: user.practiceName || '',
//     });

//     setIsPublic(user.is_public ?? true);
//   }, [user, reset]);

//   const onSubmit = async (data: ProfileFormData) => {
//     try {
//       const formData = new FormData();

//       formData.append('name', data.name);
//       formData.append('credentials', data.credentials);
//       formData.append('location', data.location);
//       formData.append('year', data.year);
//       formData.append('joiningDate', data.joiningDate);
//       formData.append('instagram', data.instagram);
//       formData.append('linkedin', data.linkedin);
//       formData.append('twitter', data.twitter);
//       formData.append('facebook', data.facebook);
//       formData.append('bio', data.bio);
//       formData.append('practiceName', data.practiceName);

//       formData.append('is_public', String(isPublic));

//       if (imageFile) {
//         formData.append('avatar', imageFile);
//       }

//       const res = await updateUser(formData).unwrap();

//       toast.success(res?.message || 'Profile updated successfully');
//     } catch (err: any) {
//       console.error('Profile update failed:', err);
//       toast.error(err?.data?.message || 'Update failed');
//     }
//   };

//   const avatar = imageFile
//     ? URL.createObjectURL(imageFile)
//     : user?.avatar && user.avatar.startsWith('http')
//       ? user.avatar
//       : '/images/dashboard/doctor.png';

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setImageFile(file);
//   };

//   const { data: connectionsData, isLoading } = useGetConnectionsQuery(
//     {
//       type: modalType === 'followers' ? 'follower' : 'following',
//     },
//     {
//       skip: !modalOpen,
//     },
//   );

//   const formattedData =
//     connectionsData?.data?.map(user => ({
//       id: user.id,
//       name: user.name,
//       avatar: user.avatar,
//       username: user?.name,
//     })) || [];

//   const normalizeUrl = (url?: string) => {
//     if (!url) return '#';
//     if (url.startsWith('http://') || url.startsWith('https://')) {
//       return url;
//     }
//     return `https://${url}`;
//   };

//   return (
//     <>
//       <div className="bg-white rounded-2xl p-6 shadow-sm font-[manrope]">
//         <Card className="bg-white w-full rounded-2xl md:p-6 p-2 mb-10">
//           <div className="md:flex justify-between items-start mb-8 gap-4">
//             <div className="relative w-[213px] ">
//               <Image
//                 src={avatar}
//                 alt="avatar"
//                 width={213}
//                 height={255}
//                 priority
//                 quality={100}
//                 unoptimized
//                 className="rounded-full object-cover aspect-square"
//               />

//               <label className="absolute -bottom-5 -right-3 border-4 border-white bg-[#01503b] p-2 rounded-full md:w-[66px] md:h-[66px] w-[50px] h-[50px]">
//                 <AttachImageIcon className="max-w-full md:ml-2 md:mt-2 cursor-pointer" />
//                 <input
//                   type="file"
//                   accept="image/*"
//                   hidden
//                   onChange={handleImageChange}
//                 />
//               </label>
//             </div>

//             <div className="flex-1 space-y-3">
//               <h2 className="text-[28px] text-[#0f172b] font-semibold">
//                 <span className="text-green-900 font-semibold uppercase">
//                   {user.credentials}
//                 </span>{' '}
//                 {user.name}
//               </h2>

//               <p className="text-[18px] text-[#047857]">{user.title}</p>

//               <div className="flex md:gap-[48px] gap-6 items-center text-xs md:text-[16px] font-light text-[#6b7280] ">
//                 <h4 className="flex items-center gap-2">
//                   <LocationIcon />
//                   {user.location}
//                 </h4>

//                 <h4 className="md:flex items-center gap-2">
//                   <BagIcon />
//                   {user.jobArea}
//                 </h4>

//                 <h4 className="flex items-center gap-2">
//                   <CalendarIconForProfile />
//                   Joined {user.year}
//                 </h4>
//               </div>

//               <p className="text-sm md:text-[18px] leading-[160%]">
//                 {user.bio}
//               </p>

//               <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setModalType('followers');
//                     setModalOpen(true);
//                   }}
//                   className="flex flex-col cursor-pointer hover:opacity-80 transition"
//                 >
//                   <strong>{user.following}</strong>
//                   <span className="font-normal text-[18px] text-[#62748e]">
//                     Followers
//                   </span>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setModalType('following');
//                     setModalOpen(true);
//                   }}
//                   className="flex flex-col cursor-pointer hover:opacity-80 transition"
//                 >
//                   <strong>{user.followers}</strong>
//                   <span className="font-normal text-[18px] text-[#62748e]">
//                     Following
//                   </span>
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col items-start md:items-end gap-4">
//               <button
//                 type="button"
//                 disabled={isUpdating}
//                 onClick={handleSubmit(onSubmit)}
//                 className="bg-[#01503B] cursor-pointer min-w-[142px] h-[54px] px-6 rounded-[8px] text-white md:text-[16px] text-xs disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isUpdating ? 'Saving...' : 'Save Changes'}
//               </button>

//               <div className="w-full md:w-[300px] rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
//                 <div className="flex items-center justify-between gap-3">
//                   <div>
//                     <h3 className="text-[16px] md:text-[18px] font-semibold text-[#0F172B]">
//                       Profile Visibility
//                     </h3>
//                     <p className="mt-1 text-sm text-[#6B7280] leading-6">
//                       {isPublic
//                         ? 'Your profile can be viewed by other users.'
//                         : 'Your profile visibility is restricted.'}
//                     </p>
//                   </div>

//                   <span
//                     className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
//                       isPublic
//                         ? 'bg-green-100 text-green-700'
//                         : 'bg-slate-200 text-slate-700'
//                     }`}
//                   >
//                     {isPublic ? 'Public' : 'Private'}
//                   </span>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-[#E5E7EB]">
//                   <div>
//                     <p className="text-sm font-medium text-[#0F172B]">
//                       Make profile public
//                     </p>
//                     <p className="text-xs text-[#6B7280] mt-1">
//                       Turn off to keep your profile private.
//                     </p>
//                   </div>

//                   <Switch
//                     checked={isPublic}
//                     onCheckedChange={setIsPublic}
//                     className="cursor-pointer"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <hr />

//           <div className="flex flex-wrap items-center gap-4 md:gap-[24px] text-[#01281e] mt-[24px]">
//             <h2 className="font-bold text-[16px] md:text-[20px]">Contact</h2>

//             <Link
//               href={normalizeUrl(user.linkedin)}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer ">
//                 <Linkedin size="24" />
//               </button>
//             </Link>

//             <Link
//               href={normalizeUrl(user.instagram)}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer ">
//                 <Instagram size="24" />
//               </button>
//             </Link>

//             <Link
//               href={normalizeUrl(user.facebook)}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer ">
//                 <Facebook size="24" />
//               </button>
//             </Link>

//             <Link
//               href={normalizeUrl(user.twitter)}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer ">
//                 <FaXTwitter size="24" />
//               </button>
//             </Link>
//           </div>
//         </Card>

//         <h3 className="mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%] font-bold">
//           Contact Details
//         </h3>

//         <div className="grid md:grid-cols-2 gap-6 text-[#4b5563]">
//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">
//               Name <span className="text-red-600">*</span>
//             </Label>
//             <Input
//               {...register('name')}
//               className="bg-[#f9f9f5] text-black border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">Instagram</Label>
//             <Input
//               placeholder="Personal Link"
//               {...register('instagram')}
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">
//               Credentials <span className="text-red-600">*</span>
//             </Label>
//             <Input
//               {...register('credentials')}
//               placeholder="i.e. DDS, DMD, MD, Student"
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">LinkedIn</Label>
//             <Input
//               placeholder="Personal Link"
//               {...register('linkedin')}
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">
//               Location <span className="text-red-600">*</span>
//             </Label>
//             <Input
//               placeholder="Enter your city, state, and country"
//               {...register('location')}
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">Twitter/X</Label>
//             <Input
//               placeholder="Personal Link"
//               {...register('twitter')}
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">
//               Year in Training/Practice <span className="text-red-600">*</span>
//             </Label>
//             <Input
//               {...register('joiningDate')}
//               placeholder="Student, PGY, or Attending"
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">Facebook</Label>
//             <Input
//               placeholder="Personal Link"
//               {...register('facebook')}
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">
//               Current Practice <span className="text-red-600">*</span>
//             </Label>
//             <Input
//               placeholder="Name of your residency, hospital, or private practice"
//               {...register('practiceName')}
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>

//           <div className="flex flex-col gap-[8px]">
//             <Label className="font-bold">Joining Date</Label>
//             <Input
//               type="date"
//               {...register('joiningDate')}
//               className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm font-[manrope] mb-6">
//         <Label className="font-bold mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%]">
//           Descriptions
//         </Label>

//         <Textarea
//           rows={4}
//           {...register('bio')}
//           placeholder="Write something about yourself..."
//           className="mt-4 bg-[#f9f9f5]"
//         />
//       </div>

//       <FollowersFollowingModal
//         open={modalOpen}
//         onClose={setModalOpen}
//         type={modalType}
//         data={formattedData}
//         loading={isLoading}
//       />
//     </>
//   );
// }

'use client';

import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/types/profile';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FaXTwitter } from 'react-icons/fa6';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import AttachImageIcon from '../reusable/icons/AttachImageIcon';
import LocationIcon from '../ui/LocationIcon';
import BagIcon from '../reusable/icons/BagIcon';
import CalendarIconForProfile from '../reusable/icons/CalendarIconForProfile';
import { Card } from '../ui/card';
import FollowersFollowingModal from '../my-profile/FollowersFollowingModal';
import { Switch } from '../ui/CustomSwitch';
import { useGetConnectionsQuery } from '@/app/redux/api/connectionApi';
import { useUpdateUserMutation } from '@/app/redux/api/authApi';
import Link from 'next/link';

type ProfileFormData = {
  name: string;
  credentials: string;
  location: string;
  year: string;
  joiningDate: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  bio: string;
  practiceName: string;
};

interface ProfileHeaderProps {
  user: UserProfile;
  onProfileUpdated?: () => Promise<any> | void;
}

export default function ManageProfile({
  user,
  onProfileUpdated,
}: ProfileHeaderProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(Boolean(user?.is_public));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers',
  );

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      credentials: '',
      location: '',
      year: '',
      joiningDate: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      bio: '',
      practiceName: '',
    },
  });

  useEffect(() => {
    reset({
      name: user?.name || '',
      credentials: user?.credentials || '',
      location: user?.location || '',
      year: user?.year || '',
      joiningDate: user?.joiningDate || '',
      instagram: user?.instagram || '',
      linkedin: user?.linkedin || '',
      twitter: user?.twitter || '',
      facebook: user?.facebook || '',
      bio: user?.bio || '',
      practiceName: user?.practiceName || '',
    });
  }, [user, reset]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();

      formData.append('name', data.name || '');
      formData.append('credentials', data.credentials || '');
      formData.append('location', data.location || '');
      formData.append('year', data.year || '');
      formData.append('joiningDate', data.joiningDate || '');
      formData.append('instagram', data.instagram || '');
      formData.append('linkedin', data.linkedin || '');
      formData.append('twitter', data.twitter || '');
      formData.append('facebook', data.facebook || '');
      formData.append('bio', data.bio || '');
      formData.append('practiceName', data.practiceName || '');
      formData.append('is_public', String(isPublic));

      if (imageFile) {
        formData.append('avatar', imageFile);
      }

      const res = await updateUser(formData).unwrap();

      toast.success(res?.message || 'Profile updated successfully');

      await onProfileUpdated?.();
      setImageFile(null);
    } catch (err: any) {
      console.error('Profile update failed:', err);
      toast.error(err?.data?.message || 'Update failed');
    }
  };

  const avatar = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (user?.avatar && user.avatar.startsWith('http')) return user.avatar;
    return '/images/dashboard/doctor.png';
  }, [previewUrl, user?.avatar]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
  };

  const { data: connectionsData, isLoading } = useGetConnectionsQuery(
    {
      type: modalType === 'followers' ? 'follower' : 'following',
    },
    {
      skip: !modalOpen,
    },
  );

  const formattedData =
    connectionsData?.data?.map((item: any) => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar,
      username: item?.name,
    })) || [];

  const normalizeUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm font-[manrope]">
        <Card className="bg-white w-full rounded-2xl md:p-6 p-2 mb-10">
          <div className="md:flex justify-between items-start mb-8 gap-4">
            <div className="relative w-[213px]">
              <Image
                src={avatar}
                alt="avatar"
                width={213}
                height={255}
                priority
                quality={100}
                unoptimized
                className="rounded-full object-cover aspect-square"
              />

              <label className="absolute -bottom-5 -right-3 border-4 border-white bg-[#01503b] p-2 rounded-full md:w-[66px] md:h-[66px] w-[50px] h-[50px] cursor-pointer flex items-center justify-center">
                <AttachImageIcon className="max-w-full" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="flex-1 space-y-3">
              <h2 className="text-[28px] text-[#0f172b] font-semibold">
                <span className="text-green-900 font-semibold uppercase">
                  {user.credentials}
                </span>{' '}
                {user.name}
              </h2>

              <p className="text-[18px] text-[#047857]">{user.title}</p>

              <div className="flex md:gap-[48px] gap-6 items-center text-xs md:text-[16px] font-light text-[#6b7280]">
                <h4 className="flex items-center gap-2">
                  <LocationIcon />
                  {user.location}
                </h4>

                <h4 className="md:flex items-center gap-2">
                  <BagIcon />
                  {user.jobArea}
                </h4>

                <h4 className="flex items-center gap-2">
                  <CalendarIconForProfile />
                  Joined {user.year}
                </h4>
              </div>

              <p className="text-sm md:text-[18px] leading-[160%]">
                {user.bio}
              </p>

              <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setModalType('followers');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <strong>{user.followers}</strong>
                  <span className="font-normal text-[18px] text-[#62748e]">
                    Followers
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalType('following');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <strong>{user.following}</strong>
                  <span className="font-normal text-[18px] text-[#62748e]">
                    Following
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
              <button
                type="button"
                disabled={isUpdating || (!isDirty && !imageFile)}
                onClick={handleSubmit(onSubmit)}
                className="bg-[#01503B] cursor-pointer min-w-[142px] h-[54px] px-6 rounded-[8px] text-white md:text-[16px] text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>

              <div className="w-full md:w-[320px] rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-[#0F172B]">
                      Profile Visibility
                    </h3>
                    <p className="mt-1 text-sm text-[#6B7280] leading-6">
                      {isPublic
                        ? 'Your profile is visible to other users.'
                        : 'Your profile is hidden from other users.'}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      isPublic
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isPublic ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-[#E5E7EB]">
                  <div>
                    <p className="text-sm font-medium text-[#0F172B]">
                      Make profile public
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {isPublic
                        ? 'Turn off to make your profile private.'
                        : 'Turn on to make your profile public.'}
                    </p>
                  </div>

                  <Switch
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="flex flex-wrap items-center gap-4 md:gap-[24px] text-[#01281e] mt-[24px]">
            <h2 className="font-bold text-[16px] md:text-[20px]">Contact</h2>

            <Link
              href={normalizeUrl(user.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <Linkedin size={24} />
              </button>
            </Link>

            <Link
              href={normalizeUrl(user.instagram)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <Instagram size={24} />
              </button>
            </Link>

            <Link
              href={normalizeUrl(user.facebook)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <Facebook size={24} />
              </button>
            </Link>

            <Link
              href={normalizeUrl(user.twitter)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-[#f1f5f9] py-[6px] md:py-[11px] md:px-[12px] px-[8px] rounded-[8px] text-center cursor-pointer">
                <FaXTwitter size={24} />
              </button>
            </Link>
          </div>
        </Card>

        <h3 className="mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%] font-bold">
          Contact Details
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-[#4b5563]">
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Name <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('name')}
              className="bg-[#f9f9f5] text-black border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Instagram</Label>
            <Input
              placeholder="Personal Link"
              {...register('instagram')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Credentials <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('credentials')}
              placeholder="i.e. DDS, DMD, MD, Student"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">LinkedIn</Label>
            <Input
              placeholder="Personal Link"
              {...register('linkedin')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Location <span className="text-red-600">*</span>
            </Label>
            <Input
              placeholder="Enter your city, state, and country"
              {...register('location')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Twitter/X</Label>
            <Input
              placeholder="Personal Link"
              {...register('twitter')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Year in Training/Practice <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('year')}
              placeholder="Student, PGY, or Attending"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Facebook</Label>
            <Input
              placeholder="Personal Link"
              {...register('facebook')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">
              Current Practice <span className="text-red-600">*</span>
            </Label>
            <Input
              placeholder="Name of your residency, hospital, or private practice"
              {...register('practiceName')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">Joining Date</Label>
            <Input
              type="date"
              {...register('joiningDate')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm font-[manrope] mb-6">
        <Label className="font-bold mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%]">
          Descriptions
        </Label>

        <Textarea
          rows={4}
          {...register('bio')}
          placeholder="Write something about yourself..."
          className="mt-4 bg-[#f9f9f5]"
        />
      </div>

      <FollowersFollowingModal
        open={modalOpen}
        onClose={setModalOpen}
        type={modalType}
        data={formattedData}
        loading={isLoading}
      />
    </>
  );
}