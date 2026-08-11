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
  Plus,
  Activity,
  ChevronUp,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const WORKSPACE_ITEMS = [
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
];

const CONTENT_ITEMS = [
  { name: "Blog", href: "/blog", icon: PenTool },
];

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = getAuthUser();

  const confirmSignOut = () => {
    setShowSignOutDialog(false);
    logoutUser();
    setLocation("/login");
  };

  const isItemActive = (href: string) => {
    if (href === "/") {
      return location === "/" || location === "/dashboard";
    }
    return location.startsWith(href);
  };

  return (
    <>
      <aside
        className="fixed left-0 top-0 bottom-0 z-30 w-64 bg-white border-r border-[#eef1f6] flex flex-col shadow-sm"
        style={{ boxShadow: '2px 0 16px rgba(0, 0, 0, 0.02)' }}
      >
        {/* Brand Header */}
        <div className="h-24 px-4 flex items-center justify-start border-b border-[#f1f5f9] overflow-hidden shrink-0">
          <Link href="/" className="inline-flex items-center select-none cursor-pointer">
            <img
              src="/hexpertify-logo.png"
              alt="HEXPERTIFY ANYTIME,ANYWHERE"
              className="h-16 md:h-20 max-w-full w-auto object-contain transition-transform hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Workspace Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              WORKSPACE
            </div>
            <nav className="space-y-1">
              {WORKSPACE_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group",
                      isActive
                        ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Content Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              CONTENT
            </div>
            <nav className="space-y-1">
              {CONTENT_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group",
                      isActive
                        ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/25"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}

              <Link
                href="/settings"
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 group",
                  location.startsWith("/settings")
                    ? "bg-[#5e2be2] text-white shadow-md shadow-[#5e2be2]/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                )}
              >
                <div className="flex items-center gap-3">
                  <Settings
                    className={cn(
                      "w-4 h-4",
                      location.startsWith("/settings") ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  <span>Settings</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>

        {/* Admin Quick Profile Footer (Exact Super Admin Match) */}
        <div className="relative border-t border-[#f1f5f9] bg-slate-50/50 shrink-0">
          {showProfileMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowProfileMenu(false)} 
              />

              {/* Options Popover Menu */}
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-40 animate-in fade-in-0 slide-in-from-bottom-2">
                <div className="p-3 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900">{user?.name || "Dr. Alex Harrison"}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{user?.email || "alex.harrison@hexpertify.com"}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setLocation("/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>View Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setLocation("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setLocation("/activities");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span>Activity Log</span>
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowSignOutDialog(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}

          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-4 cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
            title="Click for options"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt="Admin Avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-[#5e2be2]/20"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-900">{user?.name || "Dr. Alex Harrison"}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{user?.title || "Platform Admin"}</p>
                </div>
              </div>
              <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>
      </aside>

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
    <header className="sticky top-0 z-20 h-24 bg-white/95 backdrop-blur-md border-b border-[#eef1f6] px-4 md:px-8 flex items-center justify-between shadow-sm">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search clients, sessions, notes..." 
            className="w-full bg-slate-100/70 hover:bg-slate-100 border border-slate-200/80 focus:bg-white focus:border-[#5e2be2] focus:ring-2 focus:ring-[#5e2be2]/10 rounded-full pl-10 pr-16 py-2.5 text-sm transition-all outline-none"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 shadow-2xs">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Calendar Icon */}
        <Link href="/calendar">
          <button type="button" className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer" title="View Schedule Calendar">
            <Calendar className="w-5 h-5 text-slate-600" />
          </button>
        </Link>

        {/* Bell Icon with Interactive Notifications Popover */}
        <div className="relative">
          <button 
            type="button" 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative cursor-pointer focus:outline-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#5e2be2] rounded-full ring-2 ring-white animate-pulse" />
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
                      <span className="bg-[#5e2be2]/10 text-[#5e2be2] text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-[#5e2be2] hover:underline cursor-pointer"
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
                    className="text-xs font-semibold text-[#5e2be2] hover:underline cursor-pointer block"
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
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-sm h-10 px-5 shadow-md shadow-[#5e2be2]/25 transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <MessageSquare className="w-4 h-4" />
            <span>Messages</span>
          </button>
        </Link>

        {/* User Profile */}
        <Link href="/profile" className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="relative cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#5e2be2]/30"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
        </Link>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8f9fd] flex text-slate-800 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

