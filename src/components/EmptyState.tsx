import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  children 
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-medium text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground max-w-sm mb-6">
        {description}
      </p>

      {action && (
        <Button 
          onClick={action.onClick}
          className="mb-4"
        >
          {action.label}
        </Button>
      )}

      {children}
    </div>
  );
};