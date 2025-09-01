import { Calendar, Home, Settings, Package, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const location = useLocation();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/events", label: "Eventos", icon: Calendar },
    { path: "/equipment", label: "Equipamentos", icon: Package },
    { path: "/clients", label: "Clientes", icon: Users },
  ];

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 md:relative md:border-t-0 md:bg-transparent md:backdrop-blur-none", className)}>
      <div className="flex justify-around items-center py-3 px-4 md:justify-start md:gap-2 md:py-0">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 min-w-[60px] md:min-w-0",
                "md:flex-row md:gap-3 md:px-4 md:py-3 md:rounded-lg md:w-full",
                isActive 
                  ? "text-primary bg-primary/10 scale-105 md:scale-100 md:bg-primary/15 md:shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105 md:hover:scale-100 md:hover:bg-muted/80"
              )}
            >
              <IconComponent className={cn(
                "transition-all duration-300",
                isActive ? "w-6 h-6 md:w-5 md:h-5" : "w-5 h-5"
              )} />
              <span className={cn(
                "text-xs font-medium transition-all duration-300 md:text-sm",
                isActive ? "font-semibold" : ""
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};