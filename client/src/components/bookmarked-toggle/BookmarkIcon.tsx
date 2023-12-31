import React from 'react';

const BookmarkIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="w-16 h-16 fill-zinc-900 stroke-zinc-900"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
      <line className="stroke-zinc-50" x1="12" x2="12" y1="7" y2="13"></line>
      <line className="stroke-zinc-50" x1="15" x2="9" y1="10" y2="10"></line>
    </svg>
  );
};

export default BookmarkIcon;
