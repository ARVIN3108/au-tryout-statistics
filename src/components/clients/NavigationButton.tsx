"use client";
import { useRouter } from "next/navigation";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface NavigationButtonProps extends DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> {
  action: "back" | "forward" | "refresh";
}

export default function NavigationButton({
  children,
  action,
  ...props
}: NavigationButtonProps) {
  const router = useRouter();
  return (
    <button
      {...props}
      onClick={() => {
        switch (action) {
          case "back":
            router.back();
            break;
          case "forward":
            router.forward();
            break;
          case "refresh":
            router.refresh();
            break;
        }
      }}
    >
      {children}
    </button>
  );
}
