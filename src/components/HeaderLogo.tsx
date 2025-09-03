import { useSetting } from "@/hooks/useSettings";

export const HeaderLogo = () => {
  const { data: logoSetting } = useSetting("logo");
  
  const logoConfig = logoSetting?.value || { url: "", enabled: false };
  
  if (!logoConfig.enabled || !logoConfig.url) {
    return (
      <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        Event Manager
      </h1>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img 
        src={logoConfig.url} 
        alt="Logo" 
        className="max-h-8 w-auto object-contain"
        onError={(e) => {
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
        Event Manager
      </h1>
    </div>
  );
};