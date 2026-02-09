import { useState, type ReactNode, type ImgHTMLAttributes } from "react";
import { User } from "lucide-react";

/* ---------------- Avatar ---------------- */

interface AvatarProps {
  children: ReactNode;
  className?: string;
}

export const Avatar = ({ children, className = "" }: AvatarProps) => (
  <div
    className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}
  >
    {children}
  </div>
);

/* ---------------- AvatarImage ---------------- */

interface AvatarImageProps
  extends Pick<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  className?: string;
}

export const AvatarImage = ({
  src,
  alt,
  className = "",
}: AvatarImageProps) => {
  const [error, setError] = useState<boolean>(false);

  if (!src || error) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`aspect-square h-full w-full object-cover ${className}`}
    />
  );
};

/* ---------------- AvatarFallback ---------------- */

interface AvatarFallbackProps {
  children?: ReactNode;
  className?: string;
}

export const AvatarFallback = ({
  children,
  className = "",
}: AvatarFallbackProps) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground ${className}`}
  >
    {children ?? <User className="h-1/2 w-1/2" />}
  </div>
);
