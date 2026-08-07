import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  className,
  as: Component = "div",
  ...props
}) => {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[1280px] px-4 mobile:px-6 tablet:px-8 laptop:px-12",
        className
      )}
      {...props}
    />
  );
};
