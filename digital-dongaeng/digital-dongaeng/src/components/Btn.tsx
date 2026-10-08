import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'p' | 'o' | 'g' | ''; pulse?: boolean };

export default function Btn({ kind = '', pulse = false, className = '', type = 'button', ...rest }: Props) {
  return <button type={type} className={`b ${kind} ${pulse ? 'pulse' : ''} ${className}`.trim()} {...rest} />;
}
