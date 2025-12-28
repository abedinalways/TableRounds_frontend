import * as React from 'react';
import { SVGProps } from 'react';
const QuestionsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M32.0005 21.6562C32.0005 17.6853 29.7223 14.1414 26.3105 12.4175C26.2046 20.0312 20.0317 26.2041 12.418 26.31C14.1418 29.7219 17.6858 32 21.6567 32C23.5186 32 25.3291 31.5041 26.9198 30.562L31.9553 31.9548L30.5625 26.9194C31.5046 25.3286 32.0005 23.518 32.0005 21.6562Z"
      fill="url(#paint0_linear_6000_3362)"
    />
    <path
      d="M24.4375 12.2188C24.4375 5.48125 18.9562 0 12.2188 0C5.48125 0 0 5.48125 0 12.2188C0 14.4146 0.5845 16.5525 1.69438 18.4294L0.044875 24.3923L6.008 22.7432C7.885 23.853 10.0229 24.4375 12.2188 24.4375C18.9562 24.4375 24.4375 18.9562 24.4375 12.2188ZM10.3438 9.375H8.46875C8.46875 7.30713 10.1509 5.625 12.2188 5.625C14.2866 5.625 15.9688 7.30713 15.9688 9.375C15.9688 10.4246 15.5244 11.4334 14.7493 12.1423L13.1562 13.6003V15.0625H11.2812V12.7747L13.4834 10.7591C13.8769 10.3989 14.0938 9.9075 14.0938 9.375C14.0938 8.34106 13.2527 7.5 12.2188 7.5C11.1848 7.5 10.3438 8.34106 10.3438 9.375ZM11.2812 16.9375H13.1562V18.8125H11.2812V16.9375Z"
      fill="url(#paint1_linear_6000_3362)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6000_3362"
        x1={19.4656}
        y1={12.9563}
        x2={35.3046}
        y2={23.2618}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#023729" />
        <stop offset={1} stopColor="#02AE80" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_6000_3362"
        x1={8.79495}
        y1={0.672355}
        x2={28.5608}
        y2={13.5329}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#023729" />
        <stop offset={1} stopColor="#02AE80" />
      </linearGradient>
    </defs>
  </svg>
);

export default QuestionsIcon;