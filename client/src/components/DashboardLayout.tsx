import React, { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { USER_ROLES } from "../const";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!user) return null;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["all"] },
    { name: "Turmas", href: "/classes", icon: Users, roles: [USER_ROLES.ADMIN, USER_ROLES.COORDINATOR, USER_ROLES.TEACHER] },
    { name: "Alunos", href: "/students", icon: GraduationCap, roles: [USER_ROLES.ADMIN, USER_ROLES.COORDINATOR, USER_ROLES.TEACHER] },
    { name: "Carômetro", href: "/carometer", icon: UserCircle, roles: [USER_ROLES.COORDINATOR, USER_ROLES.TEACHER] },
    { name: "Questões", href: "/questions", icon: BookOpen, roles: [USER_ROLES.COORDINATOR, USER_ROLES.TEACHER] },
    { name: "Simulados", href: "/exams", icon: ClipboardList, roles: [USER_ROLES.COORDINATOR, USER_ROLES.TEACHER] },
    { name: "Minhas Provas", href: "/my-exams", icon: FileText, roles: [USER_ROLES.STUDENT] },
    { name: "Relatórios", href: "/reports", icon: BarChart3, roles: ["all"] },
    { name: "Configurações", href: "/settings", icon: Settings, roles: ["all"] },
  ];

  const filteredNavigation = navigation.filter((item) => {
    if (item.roles.includes("all")) return true;
    return item.roles.includes(user.role);
  });

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = location === item.href;
    return (
      <Link href={item.href}>
        <a
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => setSidebarOpen(false)}
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.name}</span>
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Sistema Educacional</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-primary">Sistema Educacional</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
