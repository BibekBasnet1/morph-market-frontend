import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const button = cva("rounded-md hover:cursor-pointer flex items-center transition-all ease-in-out font-medium transition", {
  variants: {
    variant: {
      primary: "bg-blue-600 text-white",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border",
    },
    size: {
      sm: "px-3 h-8",
      md: "px-4 h-10",
      lg: "h-11 rounded-md px-8",
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
