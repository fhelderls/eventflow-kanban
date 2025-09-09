import { Calendar, Home, Settings, Package, Users, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUserRole } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { data: userRole } = useCurrentUserRole();
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/events", label: "Eventos", icon: Calendar },
    { path: "/equipment", label: "Equipamentos", icon: Package },
    { path: "/clients", label: "Clientes", icon: Users },
    ...(userRole === 'admin' ? [{ path: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 md:relative md:border-t-0 md:bg-transparent md:backdrop-blur-none", className)}>
      <div className="flex justify-around items-center py-4 px-2 md:justify-start md:gap-1 md:py-2 md:px-0 md:flex-col md:space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 flex-1 max-w-[80px] md:max-w-none md:min-w-0 group",
                "md:flex-row md:gap-4 md:px-5 md:py-4 md:rounded-xl md:w-full md:mb-2 md:flex-none",
                isActive 
                  ? "text-primary bg-gradient-primary/10 scale-105 md:scale-100 md:bg-gradient-primary/15 md:shadow-lg md:shadow-primary/20 md:border md:border-primary/20" 
                  : "text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/80 hover:scale-105 md:hover:scale-[1.02] md:hover:shadow-md md:hover:shadow-muted/50 md:hover:border md:hover:border-border/50"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-gradient-primary shadow-lg scale-110 md:scale-100" 
                  : "bg-muted/30 group-hover:bg-muted/60 group-hover:scale-110 md:group-hover:scale-105"
              )}>
                <IconComponent className={cn(
                  "transition-all duration-300",
                  isActive ? "w-5 h-5 text-white drop-shadow-sm" : "w-5 h-5"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300 md:text-sm md:flex-1 text-center leading-tight",
                isActive ? "font-bold" : "group-hover:font-medium"
              )}>{item.label}</span>
            </Link>
          );
        })}
        
        {/* User Info and Logout - Desktop Only */}
        <div className="hidden md:block mt-auto pt-4 border-t border-border/50">
          {user && (
            <div className="space-y-2">
              <div className="px-5 py-2">
                <p className="text-xs text-muted-foreground">Usuário logado:</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <Button
                variant="ghost"
                onClick={signOut}
                className="w-full justify-start px-5 py-4 h-auto text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};