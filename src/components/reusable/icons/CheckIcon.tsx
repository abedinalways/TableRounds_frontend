import * as React from 'react';
import { JSX } from 'react/jsx-runtime';
const CheckIcon = (props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.4585 14C1.4585 20.9265 7.07366 26.5417 14.0002 26.5417C20.9267 26.5417 26.5418 20.9265 26.5418 14C26.5418 7.0735 20.9267 1.45833 14.0002 1.45833C7.07366 1.45833 1.4585 7.0735 1.4585 14ZM19.4555 9.64015C19.9303 10.0753 19.9618 10.8138 19.5267 11.2886L13.11 18.2886C12.8953 18.5231 12.5932 18.6597 12.2758 18.6667C11.9573 18.6737 11.6505 18.55 11.4253 18.3249L8.50865 15.4082C8.05249 14.9532 8.05249 14.2135 8.50865 13.7585C8.96365 13.3023 9.70334 13.3023 10.1583 13.7585L12.214 15.813L17.807 9.71136C18.2421 9.23653 18.9807 9.20499 19.4555 9.64015Z"
      fill="url(#paint0_linear_5605_1989)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_5605_1989"
        x1={10.4859}
        y1={2.14846}
        x2={30.7741}
        y2={15.3488}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#023729" />
        <stop offset={1} stopColor="#02AE80" />
      </linearGradient>
    </defs>
  </svg>
);
export default CheckIcon;
