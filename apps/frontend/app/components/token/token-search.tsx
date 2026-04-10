import { Card, CardContent } from '~/components/ui/card';
import { SearchIcon } from 'lucide-react';

export function TokenSearch() {
  return (
    <Card>
      <CardContent className="flex items-center gap-2">
        <SearchIcon className="w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          className="flex-1 outline-none"
          placeholder="Search for a token"
        />
      </CardContent>
    </Card>
  );
}
