import type { ElementType, ReactNode } from "react";
import { identity, pickBy } from "lodash";
import type { EmblaOptionsType } from "embla-carousel-react";
import Link from "next/link";
import type { LinkProps } from "next/link";
import cn from "classnames";
import useEmblaCarousel from "embla-carousel-react";

type CarouselRootProps = EmblaOptionsType & {
  as?: ElementType;
  children: ReactNode | undefined;
  [key: string]: any; // Can we somehow make this respect the types mandated by the passed in "as" Component, if any?
};

const CarouselRoot = ({
  as: Component = "div",
  children,

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
}: CarouselRootProps) => {
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

  const [emblaRef] = useEmblaCarousel(emblaOptions);

  return (
    <Component className="overflow-hidden" ref={emblaRef}>
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
