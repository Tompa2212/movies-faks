import React from 'react';

const BookmarkedIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="w-16 h-16 fill-yellow-400 stroke-yellow-400"
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"></path>
      <path d="m9 10 2 2 4-4" className="stroke-zinc-800"></path>
    </svg>
  );
};

export default BookmarkedIcon;
