import Link from 'next/link';
import React, { CSSProperties } from 'react';

interface ButtonProps extends React.PropsWithChildren {
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: CSSProperties;
}

const Btn: React.FC<ButtonProps> = ({
  text,
  href,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  children,
  style = {},
}) => {
  // Base styles - minimal, everything customizable via className or style
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none whitespace-nowrap rounded-[8px]';

  // Disabled style
  const disabledStyle = disabled
    ? 'cursor-not-allowed opacity-60'
    : 'cursor-pointer';

  // Combined classes
  const buttonClasses = `${baseStyles} ${disabledStyle} ${className}`;

  // Default style with border-radius
  const defaultStyle: CSSProperties = {
    borderRadius: '8px',
    ...style,
  };

  // Button content
  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children ? children : text}</span>
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </>
  );

  // If href is provided, render as Link
  if (href && !disabled) {
    return (
      <Link href={href} className={buttonClasses} style={defaultStyle}>
        {content}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      style={defaultStyle}
    >
      {content}
    </button>
  );
};

export default Btn;
