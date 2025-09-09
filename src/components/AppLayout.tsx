import { ReactNode } from "react";
import { Navigation } from "@/components/ui/navigation";
import { HeaderLogo } from "@/components/HeaderLogo";
interface AppLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  headerAction?: ReactNode;
}
export const AppLayout = ({
  children,
  title,
  description,
  headerAction
}: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden order-2">
        <Navigation />
      </div>
      
      {/* Desktop Navigation - Side */}
      <div className="hidden md:block w-72 border-r border-border/50 bg-gradient-to-b from-card to-card/80 shadow-xl">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8 animate-fade-in">
            <HeaderLogo />
            <p className="text-xs text-muted-foreground/80 font-medium mt-2">
              Sistema de Gestão de Eventos
            </p>
          </div>
          <div className="flex-1">
            <Navigation />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 order-1 md:order-2 pb-20 md:pb-0 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {title}
                </h1>
                {description && (
                  <p className="text-muted-foreground text-sm">
                    {description}
                  </p>
                )}
              </div>
              {headerAction && (
                <div className="flex items-center gap-2">
                  {headerAction}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};