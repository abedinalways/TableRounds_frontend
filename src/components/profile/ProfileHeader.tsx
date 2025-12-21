import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/profile';

interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white w-full rounded-2xl p-6 flex flex-col md:flex-row gap-6 font-[manrope]">
      <Image
        src={user.avatar}
        alt="Profile image"
        width={213}
        height={255}
        className="rounded-sm"
      />

      <div className="flex-1 space-y-3">
        <h2 className="text-[28px] text-[#0f172b] font-semibold">{user.name}</h2>
        <p className="text-[18px] text-[#047857]  ">
          {user.title}
        </p>
        <p className='text-[18px] leading-[160%]'>{user.details}</p>

        <div className="flex gap-6 mt-3 text-sm">
          <span>
            <strong>{user.followers}</strong> Followers
          </span>
          <span>
            <strong>{user.following}</strong> Following
          </span>
        </div>
      <div className="flex gap-3">
        <Button variant="outline">Message</Button>
        <Button>Follow</Button>
      </div>
      </div>

    </div>
  );
}
