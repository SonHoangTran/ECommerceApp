import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input className={className} {...props} />
      {error && <span>{error}</span>}
    </div>
  );
};
