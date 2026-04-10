import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';

interface IProps {
  children: ReactNode;
  className?: string;
}

export function Cell({ children, className }: IProps) {
  return (
    <td className={cn('items-center gap-2 px-2 py-3', className)}>
      {children}
    </td>
  );
}
