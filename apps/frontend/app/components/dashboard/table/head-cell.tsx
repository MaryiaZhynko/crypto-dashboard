import { cn } from '~/lib/utils';
import { TextAlign } from '~/types';

interface IProps {
  children: React.ReactNode;
  textAlign?: TextAlign;
}

export function HeadCell({ children, textAlign = TextAlign.LEFT }: IProps) {
  return (
    <th
      className={cn(
        'py-3 px-2 text-left',
        textAlign === TextAlign.CENTER && 'text-center',
        textAlign === TextAlign.RIGHT && 'text-right',
      )}
    >
      {children}
    </th>
  );
}
