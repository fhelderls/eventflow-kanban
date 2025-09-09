import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    }
  }, [navigate, user, loading]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 animate-pulse-glow"></div>
        <h2 className="text-2xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Event Manager
        </h2>
        <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
