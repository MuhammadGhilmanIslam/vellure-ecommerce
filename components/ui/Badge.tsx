import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-mono uppercase text-xs tracking-wider rounded-sm px-2 py-0.5 font-medium transition-colors',
  {
    variants: {
      variant: {
        accent: 'bg-ag-accent/15 text-ag-accent border border-ag-accent/30',
        success: 'bg-ag-success/10 text-ag-success border border-transparent',
        warning: 'bg-ag-warning/10 text-ag-warning border border-transparent',
        error: 'bg-ag-error/10 text-ag-error border border-transparent',
        neutral: 'bg-ag-bg-3 text-ag-text-2 border border-ag-border',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
