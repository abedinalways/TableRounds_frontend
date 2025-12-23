import { type SVGProps } from 'react';

export const ArrowUp = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        fill="#fff"
        d="M16.422 8.923a.83.83 0 0 1-1.178 0l-4.41-4.411V17.5a.833.833 0 1 1-1.667 0V4.512l-4.411 4.41a.832.832 0 1 1-1.179-1.178L9.41 1.912a.834.834 0 0 1 1.18 0l5.832 5.832a.83.83 0 0 1 0 1.179"
      />
    </svg>
  );
};
