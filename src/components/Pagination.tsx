interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

function Pagination({ currentPage, totalPages, onPrevious, onNext }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Country table pages">
      <button
        type="button"
        className="page-button"
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button
        type="button"
        className="page-button"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
