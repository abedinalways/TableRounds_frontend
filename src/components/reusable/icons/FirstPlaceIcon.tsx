import { type SVGProps } from 'react';

export const FirstPlaceIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <path fill="url(#a)" d="M0 0h32v32H0z" />
      <defs>
        <pattern
          id="a"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00195)" xlinkHref="#b" />
        </pattern>
      </defs>
    </svg>
  );
};
