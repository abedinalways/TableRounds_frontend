
import Btn from '../reusable/button/Btn';

interface AuthButtonsProps {
  layout?: 'desktop' | 'mobile';
}

export default function AuthButtons({ layout = 'desktop' }: AuthButtonsProps) {
  if (layout === 'mobile') {
    return (
      <>
        <Btn
          text="Login"
          href="/login"
          className="bg-[#B79E6B] text-white w-full h-[54px] hover:bg-[#a08c5f] transition-colors"
        />
        <Btn
          href="/register"
          text="Sign Up"
          className="bg-white text-[#B79E6B] w-full h-[54px] hover:bg-gray-100 transition-colors"
        />
      </>
    );
  }

  return (
    <>
      <Btn
        text="Login"
        href="/login"
        className="bg-[#B79E6B] text-white w-[105px] h-[54px] hover:bg-[#a08c5f] transition-colors"
      />
      <Btn
        text="Sign Up"
        href="/register"
        className="bg-white text-[#B79E6B] w-[107px] h-[54px] hover:bg-gray-100 transition-colors"
      />
    </>
  );
}
