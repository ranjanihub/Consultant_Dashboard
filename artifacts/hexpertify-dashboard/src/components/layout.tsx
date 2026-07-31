import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { logoutUser, getAuthUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Calendar,
  LineChart,
  IndianRupee,
  Star,
  FolderOpen,
  MessageSquare,
  PenTool,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Flag,
  Plus,
  Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SIDEBAR_ITEMS = [
  {
    label: "WORKSPACE",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Activities", href: "/activities", icon: Activity, badge: "4" },
      { name: "Clients", href: "/clients", icon: Users, badge: "24" },
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Messages", href: "/messages", icon: MessageSquare, badge: "3" },
      { name: "Outcomes", href: "/outcomes", icon: LineChart },
      { name: "Revenue", href: "/revenue", icon: IndianRupee },
      { name: "Reviews", href: "/reviews", icon: Star },
      { name: "Resources", href: "/resources", icon: FolderOpen },
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
  const [location, setLocation] = useLocation();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const user = getAuthUser();

  const confirmSignOut = () => {
    setShowSignOutDialog(false);
    logoutUser();
    setLocation("/login");
  };

  return (
    <>
      <div className="w-[240px] flex-shrink-0 flex flex-col bg-white border-r border-border h-[calc(100vh-72px)] fixed left-0 top-[72px] z-10 overflow-y-auto">
        <div className="flex-1 py-6 px-4 space-y-8">
          {SIDEBAR_ITEMS.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
                {section.label}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                        )}>
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

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-muted-foreground hover:text-foreground hover:bg-secondary",
              location.startsWith("/settings") && "bg-secondary text-foreground"
            )}
          >
            <Settings className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
            <span className="font-medium text-sm">Settings</span>
          </Link>

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
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user?.avatarInitials || "AH"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">{user?.name || "Dr. Alex Harrison"}</span>
                <span className="text-xs text-muted-foreground mt-1">{user?.title || "Clinical Psychologist"}</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => setShowSignOutDialog(true)}
              className="flex items-center gap-3 px-3 py-2 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent className="max-w-[380px] w-full p-6 sm:p-7 rounded-[24px] bg-white border-none shadow-2xl space-y-0 gap-0 outline-none sm:rounded-[24px] [&>button]:hidden">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
            <LogOut className="w-5 h-5 text-red-500 stroke-[2.2]" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
            Sign out
          </h2>
          <p className="text-slate-500 text-sm font-medium mb-6">
            Are you sure you want to sign out?
          </p>

          <div className="flex items-center gap-3 w-full pt-1">
            <button
              type="button"
              onClick={() => setShowSignOutDialog(false)}
              className="flex-1 h-11 rounded-2xl border border-slate-200 bg-white text-slate-900 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmSignOut}
              className="flex-1 h-11 rounded-2xl bg-[#ef4444] hover:bg-red-600 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Header() {
  return (
    <header className="h-[72px] bg-white border-b border-border flex items-center justify-between px-6 fixed top-0 w-full z-20">
      <Link href="/" className="flex items-center gap-2 min-w-[260px] focus:outline-none cursor-pointer">
        <img 
          src="/hexpertify-logo.png" 
          alt="Hexpertify Logo" 
          className="h-14 w-auto object-contain max-h-14 py-1" 
        />
      </Link>

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

      <div className="flex items-center gap-5">
        {/* Calendar Icon */}
        <Link href="/calendar">
          <button type="button" className="text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer">
            <Calendar className="w-5 h-5 stroke-[2]" />
          </button>
        </Link>

        {/* Bell Icon with Purple Badge */}
        <button type="button" className="relative text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer">
          <Bell className="w-5 h-5 stroke-[2]" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#6d28d9] rounded-full border-2 border-white"></span>
        </button>

        {/* Messages Pill Button */}
        <Link href="/messages">
          <button type="button" className="inline-flex items-center gap-2.5 rounded-2xl bg-[#5b32e4] hover:bg-[#4c28c8] text-white font-bold h-10 px-5 text-base shadow-sm transition-all cursor-pointer">
            <MessageSquare className="w-5 h-5 stroke-[2.2]" />
            <span>Messages</span>
          </button>
        </Link>

        {/* User Avatar */}
        <Link href="/profile">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200/80 cursor-pointer hover:opacity-90 transition-opacity bg-[#fff0eb] flex items-center justify-center shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 pt-[72px]">
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
