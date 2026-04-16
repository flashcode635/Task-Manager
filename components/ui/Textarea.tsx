import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-medium text-[#041523]/60 mb-1.5 uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full px-4 py-3 rounded-xl bg-[#041523]/5 border text-[#041523] placeholder-[#041523]/30 text-sm
          focus:outline-none focus:ring-2 focus:ring-[#0a2744]/40 focus:border-[#0a2744]/50
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none
          ${error ? 'border-red-500/50' : 'border-[#041523]/15'}
          ${className}`}
        rows={3}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
