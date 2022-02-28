import type { ElementType, ReactNode } from "react";

type Root = {
  as?: ElementType;
  children?: ReactNode;
  [key: string]: any;
};

const Root = ({ as: Component = "ul", children, ...props }: Root) => (
  <Component
    className="not-prose flex w-full items-center justify-center space-x-2"
    {...props}
  >
    {children}
  </Component>
);

type Item = {
  as?: ElementType;
  children?: ReactNode;
  [key: string]: any;
};

const Item = ({ as: Component = "li", children, ...props }: Item) => (
  <Component {...props}>{children}</Component>
);

export default Object.assign(Root, { Item });
