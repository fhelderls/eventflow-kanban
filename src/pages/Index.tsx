import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

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
      <div className="flex-1 order-1 md:order-2 pb-16 md:pb-0 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Redirecionando...</h2>
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
