import * as React from 'react';
import { SVGProps } from 'react';
export const CheckmarkRed = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={29}
    height={29}
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 14.3333C0 22.2493 6.41733 28.6667 14.3333 28.6667C22.2493 28.6667 28.6667 22.2493 28.6667 14.3333C28.6667 6.41733 22.2493 0 14.3333 0C6.41733 0 0 6.41733 0 14.3333ZM20.568 9.35065C21.1107 9.84798 21.1467 10.692 20.6493 11.2346L13.316 19.2346C13.0707 19.5026 12.7253 19.6587 12.3627 19.6667C11.9987 19.6747 11.648 19.5334 11.3907 19.276L8.05732 15.9427C7.53599 15.4227 7.53599 14.5773 8.05732 14.0573C8.57732 13.536 9.42268 13.536 9.94268 14.0573L12.292 16.4053L18.684 9.43203C19.1813 8.88936 20.0253 8.85332 20.568 9.35065Z"
      fill="#FF0000"
    />
  </svg>
);

const Checkmark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={29}
    height={29}
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 14.3333C0 22.2493 6.41733 28.6667 14.3333 28.6667C22.2493 28.6667 28.6667 22.2493 28.6667 14.3333C28.6667 6.41733 22.2493 0 14.3333 0C6.41733 0 0 6.41733 0 14.3333ZM20.568 9.35065C21.1107 9.84798 21.1467 10.692 20.6493 11.2346L13.316 19.2346C13.0707 19.5026 12.7253 19.6587 12.3627 19.6667C11.9987 19.6747 11.648 19.5334 11.3907 19.276L8.05732 15.9427C7.53599 15.4227 7.53599 14.5773 8.05732 14.0573C8.57732 13.536 9.42268 13.536 9.94268 14.0573L12.292 16.4053L18.684 9.43203C19.1813 8.88936 20.0253 8.85332 20.568 9.35065Z"
      fill="url(#paint0_linear_5836_644)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_5836_644"
        x1={10.317}
        y1={0.788713}
        x2={33.5036}
        y2={15.8749}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#023729" />
        <stop offset={1} stopColor="#02AE80" />
      </linearGradient>
    </defs>
  </svg>
);
export default Checkmark;
