import { Calendar, Home, Settings, Package, Users, LogOut, Shield, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUserRole } from "@/hooks/useUserRoles";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
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
                "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
                "md:flex-row md:gap-4 md:px-4 md:py-3 md:w-full",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs md:text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Auth Buttons - Mobile */}
        <div className="md:hidden">
          {user ? (
            <Button
              variant="ghost"
              onClick={signOut}
              className="flex flex-col items-center gap-1 p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-medium">Sair</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="flex flex-col items-center gap-1 p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-xs font-medium">Entrar</span>
            </Button>
          )}
        </div>
        
        {/* User Info and Logout - Desktop Only */}
        <div className="hidden md:block mt-auto pt-4 border-t border-border/50">
          {user ? (
            <div className="space-y-2">
              <div className="px-4 py-2">
                <p className="text-xs text-muted-foreground">Usuário:</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <Button
                variant="ghost"
                onClick={signOut}
                className="w-full justify-start px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="w-full justify-start px-4 py-2 text-muted-foreground hover:text-foreground"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};