import { type SVGProps } from 'react';

export const VoiceIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="21"
      fill="none"
      viewBox="0 0 17 21"
      {...props}
    >
      <g
        stroke="#35664F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      >
        <path d="M.8 9.018a7.403 7.403 0 0 0 7.404 7.404 7.403 7.403 0 0 0 7.403-7.404M8.204 19.233v-2.81" />
        <path
          d="M8.33 12.67h-.253a3.66 3.66 0 0 1-3.66-3.66V4.46A3.66 3.66 0 0 1 8.077.8h.253a3.66 3.66 0 0 1 3.66 3.66v4.55a3.66 3.66 0 0 1-3.66 3.66"
          clipRule="evenodd"
        />
      </g>
    </svg>
  );
};
