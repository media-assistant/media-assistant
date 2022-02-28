import type { ElementType } from "react";

type IconButtonWithLabelProps = {
  as?: ElementType;
  icon: ElementType;
  label: string;
  [key: string]: any;
};

const IconButtonWithLabel = ({
  as: Component = "button",
  icon: Icon,
  label,
  ...props
}: IconButtonWithLabelProps) => {
  return (
    <Component
      className="flex h-16 w-16 flex-col items-center justify-center space-y-1"
      {...props}
    >
      <Icon className="box-content h-5 w-5 rounded-full bg-neutral-800 p-2" />
      <span className="text-xs">{label}</span>
    </Component>
  );
};

export default IconButtonWithLabel;
