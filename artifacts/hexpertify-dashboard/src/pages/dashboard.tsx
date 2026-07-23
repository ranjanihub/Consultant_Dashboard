import { useState } from "react";
import { useGetDashboardStats, useGetUpcomingSessions, useGetPendingReports, useGetWeeklySchedule, useGetClientImprovementSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video, Clock, TrendingUp, Users, FileText, BookOpen, AlertCircle, ArrowRight, TrendingDown, Minus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SessionReportDialog } from "@/components/session-report-dialog";

export default function Dashboard() {
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useGetDashboardStats();
  const { data: sessionsData, isLoading: sessionsLoading } = useGetUpcomingSessions();
  const { data: reportsData, isLoading: reportsLoading, refetch: refetchReports } = useGetPendingReports();

  const [reportSessionId, setReportSessionId] = useState<number | null>(null);
  const [reportClientName, setReportClientName] = useState<string>("");

  const stats = statsData || {
    sessionsToday: 6,
    sessionsRemaining: 2,
    activeClients: 18,
    newClientsThisWeek: 3,
    pendingReports: 2,
    homeworkToReview: 5,
    homeworkDueToday: 5,
    therapyHoursThisWeek: 28,
    improvementAverage: 74.2,
    totalClientsCount: 24,
    therapistName: "Dr. Alex Harrison",
    therapistTitle: "Licensed Clinical Psychologist",
    isAvailable: true,
    therapyHoursToday: "5h 45m",
  };

  const sessionList = (Array.isArray(sessionsData) && sessionsData.length > 0) ? sessionsData : [
    {
      id: 1,
      clientName: "Sarah Jenkins",
      clientInitials: "SJ",
      sessionType: "CBT",
      sessionSubtype: "Cognitive Restructuring",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      durationMinutes: 60,
      countdownLabel: "in 12 min",
      sessionNumber: 12,
      isNext: true,
    },
    {
      id: 2,
      clientName: "Michael Chen",
      clientInitials: "MC",
      sessionType: "ACT",
      sessionSubtype: "Values Clarification",
      startTime: "10:30 AM",
      endTime: "11:30 AM",
      durationMinutes: 60,
      countdownLabel: "in 1h 42m",
      sessionNumber: 8,
      isNext: false,
    },
    {
      id: 3,
      clientName: "David Kim",
      clientInitials: "DK",
      sessionType: "CBT",
      sessionSubtype: "Exposure Hierarchy",
      startTime: "02:00 PM",
      endTime: "03:00 PM",
      durationMinutes: 60,
      countdownLabel: "in 4h 15m",
      sessionNumber: 2,
      isNext: false,
    }
  ];

  const reportList = (Array.isArray(reportsData) && reportsData.length > 0) ? reportsData : [
    {
      sessionId: 101,
      clientName: "Emily Rodriguez",
      clientInitials: "ER",
      sessionDate: "2026-07-22",
      sessionTime: "02:00 PM",
      sessionType: "DBT Skills",
      sessionNumber: 15,
    },
    {
      sessionId: 102,
      clientName: "Michael Chen",
      clientInitials: "MC",
      sessionDate: "2026-07-21",
      sessionTime: "10:30 AM",
      sessionType: "ACT Protocol",
      sessionNumber: 7,
    }
  ];

  const nextSession = sessionList.find((s) => s.isNext) || sessionList[0];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-[#4323a6] p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2"></div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm border border-white/10">
              Tuesday, July 7 · Week 27
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {statsLoading ? <Skeleton className="h-10 w-64 bg-white/20" /> : `Welcome back, ${stats?.therapistName || 'Dr. Sarah Wilson'}`}
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-xl">
                {statsLoading ? <Skeleton className="h-6 w-96 bg-white/20" /> : `${stats?.therapistTitle || 'Clinical Psychologist'} · You have ${stats?.sessionsToday || 0} sessions today and ${stats?.pendingReports || 0} reports awaiting review.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-medium backdrop-blur-md">
                <Calendar className="w-4 h-4 text-primary-foreground/80" />
                <span>Therapy hours: {stats?.therapyHoursToday || '5h 45m'}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm font-medium backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                <span>{stats?.isAvailable ? 'Available now' : 'Not available'}</span>
              </div>
            </div>
          </div>

          {/* Next Session Card */}
          {nextSession && (
            <div className="w-full lg:w-[380px] shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold tracking-wider text-primary-foreground/70 uppercase">NEXT SESSION</h3>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 hover:bg-green-500/20 border-green-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  {nextSession.countdownLabel}
                </Badge>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <Avatar className="h-12 w-12 border-2 border-white/20">
                  <AvatarFallback className="bg-white/10 text-white">{nextSession.clientInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-lg leading-none mb-1">{nextSession.clientName}</h4>
                  <p className="text-sm text-primary-foreground/80">{nextSession.sessionType}{nextSession.sessionSubtype ? ` · ${nextSession.sessionSubtype}` : ''} · {nextSession.durationMinutes} min</p>
                </div>
              </div>

              <div className="bg-black/20 rounded-lg p-3 mb-5 flex items-center justify-between text-sm">
                <div className="font-medium">{nextSession.startTime} — {nextSession.endTime}</div>
                <div className="text-primary-foreground/70">Session #{nextSession.sessionNumber}</div>
              </div>

              <Button className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-bold h-11">
                <Video className="w-4 h-4 mr-2" />
                Join session
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Sessions today"
          value={stats?.sessionsToday}
          description={`${stats?.sessionsRemaining} remaining`}
          icon={<Video className="w-5 h-5 text-blue-500" />}
          trend="+2"
          trendPositive={true}
          loading={statsLoading}
        />
        <StatCard
          title="Active clients"
          value={stats?.activeClients}
          description={`${stats?.newClientsThisWeek} new this week`}
          icon={<Users className="w-5 h-5 text-indigo-500" />}
          trend="+3"
          trendPositive={true}
          loading={statsLoading}
        />
        <StatCard
          title="Pending reports"
          value={stats?.pendingReports}
          description="Payment gated"
          icon={<FileText className="w-5 h-5 text-orange-500" />}
          trend="-1"
          trendPositive={true}
          loading={statsLoading}
        />
        <StatCard
          title="Therapy hours"
          value={`${stats?.therapyHoursThisWeek}h`}
          description="This week"
          icon={<Clock className="w-5 h-5 text-emerald-500" />}
          trend="+6h"
          trendPositive={true}
          loading={statsLoading}
        />
      </div>

      {/* Schedule & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl">Today's schedule</CardTitle>
              <CardDescription>
                {stats?.sessionsToday || 0} sessions
              </CardDescription>
            </div>
            <Tabs defaultValue="today" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {sessionList.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-border/80 hover:bg-secondary/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className={cn("text-primary font-medium", session.isNext ? "bg-primary/20" : "bg-muted")}>
                          {session.clientInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-[15px]">{session.clientName} <span className="text-muted-foreground font-normal ml-1">· {session.sessionType} · {session.sessionSubtype}</span></div>
                        <div className="flex items-center gap-3 text-sm mt-1">
                          <span className="flex items-center text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            {session.startTime} · {session.durationMinutes} min
                          </span>
                          {session.isNext && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 rounded-md py-0 font-medium">
                              {session.countdownLabel}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" className="text-muted-foreground">View</Button>
                      <Button variant="outline" className="border-border">Reschedule</Button>
                      <Button className="bg-primary text-primary-foreground">
                        <Video className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
                {!sessionList.length && (
                  <div className="text-center py-8 text-muted-foreground">No sessions scheduled for today.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-1">
              <CardTitle className="text-xl">Pending reports</CardTitle>
              <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">High priority</Badge>
            </div>
            <CardDescription>{stats?.pendingReports || 0} reports awaiting your review</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col h-[calc(100%-80px)]">
            {reportsLoading ? (
              <div className="space-y-4 flex-1">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                {reportList.map((report) => (
                  <div key={report.sessionId} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-transparent hover:border-border transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white text-muted-foreground text-xs">{report.clientInitials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{report.clientName}</span>
                        <span className="text-xs text-muted-foreground">{report.sessionType} · {report.sessionDate}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary hover:bg-primary/10 h-8 px-3 rounded-lg"
                      onClick={() => {
                        setReportSessionId(report.sessionId);
                        setReportClientName(report.clientName);
                      }}
                    >
                      Complete <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                ))}
                {!reportList.length && (
                  <div className="text-center py-8 text-muted-foreground text-sm">All caught up!</div>
                )}
              </div>
            )}

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <p className="text-xs font-medium leading-relaxed">Payment becomes eligible only after report submission.</p>
            </div>
          </CardContent>
        </Card>
      </div>


      <SessionReportDialog
        open={reportSessionId !== null}
        onOpenChange={(open) => !open && setReportSessionId(null)}
        sessionId={reportSessionId}
        clientName={reportClientName}
        onSuccess={() => {
          refetchReports();
          refetchStats();
        }}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendPositive,
  loading
}: {
  title: string;
  value: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  trend: string;
  trendPositive: boolean;
  loading?: boolean;
}) {
  return (
    <Card className="shadow-sm border-border overflow-hidden group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-secondary rounded-lg text-primary">{icon}</div>
          <Badge variant="secondary" className={cn(
            "font-medium",
            trendPositive ? "bg-green-50 text-green-700" : (trend === "0" ? "bg-muted text-muted-foreground" : "bg-red-50 text-red-700")
          )}>
            {trend}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mb-1" />
          ) : (
            <h4 className="text-2xl font-bold text-foreground">{value}</h4>
          )}
          <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
