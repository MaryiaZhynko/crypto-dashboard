import { Link, useSearchParams } from 'react-router';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { usePageToGo } from '../usePageToGo';

interface IProps {
  totalPages: number;
}

export function TablePagination({ totalPages }: IProps) {
  const [searchParams] = useSearchParams();
  const pageTo = usePageToGo();

  const rawPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const page =
    Number.isFinite(rawPage) && rawPage >= 1
      ? Math.min(rawPage, totalPages)
      : 1;

  return (
    <>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 1 ? (
                <PaginationPrevious asChild>
                  <Link to={pageTo(page - 1)}>
                    <ChevronLeftIcon data-icon="inline-start" />
                    <span className="hidden sm:block">Previous</span>
                  </Link>
                </PaginationPrevious>
              ) : (
                <PaginationPrevious
                  className="pointer-events-none opacity-50"
                  aria-disabled
                  href="#"
                  onClick={(e) => e.preventDefault()}
                />
              )}
            </PaginationItem>
            {Array.from(
              { length: totalPages },
              (_page, index) => index + 1,
            ).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink asChild isActive={page === pageNumber}>
                  <Link to={pageTo(pageNumber)}>{pageNumber}</Link>
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              {page < totalPages ? (
                <PaginationNext asChild>
                  <Link to={pageTo(page + 1)}>
                    <span className="hidden sm:block">Next</span>
                    <ChevronRightIcon data-icon="inline-end" />
                  </Link>
                </PaginationNext>
              ) : (
                <PaginationNext
                  className="pointer-events-none opacity-50"
                  aria-disabled
                  href="#"
                  onClick={(e) => e.preventDefault()}
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
