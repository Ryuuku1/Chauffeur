import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/shared/lib/cx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'md' | 'sm';
  isLoading?: boolean;
  leadingIcon?: ReactNode;
}

export const buttonClassName = (
  variant: ButtonProps['variant'] = 'primary',
  size: ButtonProps['size'] = 'md',
  fullWidth = false,
): string =>
  cx('button', `button-${variant}`, size === 'sm' && 'button-sm', fullWidth && 'button-block');

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  disabled,
  leadingIcon,
  children,
  ...props
}: ButtonProps) => (
  <button
    className={cx(buttonClassName(variant, size), isLoading && 'button-loading', className)}
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    {...props}
  >
    {leadingIcon ? <span className="button-icon">{leadingIcon}</span> : null}
    <span>{children}</span>
  </button>
);
