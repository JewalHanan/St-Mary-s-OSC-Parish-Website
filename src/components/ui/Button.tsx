'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  ['parish-btn', 'inline-flex items-center justify-center', 'rounded-[12px] px-7 py-3', 'text-base font-bold leading-snug', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400', 'disabled:pointer-events-none disabled:opacity-50', 'cursor-pointer border-none relative overflow-hidden'],
  {
    variants: {
      variant: {
        primary: 'parish-btn-primary',
        secondary: 'parish-btn-secondary',
        outline: 'parish-btn-outline',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, fullWidth = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={`${buttonVariants({ variant })} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
