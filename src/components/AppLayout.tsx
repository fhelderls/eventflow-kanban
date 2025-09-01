import { ReactNode } from "react";
import { Navigation } from "@/components/ui/navigation";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  headerAction?: ReactNode;
}

export const AppLayout = ({ children, title, description, headerAction }: AppLayoutProps) => {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden order-2">
        <Navigation />
      </div>
      
      {/* Desktop Navigation - Side */}
      <div className="hidden md:block w-64 border-r border-border bg-card">
        <div className="p-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Event Manager
          </h1>
          <Navigation />
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