import { Children, cloneElement } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/router";

type GoBack = {
  children?: ReactNode;
  confirm?: string;
};

const GoBack = ({ children, ...props }: GoBack) => {
  const router = useRouter();
  const onClick = () => {
    if (props.confirm) {
      confirm(props.confirm) && router.back();
    } else {
      router.back();
    }
  };

  return cloneElement(Children.only(children) as any, { onClick });
};

export default GoBack;
