import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GradientButton from './GradientButton';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-gray-400 text-sm">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <GradientButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="ghost"
          className="px-3"
        >
          <ChevronLeft className="w-4 h-4" />
        </GradientButton>

        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-10 h-10 rounded-xl font-medium transition-all p-0
              ${currentPage === page
                ? 'highlight-bg shadow-sm'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
              }
            `}
          >
            {page}
          </Button>
        ))}

        <GradientButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="ghost"
          className="px-3"
        >
          <ChevronRight className="w-4 h-4" />
        </GradientButton>
      </div>
    </div>
  );
};

export default Pagination;