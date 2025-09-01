import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState = ({ 
  message = "Carregando...", 
  className,
  size = "md" 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex items-center justify-center gap-3 py-8", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
};

export const InlineLoader = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5"
  };

  return (
    <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
  );
};