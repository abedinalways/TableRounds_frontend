'use client';

type PaginationProps = {
  page: number;
  total?: number;
  limit: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

export default function Pagination({
  page,
  total = 0,
  limit,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goToPage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    onPageChange(safePage);
  };

  const getVisiblePages = () => {
    const pages: (number | '...')[] = [];

    const startPage = Math.max(2, page - siblingCount);
    const endPage = Math.min(totalPages - 1, page + siblingCount);

    pages.push(1);

    if (startPage > 2) pages.push('...');

    for (let p = startPage; p <= endPage; p++) {
      pages.push(p);
    }

    if (endPage < totalPages - 1) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex flex-wrap justify-end items-center gap-2 mt-4">
      <button
        onClick={() => goToPage(1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        First
      </button>

      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Prev
      </button>

      {getVisiblePages().map((item, index) =>
        item === '...' ? (
          <span key={`dots-${index}`} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={item}
            onClick={() => goToPage(item)}
            className={`px-3 py-1 border rounded transition ${
              page === item
                ? 'bg-[#01503b] text-white border-[#01503b]'
                : 'hover:bg-gray-50'
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>

      <button
        onClick={() => goToPage(totalPages)}
        disabled={page >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Last
      </button>
    </div>
  );
}
