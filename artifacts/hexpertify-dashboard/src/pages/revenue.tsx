import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { IndianRupee, Download, ArrowUpRight, Clock, Video, FileText, ReceiptText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getAuthUser } from "@/lib/auth";

export default function Revenue() {
  const authUser = getAuthUser();
  const consultantName = authUser?.name || 'Sadaf Bhimani';
  const consultantId = authUser?.id || '';

  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>({
    totalRevenue: 0,
    pendingPayments: 0,
    completedConsultations: 0,
    therapyHours: 0,
    revenueChange: 0,
    period: "month"
  });
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadRevenue() {
      try {
        const res = await fetch(`/api/revenue?consultantName=${encodeURIComponent(consultantName)}&consultantId=${encodeURIComponent(consultantId)}&period=${period}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.success) {
            setSummary(data.summary || {});
            setAnalytics(Array.isArray(data.analytics) ? data.analytics : []);
            setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
          }
        }
      } catch (err) {
        console.error('Failed to load revenue data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRevenue();
    return () => { isMounted = false; };
  }, [consultantName, consultantId, period]);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Revenue & Earnings"
        description="Track consultation income, manage invoices, payout history, and financial growth analytics."
        badge="FINANCIAL OVERVIEW"
        icon={<IndianRupee className="w-4 h-4 text-purple-200" />}
      >
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-white text-slate-900 border-none shadow-md h-9 text-xs font-semibold">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#5e2be2] hover:bg-white/90 font-extrabold text-xs px-4 py-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="shadow-sm border-border bg-gradient-to-br from-primary/5 to-white border-primary/10">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><IndianRupee className="w-5 h-5" /></div>
              {summary && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> {summary.revenueChange || 0}%
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
              {loading ? <Skeleton className="h-8 w-32" /> : <h4 className="text-3xl font-bold">₹{(summary?.totalRevenue || 0).toLocaleString()}</h4>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><FileText className="w-5 h-5" /></div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Payments</p>
              {loading ? <Skeleton className="h-8 w-24" /> : <h4 className="text-3xl font-bold">₹{(summary?.pendingPayments || 0).toLocaleString()}</h4>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Video className="w-5 h-5" /></div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed Sessions</p>
              {loading ? <Skeleton className="h-8 w-16" /> : <h4 className="text-3xl font-bold">{summary?.completedConsultations || 0}</h4>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Clock className="w-5 h-5" /></div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Therapy Hours</p>
              {loading ? <Skeleton className="h-8 w-16" /> : <h4 className="text-3xl font-bold">{summary?.therapyHours || 0}h</h4>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Growth</CardTitle>
          <CardDescription>Earnings over time for {authUser?.name || 'Therapist'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : analytics.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                No revenue trends recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5e2be2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#5e2be2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`₹${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#5e2be2" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions &amp; Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-0">
          {loading ? (
            <div className="p-6">
              <Skeleton className="h-20 w-full rounded-2xl" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ReceiptText className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5]" />
              <h4 className="font-extrabold text-sm text-slate-800">No Transactions Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Consultation payments and client invoices for {authUser?.name || 'this consultant'} will appear here once bookings are confirmed.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View Card List */}
              <div className="space-y-3 md:hidden p-4">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-900">{tx.invoiceNumber}</span>
                      <Badge variant="outline" className={cn(
                        "uppercase text-[10px] tracking-wider font-bold",
                        tx.status === 'paid' ? "bg-green-50 text-green-700 border-green-200" :
                        tx.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="font-bold text-slate-800 block">{tx.clientName}</span>
                        <span className="text-[11px] text-slate-500">{formatDate(tx.date)}</span>
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 font-mono">₹{(tx.amount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-secondary/50">
                    <TableRow>
                      <TableHead className="pl-6">Invoice / ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx: any) => (
                      <TableRow key={tx.id}>
                        <TableCell className="pl-6 font-medium font-mono text-xs">{tx.invoiceNumber}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(tx.date)}</TableCell>
                        <TableCell className="font-bold text-slate-900">{tx.clientName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "uppercase text-[10px] tracking-wider font-bold",
                            tx.status === 'paid' ? "bg-green-50 text-green-700 border-green-200" :
                            tx.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-red-50 text-red-700 border-red-200"
                          )}>
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6 font-bold font-mono">₹{(tx.amount || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
