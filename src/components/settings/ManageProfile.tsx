

'use client';

import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserProfile } from '@/types/profile';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FaMagnet, FaXTwitter } from 'react-icons/fa6';
import { Facebook, Instagram, Linkedin, StethoscopeIcon } from 'lucide-react';
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
import { useToggleFollowMutation } from '@/app/redux/api/followApi';
import { Country, State } from 'country-state-city';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { getFullCountryName } from '@/lib/country';

type ProfileFormData = {
  name: string;
  credentials: string;
  address: string;
  training_practice: string;
  created_at: string;
  country: string;
  state: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  specialty: string;
  bio: string;
  current_practice: string;
  is_public: boolean;
};

interface ProfileHeaderProps {
  user: UserProfile;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onProfileUpdated?: () => Promise<any> | void;
}

export default function ManageProfile({
  user,
  onProfileUpdated,
}: ProfileHeaderProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // const [isPublic, setIsPublic] = useState<boolean>(Boolean(user?.is_public));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'followers' | 'following'>(
    'followers',
  );
  const [toggleFollow] = useToggleFollowMutation();

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      await toggleFollow({ userId, isFollowing }).unwrap();
    } catch (error) {
      console.error('Follow toggle failed', error);
    }
  };
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: '',
      credentials: '',
      address: '',
      country: '',
      state: '',
      training_practice: '',
      created_at: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      specialty: '',
      facebook: '',
      bio: '',
      current_practice: '',
      is_public: Boolean(user?.is_public),
    },
  });
  const isPublicWatch = watch('is_public');

  useEffect(() => {
    const matchedCountry = Country.getAllCountries().find(
      c => c.name === user?.country || c.isoCode === user?.country,
    );
    const isoCode = matchedCountry?.isoCode || '';


    const matchedState = State.getStatesOfCountry(isoCode).find(
      s => s.name === user?.state || s.isoCode === user?.state,
    );
    reset({
      name: user?.name || '',
      credentials: user?.credentials || '',
      address: user?.address || '',
      country: matchedCountry?.isoCode || '',
      state: matchedState?.name || user?.state || '',
      training_practice: user?.training_practice || '',
      created_at: user?.created_at || '',
      instagram: user?.instagram || '',
      linkedin: user?.linkedin || '',
      twitter: user?.twitter || '',
      facebook: user?.facebook || '',
      specialty: user?.specialty || '',
      bio: user?.bio || '',
      current_practice: user?.current_practice || '',
      is_public: Boolean(user?.is_public),
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
      const countryName = Country.getCountryByCode(data.country)?.name || data.country;
      const formData = new FormData();

      formData.append('name', data.name || '');
      formData.append('credentials', data.credentials || '');
      formData.append('address', data.address || '');
      formData.append('training_practice', data.training_practice || '');
      formData.append('country', countryName);
      formData.append('state', data.state || '');
      formData.append('created_at', data.created_at || '');
      formData.append('instagram', data.instagram || '');
      formData.append('linkedin', data.linkedin || '');
      formData.append('twitter', data.twitter || '');
      formData.append('facebook', data.facebook || '');
      formData.append('bio', data.bio || '');
      formData.append('current_practice', data.current_practice || '');
      formData.append('specialty', data.specialty || '');
      formData.append('is_public', String(data.is_public));

      if (imageFile) {
        formData.append('avatar', imageFile);
      }

      const res = await updateUser(formData).unwrap();

      toast.success(res?.message || 'Profile updated successfully');

      await onProfileUpdated?.();
      setImageFile(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connectionsData?.data?.map((item: any) => ({
      id: item.id,
      name: item.name,
      avatar: item.avatar,
      username: item?.name,
      country: item?.country,
      state: item?.state || '',
    })) || [];
  // console.log(formattedData, 'ooooooooo===========================');

  const normalizeUrl = (url?: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  //normalize date
  const rawDate = user.created_at;
  // console.log(rawDate);
  const date = new Date(rawDate);
  // console.log(date);
  const normalizeDate = date.toISOString().split('T')[0];
  // console.log(normalizeDate);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm font-[manrope]">
        <Card className="bg-white w-full rounded-2xl md:p-6 p-2 mb-10">
          <div className="lg:flex justify-between items-start mb-8 gap-4">
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
                {user.name}{' '}
                <span className="text-green-900 font-semibold uppercase">
                  {user.credentials}
                </span>
              </h2>
              <div className="md:flex md:items-center gap-6 space-y-2 md:space-y-0">
                <h4 className="flex items-center gap-1 text-sm md:text-[16px]">
                  <Image
                    src="/images/icon03.png"
                    width={20}
                    height={20}
                    alt=""
                  />
                  {user.specialty}
                </h4>
                <p className=" text-[#047857] text-sm md:text-[16px] flex items-center gap-1">
                  <Image
                    src="/images/icon01.png"
                    width={20}
                    height={20}
                    alt=""
                  />
                  {user.training_practice}
                </p>
              </div>

              <div className="md:flex md:gap-6 items-center text-xs md:text-[16px] font-light text-[#6b7280] space-y-2 md:space-y-0">
                <h4 className="flex items-center gap-2 text-sm md:text-[16px] ">
                  <BagIcon />
                  {user.jobArea}
                </h4>
                <h4 className="flex items-center gap-2 text-sm md:text-[16px] ">
                  <LocationIcon />
                  {user.state} , {getFullCountryName(user.country)}.
                </h4>

                <h4 className="flex items-center gap-2 text-sm md:text-[16px] ">
                  <CalendarIconForProfile />
                  Joined{' '}
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </h4>
              </div>

              <p className="text-sm md:text-[18px] leading-[160%] flex gap-1">
                {user.bio}
              </p>

              <div className="flex gap-6 mt-3 text-md text-[32px] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setModalType('following');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <strong>{user.followers}</strong>
                  <span className="font-normal text-[18px] text-[#62748e]">
                    Following
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModalType('followers');
                    setModalOpen(true);
                  }}
                  className="flex flex-col cursor-pointer hover:opacity-80 transition"
                >
                  <strong>{user.following}</strong>
                  <span className="font-normal text-[18px] text-[#62748e]">
                    Followers
                  </span>
                </button>
              </div>
            </div>

            <div className="flex lg:flex-col flex-col-reverse  items-start lg:items-end gap-4">
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
                      {isPublicWatch
                        ? 'Your profile is visible to other users.'
                        : 'Your profile is hidden from other users.'}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      isPublicWatch
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isPublicWatch ? 'Public' : 'Private'}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-[#E5E7EB]">
                  <div>
                    <p className="text-sm font-medium text-[#0F172B]">
                      Make profile public
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      {isPublicWatch
                        ? 'Turn off to make your profile private.'
                        : 'Turn on to make your profile public.'}
                    </p>
                  </div>

                  <Switch
                    checked={isPublicWatch}
                    onCheckedChange={checked => {
                      setValue('is_public', checked, { shouldDirty: true });
                    }}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[#4b5563]">
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">
              Name <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('name')}
              className="bg-[#f9f9f5] text-black border [border-[rgba(68,68,68,0.1)]] md:text-lg!"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">
              Credentials <span className="text-red-600">*</span>
            </Label>
            <Input
              {...register('credentials')}
              placeholder="i.e. DDS, DMD, MD, Student"
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]] md:text-lg!"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">
              Country<span className="text-red-600">*</span>
            </Label>
            <Select
              value={watch('country')}
              onValueChange={value => {
                setValue('country', value, { shouldDirty: true });
                setValue('state', '', { shouldDirty: true });
              }}
            >
              <SelectTrigger className="bg-[#f9f9f5] border border-[rgba(68,68,68,0.1)] h-9 w-[225px] md:w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Country.getAllCountries().map(country => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* state */}
          <div className="flex flex-col gap-[8px] ">
            <Label className="font-bold md:text-lg!">
              Region/State<span className="text-red-600">*</span>
            </Label>
            <Select
              value={watch('state')}
              onValueChange={value =>
                setValue('state', value, { shouldDirty: true })
              }
              disabled={!watch('country')}
            >
              <SelectTrigger className="bg-[#f9f9f5] border border-[rgba(68,68,68,0.1)] h-9 w-[225px] md:w-full">
                <SelectValue placeholder="Select Region/State" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {State.getStatesOfCountry(watch('country')).map(state => (
                  <SelectItem key={state.isoCode} value={state.name}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-[8px] w-full ">
            <Label className="font-bold md:text-lg!">
              Year in Training/Practice <span className="text-red-600">*</span>
            </Label>
            <div className="w-full">
              <Select
                value={watch('training_practice')}
                onValueChange={value =>
                  setValue('training_practice', value, { shouldDirty: true })
                }
              >
                <SelectTrigger className="bg-[#f9f9f5] border border-[rgba(68,68,68,0.1)] h-9 w-[225px] md:w-full">
                  <SelectValue placeholder="Student, PGY, or Attending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical Student">
                    Medical Student
                  </SelectItem>
                  <SelectItem value="Dental Student">Dental Student</SelectItem>
                  <SelectItem value="PGY-1">PGY-1</SelectItem>
                  <SelectItem value="PGY-2">PGY-2</SelectItem>
                  <SelectItem value="PGY-3">PGY-3</SelectItem>
                  <SelectItem value="PGY-4">PGY-4</SelectItem>
                  <SelectItem value="PGY-5">PGY-5</SelectItem>
                  <SelectItem value="PGY-6">PGY-6</SelectItem>
                  <SelectItem value="PGY-7">PGY-7</SelectItem>
                  <SelectItem value="Attending">Attending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">
              Current Practice <span className="text-red-600">*</span>
            </Label>
            <Input
              placeholder="Name of your residency, hospital, or private practice"
              {...register('current_practice')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]] md:text-lg!"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">Joining Date</Label>
            <h3 className=" pl-2 border text-sm flex items-center border-gray-200 bg-[#f9f9f5] h-9 w-[225px] md:w-full py-1 rounded-md">
              {normalizeDate}
            </h3>
          </div>

          <div className="flex flex-col gap-[8px] w-full">
            <Label className="font-bold md:text-lg!">
              Specialty <span className="text-red-600">*</span>
            </Label>
            <div className="w-full">
              <Select
                value={watch('specialty')}
                onValueChange={value =>
                  setValue('specialty', value, { shouldDirty: true })
                }
              >
                <SelectTrigger className="bg-[#f9f9f5] border border-[rgba(68,68,68,0.1)] h-9 w-[225px] md:w-full">
                  <SelectValue placeholder="Select a specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oral and Maxillofacial Surgery">
                    Oral and Maxillofacial Surgery
                  </SelectItem>
                  <SelectItem value="Plastic Surgery">
                    Plastic Surgery
                  </SelectItem>
                  <SelectItem value="Otorhinolaryngology">
                    Otorhinolaryngology
                  </SelectItem>
                  <SelectItem value="Dentistry">Dentistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* social media links */}
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">Instagram</Label>
            <Input
              placeholder="Personal Link"
              {...register('instagram')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]] md:text-lg!"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold">LinkedIn</Label>
            <Input
              placeholder="Personal Link"
              {...register('linkedin')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]] md:text-lg!"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">Facebook</Label>
            <Input
              placeholder="Personal Link"
              {...register('facebook')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]] md:text-lg!"
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <Label className="font-bold md:text-lg!">Twitter/X</Label>
            <Input
              placeholder="Personal Link"
              {...register('twitter')}
              className="bg-[#f9f9f5] border [border-[rgba(68,68,68,0.1)]] md:text-lg!"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm font-[manrope] mb-6">
        <Label className="font-bold mb-4 text-[#0f172b] text-16px md:text-[24px] leading-[130%] ">
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
        onFollowToggle={handleFollowToggle}
      />
    </>
  );
}