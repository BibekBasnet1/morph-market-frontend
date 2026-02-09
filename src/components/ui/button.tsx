import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const button = cva("rounded-full hover:cursor-pointer flex items-center justify-center transition-all ease-in-out font-medium transition", {
  variants: {
variant: {
  primary:
    "bg-green-600 text-white hover:bg-green-500 " +
    "dark:bg-green-500 dark:hover:bg-green-400 dark:text-white",

  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 " +
    "dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",

  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-900 " +
    "dark:text-gray-100 dark:hover:bg-gray-800",

  destructive:
    "bg-red-600 text-white hover:bg-red-700 " +
    "dark:bg-red-500 dark:hover:bg-red-400 dark:text-white",

  outline:
    "border border-gray-200 text-gray-900 bg-transparent hover:bg-gray-100 " +
    "dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800",
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
