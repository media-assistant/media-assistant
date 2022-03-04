import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import type { ElementType, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import cn from "classnames";
import { debounce } from "lodash";
import { useSpring } from "react-spring";

type HeaderProps = {
  as?: ElementType;
  children?: ReactNode;
};

const Header = ({ as, children }: HeaderProps) => {
  const Component = as || "div";

  return (
    <Component className="relative mt-6 mb-4 flex text-xl font-bold leading-7 text-gray-300 sm:truncate sm:text-2xl sm:leading-9">
      {children}
    </Component>
  );
};

type SliderProps = {
  sliderKey: string;
  items?: JSX.Element[];
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage?: string;
  placeholder?: ReactNode;
};

// eslint-disable-next-line no-unused-vars
enum Direction {
  // eslint-disable-next-line no-unused-vars
  RIGHT,
  // eslint-disable-next-line no-unused-vars
  LEFT,
}

const Slider: React.FC<SliderProps> = ({
  sliderKey,
  items,
  isLoading,
  isEmpty,
  emptyMessage,
  placeholder = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState({ isEnd: false, isStart: true });

  const handleScroll = useCallback(() => {
    const scrollWidth = containerRef.current?.scrollWidth ?? 0;
    const clientWidth =
      containerRef.current?.getBoundingClientRect().width ?? 0;
    const scrollPosition = containerRef.current?.scrollLeft ?? 0;

    if (!items || items?.length === 0) {
      setScrollPos({ isEnd: true, isStart: true });
    } else if (clientWidth >= scrollWidth) {
      setScrollPos({ isEnd: true, isStart: true });
    } else if (
      scrollPosition >=
      (containerRef.current?.scrollWidth ?? 0) - clientWidth
    ) {
      setScrollPos({ isEnd: true, isStart: false });
    } else if (scrollPosition > 0) {
      setScrollPos({ isEnd: false, isStart: false });
    } else {
      setScrollPos({ isEnd: false, isStart: true });
    }
  }, [items]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedScroll = useCallback(
    debounce(() => handleScroll(), 50),
    [handleScroll]
  );

  useEffect(() => {
    const handleResize = () => {
      debouncedScroll();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [debouncedScroll]);

  useEffect(() => {
    handleScroll();
  }, [items, handleScroll]);

  const onScroll = () => {
    debouncedScroll();
  };

  const [, setX] = useSpring(() => ({
    from: { x: 0 },
    onChange: (results) => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = results.value.x;
      }
    },
    to: { x: 0 },
  }));

  const slide = (direction: Direction) => {
    const clientWidth =
      containerRef.current?.getBoundingClientRect().width ?? 0;
    const cardWidth =
      containerRef.current?.firstElementChild?.getBoundingClientRect().width ??
      0;
    const scrollPosition = containerRef.current?.scrollLeft ?? 0;
    const visibleItems = Math.floor(clientWidth / cardWidth);
    const scrollOffset = scrollPosition % cardWidth;

    if (direction === Direction.LEFT) {
      const newX = Math.max(
        scrollPosition - scrollOffset - visibleItems * cardWidth,
        0
      );
      setX.start({
        config: { friction: 60, tension: 500, velocity: 20 },
        from: { x: scrollPosition },
        onChange: (results) => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = results.value.x;
          }
        },
        reset: true,
        to: { x: newX },
      });

      if (newX === 0) {
        setScrollPos({ isEnd: false, isStart: true });
      } else {
        setScrollPos({ isEnd: false, isStart: false });
      }
    } else if (direction === Direction.RIGHT) {
      const newX = Math.min(
        scrollPosition - scrollOffset + visibleItems * cardWidth,
        containerRef.current?.scrollWidth ?? 0 - clientWidth
      );
      setX.start({
        config: { friction: 60, tension: 500, velocity: 20 },
        from: { x: scrollPosition },
        onChange: (results) => {
          if (containerRef.current) {
            containerRef.current.scrollLeft = results.value.x;
          }
        },
        reset: true,
        to: { x: newX },
      });

      if (newX >= (containerRef.current?.scrollWidth ?? 0) - clientWidth) {
        setScrollPos({ isEnd: true, isStart: false });
      } else {
        setScrollPos({ isEnd: false, isStart: false });
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute right-0 -mt-10 flex text-gray-400">
        <button
          className={cn(
            { "cursor-not-allowed text-gray-800": scrollPos.isStart },
            { "hover:text-white": !scrollPos.isStart }
          )}
          disabled={scrollPos.isStart}
          onClick={() => slide(Direction.LEFT)}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          className={cn(
            { "cursor-not-allowed text-gray-800": scrollPos.isEnd },
            { "hover:text-white": !scrollPos.isEnd }
          )}
          disabled={scrollPos.isEnd}
          onClick={() => slide(Direction.RIGHT)}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
      <div
        className="hide-scrollbar relative -my-2 -ml-4 -mr-4 overflow-y-auto overflow-x-scroll overscroll-x-contain whitespace-nowrap px-2 py-2"
        onScroll={onScroll}
        ref={containerRef}
      >
        {items?.map((item, index) => (
          <div
            className="inline-block px-2 align-top"
            key={`${sliderKey}-${index}`}
          >
            {item}
          </div>
        ))}
        {isLoading &&
          [...Array(10)].map((_item, i) => (
            <div
              className="inline-block px-2 align-top"
              key={`placeholder-${i}`}
            >
              {placeholder}
            </div>
          ))}
        {isEmpty && (
          <div className="mt-16 mb-16 text-center text-white">
            {emptyMessage ? emptyMessage : "empty"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Object.assign(Slider, { Header });
