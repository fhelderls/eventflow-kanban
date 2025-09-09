import { useCurrentUserRole, useUserProfiles, useAssignRole } from "@/hooks/useUserRoles";
import { useAuth } from "@/hooks/useAuth";
import { LogoUpload } from "@/components/LogoUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Settings, ArrowLeft } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";

export const Admin = () => {
  const { user } = useAuth();
  const { data: currentRole } = useCurrentUserRole();
  const { data: users = [] } = useUserProfiles();
  const assignRole = useAssignRole();

  // Only admin users can access this page
  if (!user || currentRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    await assignRole.mutateAsync({ userId, role: newRole });
  };

  const getRoleColor = (role?: string) => {
    return role === 'admin' 
      ? "bg-destructive text-destructive-foreground" 
      : "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden order-2">
        <Navigation />
      </div>
      
      {/* Desktop Navigation - Side */}
      <div className="hidden md:block w-64 border-r border-border bg-card">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary mb-6">
            Event Manager
          </h1>
          <Navigation />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 order-1 md:order-2 pb-16 md:pb-0 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/"}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Shield className="w-8 h-8 text-primary" />
                  Administração
                </h1>
                <p className="text-muted-foreground">
                  Gerenciar usuários e configurações do sistema
                </p>
              </div>
            </div>
          </div>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gerenciamento de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum usuário encontrado.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Função Atual</TableHead>
                      <TableHead>Alterar Função</TableHead>
                      <TableHead>Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userProfile) => {
                      const userRole = userProfile.roles?.[0]?.role || 'user';
                      
                      return (
                        <TableRow key={userProfile.id}>
                          <TableCell className="font-medium">
                            {userProfile.name}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {userProfile.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(userRole)}>
                              {userRole === 'admin' ? 'Administrador' : 'Usuário'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={userRole}
                              onValueChange={(value: 'admin' | 'user') => 
                                handleRoleChange(userProfile.id, value)
                              }
                              disabled={assignRole.isPending || userProfile.id === user?.id}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">Usuário</SelectItem>
                                <SelectItem value="admin">Administrador</SelectItem>
                              </SelectContent>
                            </Select>
                            {userProfile.id === user?.id && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Você não pode alterar sua própria função
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LogoUpload />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};