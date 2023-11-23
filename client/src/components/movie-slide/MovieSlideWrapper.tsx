'use client';
import React, { useRef, useState } from 'react';
import Icon from '../ui/Icons';
import { useDebounce } from '@/hooks/use-debounce';
import clsx from 'clsx';
import { Button } from '../ui/Button';

const isOverflown = (element: HTMLElement) => {
  return element.scrollWidth > element.offsetWidth;
};

const scrollLeft = (element: HTMLElement) => {
  element.scrollBy({
    left: -550,
    behavior: 'smooth'
  });
};

const scrollRight = (element: HTMLElement) => {
  element.scrollBy({
    left: 550,
    behavior: 'smooth'
  });
};

const MovieSlideWrapper = ({ children }: { children: React.ReactNode }) => {
  const [canScrollSides, setCanScrollSides] = useState([false, false]);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const handleScrollAndMouseOver = useDebounce(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const elem = scrollElementRef.current;

      if (!elem) {
        return;
      }

      const isOverflowed = isOverflown(elem);

      if (!isOverflowed) {
        return setCanScrollSides([false, false]);
      }

      const canScrollLeft = elem.scrollLeft > 0;
      const canScrollRight =
        Math.trunc(elem.scrollLeft + elem.offsetWidth) !==
        Math.trunc(elem.scrollWidth);

      setCanScrollSides([canScrollLeft, canScrollRight]);
    },
    200
  );

  const handleScrollLeft = () => {
    if (scrollElementRef.current) {
      scrollLeft(scrollElementRef.current);
    }
  };

  const handleScrollRight = () => {
    if (scrollElementRef.current) {
      scrollRight(scrollElementRef.current);
    }
  };

  return (
    <div
      className="relative shadow group"
      onMouseEnter={handleScrollAndMouseOver}
    >
      <div
        className={clsx(
          'absolute top-0 grid items-center w-12 h-full px-3 transition-opacity opacity-0 pointer-events-none bg-zinc-50/70',
          canScrollSides[0] &&
            'group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
        )}
      >
        <Button
          onClick={handleScrollLeft}
          variant="link"
          className="p-0 text-zinc-950"
        >
          <Icon name="ArrowLeft" className="w-8 h-8" />
        </Button>
      </div>
      <div
        ref={scrollElementRef}
        onScroll={handleScrollAndMouseOver}
        className="overflow-scroll max-w-[100%]"
      >
        {children}
      </div>
      <div
        className={clsx(
          'absolute top-0 right-0 grid items-center w-16 h-full px-3 transition-opacity opacity-0 pointer-events-none bg-zinc-50/70',
          canScrollSides[1] &&
            'group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
        )}
      >
        <Button
          onClick={handleScrollRight}
          variant="link"
          className="p-0 text-zinc-950"
        >
          <Icon name="ArrowRight" className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

export default MovieSlideWrapper;
