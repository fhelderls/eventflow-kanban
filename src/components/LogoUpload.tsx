import { useState } from "react";
import { useSetting, useUpdateSetting } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Upload, Image as ImageIcon, X } from "lucide-react";

export const LogoUpload = () => {
  const { data: logoSetting } = useSetting("logo");
  const updateSetting = useUpdateSetting();
  const [logoUrl, setLogoUrl] = useState("");
  const [logoEnabled, setLogoEnabled] = useState(false);

  const currentLogo = logoSetting?.value || { url: "", enabled: false };

  const handleSave = async () => {
    await updateSetting.mutateAsync({
      key: "logo",
      value: {
        url: logoUrl || currentLogo.url,
        enabled: logoEnabled
      }
    });
  };

  const handleRemove = async () => {
    await updateSetting.mutateAsync({
      key: "logo",
      value: { url: "", enabled: false }
    });
    setLogoUrl("");
    setLogoEnabled(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Logo da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="logo-enabled"
            checked={logoEnabled || currentLogo.enabled}
            onCheckedChange={setLogoEnabled}
          />
          <Label htmlFor="logo-enabled">Exibir logo no sistema</Label>
        </div>

        {currentLogo.url && (
          <div className="space-y-2">
            <Label>Logo Atual</Label>
            <div className="relative inline-block">
              <img
                src={currentLogo.url}
                alt="Logo atual"
                className="max-w-48 max-h-24 object-contain border rounded"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="logo-url">URL da Nova Logo</Label>
          <Input
            id="logo-url"
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://exemplo.com/logo.png"
          />
        </div>

        {logoUrl && (
          <div className="space-y-2">
            <Label>Preview</Label>
            <img
              src={logoUrl}
              alt="Preview da logo"
              className="max-w-48 max-h-24 object-contain border rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={updateSetting.isPending}
            className="bg-gradient-primary"
          >
            <Upload className="w-4 h-4 mr-2" />
            {updateSetting.isPending ? "Salvando..." : "Salvar Logo"}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Dica: Use uma URL pública de uma imagem (PNG, JPG, SVG) com boa qualidade.
          Tamanho recomendado: 200x80 pixels.
        </p>
      </CardContent>
    </Card>
  );
};