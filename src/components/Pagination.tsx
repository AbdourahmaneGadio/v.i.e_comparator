import type { Translation } from "../i18n";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  translation: Translation;
}

function Pagination({ currentPage, totalPages, onFirst, onPrevious, onNext, onLast, translation }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label={translation.countryTablePages}>
      <button
        data-testid="first-page"
        type="button"
        className="page-button"
        disabled={currentPage === 1}
        onClick={onFirst}
      >
        {translation.first}
      </button>
      <button
        type="button"
        className="page-button"
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        {translation.previous}
      </button>
      <span data-testid="page-indicator">{translation.pageOf(currentPage, totalPages)}</span>
      <button
        data-testid="next-page"
        type="button"
        className="page-button"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        {translation.next}
      </button>
      <button
        data-testid="last-page"
        type="button"
        className="page-button"
        disabled={currentPage === totalPages}
        onClick={onLast}
      >
        {translation.last}
      </button>
    </nav>
  );
}

export default Pagination;
