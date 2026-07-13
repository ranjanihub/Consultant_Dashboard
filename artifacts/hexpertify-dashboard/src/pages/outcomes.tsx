import { useGetCaseloadOutcomes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Target, CheckCircle2, Calendar, Star, Download, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Outcomes() {
  const { data: outcomes, isLoading } = useGetCaseloadOutcomes({ query: { period: 'month' } });

  // Mock radar data for "Average Assessment Improvement" since it's not array in schema but chart makes sense here
  const radarData = [
    { subject: 'PHQ-9', A: 75, fullMark: 100 },
    { subject: 'GAD-7', A: 82, fullMark: 100 },
    { subject: 'PANAS (Pos)', A: 60, fullMark: 100 },
    { subject: 'PANAS (Neg)', A: 70, fullMark: 100 },
    { subject: 'BDI', A: 65, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinical Outcomes</h1>
          <p className="text-muted-foreground mt-1">Measure effectiveness and track aggregate client progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="month">
            <SelectTrigger className="w-[150px] bg-white">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="quarter">Past Quarter</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <OutcomeStat 
          title="Average Improvement" 
          value={outcomes?.averageImprovementScore} 
          subtitle="+4.2% from last month" 
          icon={<TrendingUp className="w-5 h-5 text-primary" />} 
          loading={isLoading} 
          positive={true}
        />
        <OutcomeStat 
          title="Goal Achievement" 
          value={`${outcomes?.averageGoalAchievementRate}%`} 
          subtitle="Goals met or exceeded" 
          icon={<Target className="w-5 h-5 text-emerald-500" />} 
          loading={isLoading} 
          positive={true}
        />
        <OutcomeStat 
          title="Attendance Rate" 
          value={`${outcomes?.overallAttendanceRate}%`} 
          subtitle="Across all active clients" 
          icon={<CheckCircle2 className="w-5 h-5 text-blue-500" />} 
          loading={isLoading} 
          positive={true}
        />
        <OutcomeStat 
          title="Homework Adherence" 
          value={`${outcomes?.averageHomeworkAdherence}%`} 
          subtitle="Activities completed on time" 
          icon={<Star className="w-5 h-5 text-amber-500" />} 
          loading={isLoading} 
          positive={true}
        />
        <OutcomeStat 
          title="Engagement Score" 
          value={`${outcomes?.averageEngagementScore}/100`} 
          subtitle="Based on app activity" 
          icon={<Users className="w-5 h-5 text-indigo-500" />} 
          loading={isLoading} 
          positive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg">Assessment Improvement Distribution</CardTitle>
            <CardDescription>Average reduction in symptom severity by scale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Improvement %" dataKey="A" stroke="#532bce" strokeWidth={2} fill="#532bce" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg">Overall Caseload Trend</CardTitle>
              <CardDescription>Aggregate improvement score over 6 months</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Jan', score: 62 }, { name: 'Feb', score: 65 }, 
                  { name: 'Mar', score: 68 }, { name: 'Apr', score: 71 }, 
                  { name: 'May', score: 72 }, { name: 'Jun', score: 76 }
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOutcome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOutcome)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Client Breakdown</CardTitle>
              <CardDescription>Individual outcome metrics sorted by improvement</CardDescription>
            </div>
            <Tabs defaultValue="improvement" className="w-[300px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="improvement">Improvement</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="pl-6">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Improvement Score</TableHead>
                <TableHead>Engagement Score</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center"><Skeleton className="h-6 w-32 mx-auto" /></TableCell></TableRow>
              ) : (
                outcomes?.clientBreakdown?.map((client) => (
                  <TableRow key={client.clientId}>
                    <TableCell className="pl-6 font-medium">{client.clientName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-[10px] tracking-wider font-bold">
                        {client.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold w-8">{client.improvementScore}</span>
                        {client.improvementScore > 75 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-amber-500" />}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold w-8">{client.engagementScore}</span>
                        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${client.engagementScore}%` }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="text-primary">View Report</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function OutcomeStat({ title, value, subtitle, icon, loading, positive }: any) {
  return (
    <Card className="shadow-sm border-border overflow-hidden">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="p-3 bg-secondary/80 rounded-xl shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-0.5 truncate">{title}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mb-1" />
          ) : (
            <h4 className="text-2xl font-bold text-foreground leading-none mb-1">{value}</h4>
          )}
          <p className={cn("text-xs font-medium truncate", positive ? "text-green-600" : "text-amber-600")}>
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
