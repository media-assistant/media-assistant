import type { ElementType, ReactNode } from "react";

type Well = {
  as?: ElementType;
  children: ReactNode;
};

const Well = ({ as: Component = "div", children }: Well) => (
  <Component className="prose prose-invert rounded-xl bg-neutral-800 p-5">
    {children}
  </Component>
);

export default Well;
