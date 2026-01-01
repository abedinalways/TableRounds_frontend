import * as React from 'react';

const CustomCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* ✅ Circle with gradient */}
    <circle cx="12" cy="12" r="10.75" fill="url(#paint0_linear_5647_1302)" />

    {/* ✅ White checkmark */}
    <path
      d="M16.676 8.263C17.083 8.636 17.11 9.269 16.737 9.676L11.237 15.676C11.053 15.877 10.794 15.994 10.522 16C10.249 16.006 9.986 15.9 9.793 15.707L7.293 13.207C6.902 12.817 6.902 12.183 7.293 11.793C7.683 11.402 8.317 11.402 8.707 11.793L10.469 13.554L15.263 8.324C15.636 7.917 16.269 7.89 16.676 8.263Z"
      fill="white"
    />

    <defs>
      <linearGradient
        id="paint0_linear_5647_1302"
        x1={8.98776}
        y1={1.84153}
        x2={26.3777}
        y2={13.1561}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#023729" />
        <stop offset={1} stopColor="#02AE80" />
      </linearGradient>
    </defs>
  </svg>
);

export default CustomCheck;
