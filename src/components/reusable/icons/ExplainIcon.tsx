import * as React from 'react';
import { SVGProps } from 'react';
const ExplainIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={21}
    height={21}
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17.75 0C19.2687 0 20.5 1.23122 20.5 2.75V17.75C20.5 19.2688 19.2687 20.5 17.75 20.5H2.75C1.23122 20.5 0 19.2688 0 17.75V2.75C0 1.23122 1.23122 0 2.75 0H17.75ZM10.25 8.75C9.69774 8.75 9.25004 9.1977 9.25004 9.75V14.25C9.25004 14.8023 9.69774 15.25 10.25 15.25C10.8022 15.25 11.25 14.8023 11.25 14.25V9.75C11.25 9.1977 10.8022 8.75 10.25 8.75ZM10.25 5.24805C9.69774 5.24805 9.25004 5.69576 9.25004 6.24805V6.25781C9.25004 6.8101 9.69774 7.25781 10.25 7.25781C10.8022 7.25778 11.25 6.81008 11.25 6.25781V6.24805C11.25 5.69578 10.8022 5.24808 10.25 5.24805Z"
      fill="url(#paint0_linear_6402_3635)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_6402_3635"
        x1={7.37788}
        y1={0.564021}
        x2={23.959}
        y2={11.3524}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#023729" />
        <stop offset={1} stopColor="#02AE80" />
      </linearGradient>
    </defs>
  </svg>
);
export default ExplainIcon;
