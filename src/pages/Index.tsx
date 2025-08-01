import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Dashboard } from "./Dashboard";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "events":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Eventos</h2>
              <p className="text-muted-foreground">Lista detalhada de eventos em breve...</p>
            </div>
          </div>
        );
      case "equipment":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Equipamentos</h2>
              <p className="text-muted-foreground">Gerenciamento de equipamentos em breve...</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Configurações</h2>
              <p className="text-muted-foreground">Configurações do app em breve...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden order-2">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
      
      {/* Desktop Navigation - Side */}
      <div className="hidden md:block w-64 border-r border-border bg-card">
        <div className="p-4">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Event Manager
          </h1>
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 order-1 md:order-2 pb-16 md:pb-0 overflow-hidden">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default Index;
