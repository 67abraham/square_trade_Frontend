import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  itemLabel?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'simple';
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  itemLabel = 'items',
  className = '',
  variant = 'default'
}) => {
  if (totalPages <= 1 && (!totalItems || totalItems <= (pageSize || 10))) {
    // If only 1 page and no need for controls, we still show the count if totalItems is passed or return null if empty
    if (!totalItems) return null;
  }

  // Calculate items range
  const startItem = totalItems !== undefined && pageSize !== undefined
    ? Math.min((currentPage - 1) * pageSize + 1, totalItems)
    : undefined;
  const endItem = totalItems !== undefined && pageSize !== undefined
    ? Math.min(currentPage * pageSize, totalItems)
    : undefined;

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  if (variant === 'simple') {
    return (
      <div className={`flex items-center justify-between gap-3 text-xs font-inter ${className}`}>
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined && (
          <span className="text-slate-500">
            {startItem}-{endItem} of {totalItems} {itemLabel}
          </span>
        )}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 text-xs font-semibold text-slate-700">
            Page {currentPage} of {Math.max(totalPages, 1)}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 font-inter select-none ${className}`}>
      {/* Items count & Page Size Selector */}
      <div className="flex items-center gap-3 text-xs md:text-sm text-slate-600">
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
          <span>
            Showing <strong className="font-semibold text-slate-900">{startItem}</strong> to{' '}
            <strong className="font-semibold text-slate-900">{endItem}</strong> of{' '}
            <strong className="font-semibold text-slate-900">{totalItems}</strong> {itemLabel}
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold text-slate-900">{currentPage}</strong> of{' '}
            <strong className="font-semibold text-slate-900">{Math.max(totalPages, 1)}</strong>
          </span>
        )}

        {pageSizeOptions && onPageSizeChange && pageSize && (
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-xs text-slate-400">Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="text-xs font-semibold border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0051d5] cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} / page
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* First Page */}
        <motion.button
          whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="hidden sm:flex p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </motion.button>

        {/* Prev Page */}
        <motion.button
          whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
          whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">Prev</span>
        </motion.button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 px-1">
          {pageNumbers.map((page, idx) => {
            if (page === '...' || typeof page === 'string') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-400 font-bold text-xs select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <motion.button
                key={`page-${page}`}
                whileHover={{ scale: isActive ? 1 : 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-[#0051d5] text-white shadow-sm font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </motion.button>
            );
          })}
        </div>

        {/* Next Page */}
        <motion.button
          whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
          whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Last Page */}
        <motion.button
          whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
          whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="hidden sm:flex p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
