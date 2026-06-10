import React from 'react';

type BadgeVariant = 'default' | 'success' | 'danger' | 'muted' | 'new';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'border border-[#0A0A0A] text-[#0A0A0A] bg-transparent',
  success: 'bg-[#1A5C2A] text-white border border-[#1A5C2A]',
  danger:  'bg-[#8C1F1F] text-white border border-[#8C1F1F]',
  muted:   'border border-[#E0DDD8] text-[#8A8A8A] bg-transparent',
  new:     'bg-[#0A0A0A] text-white border border-[#0A0A0A]',
};

const baseStyles =
  'inline-flex items-center font-montserrat text-[10px] uppercase tracking-[0.15em] px-3 py-0.5 whitespace-nowrap';

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  className = '',
}) => {
  return (
    <span className={[baseStyles, variantStyles[variant], className].join(' ')}>
      {label}
    </span>
  );
};

export default Badge;
