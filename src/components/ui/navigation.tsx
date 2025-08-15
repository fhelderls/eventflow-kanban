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
    <nav className={cn("fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:relative md:border-t-0 md:bg-transparent", className)}>
      <div className="flex justify-around items-center py-2 px-4 md:justify-start md:gap-6">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                "md:flex-row md:gap-2 md:px-4 md:py-2",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};