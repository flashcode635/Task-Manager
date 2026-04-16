import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed';

  const variants = {
    primary: `bg-gradient-to-r from-[#041523] to-[#0a2744] text-[#fffdf3]
      hover:shadow-lg hover:shadow-[#041523]/20 hover:-translate-y-0.5 active:translate-y-0
      disabled:bg-[#041523]/20 disabled:text-[#041523]/40 disabled:hover:shadow-none disabled:hover:translate-y-0`,

    secondary: `bg-[#041523]/5 border border-[#041523]/15 text-[#041523]
      hover:bg-[#041523]/10 hover:border-[#041523]/25 hover:-translate-y-0.5 active:translate-y-0
      disabled:bg-[#041523]/5 disabled:text-[#041523]/30 disabled:hover:translate-y-0`,

    danger: `bg-red-500 text-white border border-red-600
      hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-0.5 active:translate-y-0
      disabled:bg-red-300 disabled:border-red-400 disabled:hover:shadow-none disabled:hover:translate-y-0`,

    ghost: `bg-transparent border border-[#041523]/10 text-[#041523]/70
      hover:bg-[#041523]/5 hover:border-[#041523]/20 hover:text-[#041523]
      disabled:text-[#041523]/30 disabled:hover:bg-transparent`,
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
