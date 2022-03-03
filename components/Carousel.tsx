import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { identity, pickBy } from "lodash";
import { useCallback, useEffect } from "react";
import type { EmblaOptionsType } from "embla-carousel-react";
import Link from "next/link";
import type { LinkProps } from "next/link";
import type { PolymorphicBase } from "@/lib/types";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import cn from "classnames";
import useEmblaCarousel from "embla-carousel-react";

type ExtendedBase<T extends ElementType> = PolymorphicBase<T> & {
  // eslint-disable-next-line no-unused-vars
  onChange?: (index: number) => void;
};

const CarouselRoot = <T extends ElementType>({
  as,
  children,
  onChange,

  // Embla options
  align,
  axis,
  containScroll,
  direction,
  dragFree,
  draggable,
  inViewThreshold,
  loop,
  skipSnaps,
  slidesToScroll,
  speed,
  startIndex,

  ...props
}: ExtendedBase<T> & ComponentPropsWithoutRef<T> & EmblaOptionsType) => {
  const Component = as || "div";

  const emblaOptions = pickBy(
    {
      align,
      axis,
      containScroll,
      direction,
      dragFree,
      draggable,
      inViewThreshold,
      loop,
      skipSnaps,
      slidesToScroll,
      speed,
      startIndex,
    },
    identity
  );

  const [emblaRef, embla] = useEmblaCarousel(emblaOptions, [
    WheelGesturesPlugin(),
  ]);

  // Helper function to safely get the currently selected index:
  const getSelectedIndex = useCallback(
    () => (embla ? embla.selectedScrollSnap() : 0),
    [embla]
  );

  // Call `onChange` when a slide is selected:
  const onSelect = useCallback(
    () => onChange && onChange(getSelectedIndex()),
    [getSelectedIndex, onChange]
  );

  // Listen to events so we can call `onChange`:
  useEffect(() => {
    if (!embla) return;

    // Listen for select events:
    embla.on("select", onSelect);

    // Stop listening when component unmounts:
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla, onSelect]);

  const className = cn(props.className, "overflow-hidden");

  return (
    <Component className={className} ref={emblaRef}>
      {/* FIXME: width of the items is now hardcoded and quite possibly wrong in most of the situations */}
      <div className="grid auto-cols-[35%] grid-flow-col gap-x-5">
        {children}
      </div>
    </Component>
  );
};

type LinkItemProps = {
  aspectRatio?: "poster" | "video";
  children: ReactNode | undefined;
  className?: string;
  [key: string]: any;
} & LinkProps;

const LinkItem = ({
  // LinkProps
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,

  // LinkItemProps
  children,
  aspectRatio = "poster",

  ...props
}: LinkItemProps) => {
  const linkProps = pickBy<LinkProps>(
    {
      as,
      href,
      locale,
      passHref,
      prefetch,
      replace,
      scroll,
      shallow,
    },
    identity
  );

  const className = cn(
    "relative",
    {
      "aspect-poster": aspectRatio === "poster",
      "aspect-video": aspectRatio === "video",
    },
    props.className
  );

  return (
    <Link href={href} {...linkProps}>
      <a className={className}>{children}</a>
    </Link>
  );
};

export default Object.assign(CarouselRoot, { LinkItem });
