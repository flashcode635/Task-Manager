import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[#041523]/60 mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-xl bg-[#041523]/5 border text-[#041523] placeholder-[#041523]/30 text-sm
          focus:outline-none focus:ring-2 focus:ring-[#0a2744]/40 focus:border-[#0a2744]/50
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50' : 'border-[#041523]/15'}
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
