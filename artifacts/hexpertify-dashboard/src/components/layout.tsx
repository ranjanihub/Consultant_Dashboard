import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LineChart,
  DollarSign,
  Star,
  PenTool,
  FileText,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Flag,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const SIDEBAR_ITEMS = [
  {
    label: "WORKSPACE",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Clients", href: "/clients", icon: Users, badge: "24" },
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Outcomes", href: "/outcomes", icon: LineChart },
      { name: "Revenue", href: "/revenue", icon: DollarSign },
      { name: "Reviews", href: "/reviews", icon: Star },
    ],
  },
  {
    label: "CONTENT",
    items: [
      { name: "Blog", href: "/blog", icon: PenTool },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col bg-white border-r border-border h-[calc(100vh-64px)] fixed left-0 top-[64px] z-10 overflow-y-auto">
      <div className="flex-1 py-6 px-4 space-y-8">
        {SIDEBAR_ITEMS.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              {section.label}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")}
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded-full",
                          isActive ? "bg-primary-foreground/20 text-white" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-foreground hover:bg-secondary",
            location.startsWith("/profile") && "bg-secondary"
          )}
        >
          <User className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          <span className="font-medium text-sm">My Profile</span>
        </Link>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">SW</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">Dr. Sarah Wilson</span>
              <span className="text-xs text-muted-foreground mt-1">Clinical Psychologist</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground">Available / Accepting</span>
            <div className="w-8 h-4 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          <button className="flex items-center gap-3 px-3 py-2 w-full text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="h-[64px] bg-white border-b border-border flex items-center justify-between px-6 fixed top-0 w-full z-20">
      <div className="flex items-center gap-3 min-w-[240px]">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-sm transform rotate-45"></div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-none tracking-tight">Hexpertify</span>
          <span className="text-[10px] font-semibold text-muted-foreground tracking-wider mt-0.5">CLINICAL SUITE</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search clients, sessions, notes..." 
            className="w-full bg-secondary/50 border border-border hover:border-border/80 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary rounded-full pl-10 pr-16 py-2 text-sm transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full">
            <Calendar className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full relative">
            <Flag className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border border-white"></span>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-full relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-white"></span>
          </Button>
        </div>
        
        <Button className="rounded-full shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Quick action
        </Button>
        
        <div className="w-px h-8 bg-border mx-2"></div>
        
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">SW</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 pt-[64px]">
        <Sidebar />
        <main className="flex-1 ml-[240px] p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
