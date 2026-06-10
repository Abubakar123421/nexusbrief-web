import React from 'react';

type DividerVariant = 'light' | 'strong';

interface DividerProps {
  variant?: DividerVariant;
  label?: string;
  className?: string;
}

const borderColors: Record<DividerVariant, string> = {
  light: '#E0DDD8',
  strong: '#0A0A0A',
};

const labelTextColors: Record<DividerVariant, string> = {
  light: '#8A8A8A',
  strong: '#0A0A0A',
};

export const Divider: React.FC<DividerProps> = ({
  variant = 'light',
  label,
  className = '',
}) => {
  if (label) {
    return (
      <div className={`relative flex items-center w-full ${className}`}>
        <div
          className="flex-1 border-t"
          style={{ borderColor: borderColors[variant] }}
        />
        <span
          className="mx-4 font-montserrat text-[10px] uppercase tracking-[0.15em] whitespace-nowrap bg-white px-2"
          style={{ color: labelTextColors[variant] }}
        >
          {label}
        </span>
        <div
          className="flex-1 border-t"
          style={{ borderColor: borderColors[variant] }}
        />
      </div>
    );
  }

  return (
    <hr
      className={`w-full border-t border-0 ${className}`}
      style={{ borderColor: borderColors[variant] }}
    />
  );
};

export default Divider;
