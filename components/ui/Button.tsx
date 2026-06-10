'use client';

import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0A0A0A] text-white border border-[#0A0A0A] hover:bg-white hover:text-[#0A0A0A]',
  secondary:
    'bg-transparent text-[#0A0A0A] border border-[#E0DDD8] hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A]',
  ghost:
    'bg-transparent text-[#8A8A8A] border-none hover:text-[#0A0A0A]',
  danger:
    'bg-transparent text-[#8C1F1F] border border-[#8C1F1F] hover:bg-[#8C1F1F] hover:text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const baseStyles =
  'font-montserrat font-semibold uppercase tracking-[0.1em] transition-all duration-200 inline-flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  asChild = false,
  href,
}) => {
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(' ');

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
};

export default Button;
