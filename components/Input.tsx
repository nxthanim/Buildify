
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, error, className, wrapperClassName, icon, ...props }, ref) => {
  return (
    <div className={`w-full ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">{icon}</div>}
        <input
          id={id}
          ref={ref}
          className={`w-full bg-surface-accent border border-border rounded-lg p-3 text-text-primary placeholder-gray-500 focus:ring-primary focus:border-primary transition ${error ? 'border-danger' : 'border-border'} ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
