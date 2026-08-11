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
  ClipboardCheck,
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
      { name: "Assessments", href: "/assessments", icon: ClipboardCheck },
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
      <div className="w-[240px] flex-shrink-0 flex flex-col bg-white border-r border-border h-[calc(100vh-88px)] fixed left-0 top-[88px] z-10 overflow-y-auto">
        <div className="flex-1 py-6 px-4 space-y-8">
          {SIDEBAR_ITEMS.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">
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
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group",
                        isActive
                          ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/25"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
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

          <div className="mt-4 pt-4 border-t border-border flex flex-col items-start gap-3 px-1">
            <div className="flex items-center justify-start py-1">
              <img 
                src="/hexpertify-logo.png" 
                alt="Hexpertify Logo" 
                className="h-20 w-auto object-contain max-h-20" 
              />
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
  const [, setLocation] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "High Risk Assessment Alert",
      message: "James Chen scored 17/21 (Severe) on GAD-7",
      time: "25m ago",
      read: false,
      href: "/assessments",
      type: "alert",
    },
    {
      id: "2",
      title: "New Assessment Completed",
      message: "Emma Martinez submitted PHQ-9 (8/27 - Mild)",
      time: "1h ago",
      read: false,
      href: "/assessments",
      type: "assessment",
    },
    {
      id: "3",
      title: "Session Booked",
      message: "Priya Kapoor scheduled session for tomorrow at 2:15 PM",
      time: "3h ago",
      read: false,
      href: "/calendar",
      type: "calendar",
    },
    {
      id: "4",
      title: "New Client Message",
      message: "David Kim: 'Can we review the CBT worksheet?'",
      time: "Yesterday",
      read: true,
      href: "/messages",
      type: "message",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (href: string, id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    setLocation(href);
  };

  return (
    <header className="h-[88px] bg-white border-b border-border flex items-center justify-between px-6 fixed top-0 w-full z-20">
      <Link href="/" className="flex items-center gap-2 min-w-[280px] focus:outline-none cursor-pointer">
        <img 
          src="/hexpertify-logo.png" 
          alt="Hexpertify Logo" 
          className="h-[76px] w-auto object-contain max-h-[76px]" 
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

        {/* Bell Icon with Interactive Notifications Popover */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-600 hover:text-slate-900 transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer focus:outline-none"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#5e2be2] rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowNotifications(false)} 
              />
              
              {/* Notifications Popover Dropdown */}
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden animate-in fade-in-0 zoom-in-95">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs font-medium">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item.href, item.id)}
                        className={cn(
                          "p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start",
                          !item.read && "bg-purple-50/40"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5",
                          item.type === "alert" && "bg-red-100 text-red-600",
                          item.type === "assessment" && "bg-purple-100 text-purple-600",
                          item.type === "calendar" && "bg-blue-100 text-blue-600",
                          item.type === "message" && "bg-emerald-100 text-emerald-600"
                        )}>
                          {item.type === "alert" ? "!" : item.type === "assessment" ? "ASM" : item.type === "calendar" ? "CAL" : "MSG"}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn("text-xs font-semibold truncate", !item.read ? "text-slate-900 font-bold" : "text-slate-700")}>
                              {item.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
                  <Link 
                    href="/activities"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer block"
                  >
                    View Activity Log
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Messages Pill Button */}
        <Link href="/messages">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-extrabold h-10 px-4 text-xs sm:text-sm shadow-md shadow-[#5e2be2]/25 transition-all active:scale-95 cursor-pointer">
            <MessageSquare className="w-4 h-4" />
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
      <div className="flex flex-1 pt-[88px]">
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
