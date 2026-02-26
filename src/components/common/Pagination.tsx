import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  siblingCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Show first page
    if (leftSiblingIndex > 1) {
      pageNumbers.push(1);
      if (leftSiblingIndex > 2) {
        pageNumbers.push("...");
      }
    }

    // Show sibling pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }

    // Show last page
    if (rightSiblingIndex < totalPages) {
      if (rightSiblingIndex < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..." || isLoading}
          className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
            page === currentPage
              ? "bg-green-600 text-white dark:bg-green-500"
              : page === "..."
              ? "cursor-default text-gray-400 dark:text-gray-500"
              : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Page Info */}
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
