import type { ComponentPropsWithoutRef, ElementType } from "react";
import type { PolymorphicBase } from "@/lib/types";
import cn from "classnames";

const Root = <T extends ElementType>({
  as,
  ...props
}: PolymorphicBase<T> & ComponentPropsWithoutRef<T>) => {
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
}: PolymorphicBase<T> & ComponentPropsWithoutRef<T>) => {
  const Component = as || "li";
  return <Component {...props} />;
};

export default Object.assign(Root, { Item });
