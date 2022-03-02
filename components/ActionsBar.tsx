import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import cn from "classnames";

type BaseProps<T extends ElementType> = {
  as?: T;
  children?: ReactNode;
};

const Root = <T extends ElementType>({
  as,
  ...props
}: BaseProps<T> & ComponentPropsWithoutRef<T>) => {
  const Component = as || "ul";
  const className = cn(
    props.className,
    "not-prose flex w-full items-center justify-center space-x-2"
  );
  return <Component {...props} className={className} />;
};

const Item = <T extends ElementType>({
  as,
  ...props
}: BaseProps<T> & ComponentPropsWithoutRef<T>) => {
  const Component = as || "li";
  return <Component {...props} />;
};

export default Object.assign(Root, { Item });
