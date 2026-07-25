import type { Translation } from "../i18n";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  translation: Translation;
}

function Pagination({ currentPage, totalPages, onPrevious, onNext, translation }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label={translation.countryTablePages}>
      <button
        type="button"
        className="page-button"
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        {translation.previous}
      </button>
      <span>{translation.pageOf(currentPage, totalPages)}</span>
      <button
        type="button"
        className="page-button"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        {translation.next}
      </button>
    </nav>
  );
}

export default Pagination;
