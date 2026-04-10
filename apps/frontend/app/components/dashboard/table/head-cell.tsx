import { cn } from '~/lib/utils';
import { TextAlign } from '~/types';
import type { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  textAlign?: TextAlign;
  className?: string;
}

export function HeadCell({
  children,
  textAlign = TextAlign.LEFT,
  className,
}: IProps) {
  return (
    <th
      className={cn(
        'px-2 py-3 text-left',
        textAlign === TextAlign.CENTER && 'text-center',
        textAlign === TextAlign.RIGHT && 'text-right',
        className,
      )}
    >
      {children}
    </th>
  );
}
