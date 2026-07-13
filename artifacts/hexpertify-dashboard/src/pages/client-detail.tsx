import { useParams, Link } from "wouter";
import { 
  useGetClient, 
  useGetClientAssessments, 
  useGetClientMood, 
  useGetClientHomework, 
  useGetClientSessionHistory 
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Calendar, Video, FileText, CheckCircle2, TrendingUp, TrendingDown, Activity, AlertCircle, FilePlus, Plus } from "lucide-react";
import { formatDate } from "@/lib/format";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";

export default function ClientDetail() {
  const { id } = useParams();
  const clientId = Number(id);

  const { data: client, isLoading: clientLoading } = useGetClient(clientId, { query: { enabled: !!clientId, queryKey: ['client', clientId] } });
  const { data: assessments, isLoading: assessmentsLoading } = useGetClientAssessments(clientId, { query: { enabled: !!clientId, queryKey: ['assessments', clientId] } });
  const { data: mood, isLoading: moodLoading } = useGetClientMood(clientId, { query: { enabled: !!clientId, queryKey: ['mood', clientId] } });
  const { data: homework, isLoading: homeworkLoading } = useGetClientHomework(clientId, { query: { enabled: !!clientId, queryKey: ['homework', clientId] } });
  const { data: history, isLoading: historyLoading } = useGetClientSessionHistory(clientId, { query: { enabled: !!clientId, queryKey: ['history', clientId] } });

  if (clientLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-[600px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/clients" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Clients
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-5">
          <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-sm">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">{client.initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{client.name}</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 uppercase text-[10px] tracking-wider font-bold">
                {client.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {client.age} yrs, {client.gender}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Started {formatDate(client.startDate)}</span>
              <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {client.sessionCount} sessions</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">Message</Button>
          <Button className="flex-1 md:flex-none bg-primary hover:bg-primary/90">
            <Video className="w-4 h-4 mr-2" />
            Join Next Session
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border border-border w-full justify-start p-1 h-14 rounded-xl overflow-x-auto flex-nowrap shrink-0 hide-scrollbar">
          <TabsTrigger value="overview" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">Overview</TabsTrigger>
          <TabsTrigger value="assessments" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">Assessments</TabsTrigger>
          <TabsTrigger value="mood" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">Mood Tracking</TabsTrigger>
          <TabsTrigger value="homework" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">Activities & Homework</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg h-11 px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-medium text-muted-foreground">Session History</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Therapy Goals</h4>
                      <div className="space-y-3">
                        {client.therapyGoals.map((goal, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm font-medium">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Presenting Problems</h4>
                        <div className="flex flex-wrap gap-2">
                          {client.presentingProblems.map((prob, i) => (
                            <Badge key={i} variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-normal">{prob}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Preferences</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="text-muted-foreground">Language:</span> {client.preferredLanguage}</p>
                          <p><span className="text-muted-foreground">Comm:</span> {client.communicationPreference}</p>
                          <p><span className="text-muted-foreground">Timeline:</span> {client.therapyTimeline}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-border bg-gradient-to-br from-indigo-50 to-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <SparklesIcon className="w-5 h-5 text-indigo-500" />
                      AI Intake Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {client.aiIntakeSummary}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="shadow-sm border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessmentsLoading ? (
                      <Skeleton className="h-40 w-full" />
                    ) : (
                      <div className="space-y-4">
                        {assessments?.slice(0, 3).map((assessment) => (
                          <div key={assessment.id} className="flex flex-col gap-2 p-3 rounded-lg border border-border">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm">{assessment.type}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{assessment.currentScore}</span>
                                <span className="text-xs text-muted-foreground">/ {assessment.maxScore}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className={cn("font-medium", 
                                assessment.severity === 'Severe' ? 'text-red-600' : 
                                assessment.severity === 'Moderate' ? 'text-amber-600' : 'text-green-600'
                              )}>
                                {assessment.severity}
                              </span>
                              <span className="text-muted-foreground">{formatDate(assessment.completedAt)}</span>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full text-sm h-9" onClick={() => document.querySelector<HTMLButtonElement>('[value="assessments"]')?.click()}>
                          View all trends
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-border bg-primary/5 border-primary/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-primary">Next Session</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {client.nextSession ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{formatDate(client.nextSession)}</p>
                            <p className="text-sm text-muted-foreground">Follow-up · Video</p>
                          </div>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">Prepare Session Note</Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-4">No upcoming sessions scheduled.</p>
                        <Button variant="outline" className="w-full border-primary/20 text-primary">Schedule Session</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments?.map((assessment) => (
                <Card key={assessment.id} className="shadow-sm border-border">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle>{assessment.type}</CardTitle>
                      <CardDescription>{assessment.name}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{assessment.currentScore}<span className="text-sm font-normal text-muted-foreground">/{assessment.maxScore}</span></div>
                      <div className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1",
                        assessment.severity === 'Severe' ? 'bg-red-100 text-red-700' : 
                        assessment.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      )}>
                        {assessment.severity}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={assessment.trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short' })} />
                          <YAxis domain={[0, assessment.maxScore]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelFormatter={(label) => formatDate(label as string)}
                          />
                          <Line type="monotone" dataKey="score" stroke="#532bce" strokeWidth={3} dot={{ r: 4, fill: "#532bce", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mood" className="space-y-6 outline-none">
            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle>Mood Tracking Trend</CardTitle>
                <CardDescription>Daily client self-reported mood (1-10)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mood?.weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })} />
                      <YAxis domain={[1, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelFormatter={(label) => formatDate(label as string)}
                      />
                      <Area type="monotone" dataKey="mood" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" activeDot={{ r: 6, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mood?.weeklyTrend.filter(t => t.note).map((entry, i) => (
                <Card key={i} className="shadow-sm border-border bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{formatDate(entry.date)}</span>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">Mood: {entry.mood}/10</Badge>
                    </div>
                    <p className="text-sm text-slate-700 italic">"{entry.note}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="homework" className="space-y-6 outline-none">
            <div className="flex justify-end mb-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Assign Activity
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {homework?.map((item) => (
                <Card key={item.id} className="shadow-sm border-border overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg">{item.activity}</h3>
                          <Badge variant="outline" className={cn(
                            "uppercase text-[10px] tracking-wider font-bold",
                            item.status === 'completed' ? "bg-green-50 text-green-700 border-green-200" :
                            item.status === 'pending' ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          )}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-4 h-4" /> Due: {formatDate(item.dueDate)}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{item.instructions}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-700">Completion ({item.frequency})</span>
                          <span className="font-bold">{item.completionPercent}%</span>
                        </div>
                        <Progress value={item.completionPercent} className="h-2" indicatorClassName={item.completionPercent === 100 ? "bg-green-500" : "bg-primary"} />
                      </div>
                    </div>
                    {item.clientReflection && (
                      <div className="bg-secondary/50 p-6 md:w-1/3 border-t md:border-t-0 md:border-l border-border flex flex-col justify-center">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                          <MessageSquareIcon className="w-4 h-4" /> Client Reflection
                        </h4>
                        <p className="text-sm italic text-slate-700">"{item.clientReflection}"</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 outline-none">
            <div className="relative border-l-2 border-border ml-4 pl-8 space-y-8 py-4">
              {history?.map((session, i) => (
                <div key={session.id} className="relative">
                  <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white bg-primary shadow-sm" />
                  
                  <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 bg-secondary/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            Session {history.length - i}
                            <Badge variant="outline" className="font-normal text-muted-foreground bg-white">{session.sessionType}</Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3.5 h-3.5" /> {formatDate(session.date)}
                            <span className="mx-1">•</span>
                            <Clock className="w-3.5 h-3.5" /> {session.durationMinutes} min
                          </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white">View Full Report</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Clinical Summary</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">{session.summary}</p>
                      </div>
                      
                      {session.therapistNotes && (
                        <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
                          <h4 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> Private Notes
                          </h4>
                          <p className="text-sm text-amber-900/80">{session.therapistNotes}</p>
                        </div>
                      )}
                      
                      {session.homeworkAssigned && (
                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                          <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <BookOpenIcon className="w-3.5 h-3.5" /> Assigned Activity
                          </h4>
                          <p className="text-sm text-primary/80">{session.homeworkAssigned}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Icon helpers for specific components
function SparklesIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  )
}

function MessageSquareIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function BookOpenIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}
