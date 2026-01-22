import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const button = cva("rounded-full hover:cursor-pointer flex items-center justify-center transition-all ease-in-out font-medium transition", {
  variants: {
    variant: {
      primary: "bg-green-600 hover:bg-green-500 text-white",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border dark:text-white hover:bg-white hover:!text-black border-gray-200 dark:border-gray-700",
    },
    size: {
      sm: "px-3 h-8",
      md: "px-4 h-10",
      lg: "h-11  px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  );
}
