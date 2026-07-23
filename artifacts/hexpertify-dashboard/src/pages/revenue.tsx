import { useState } from "react";
import { useGetRevenueSummary, useGetRevenueAnalytics, useGetTransactions } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Download, ArrowUpRight, ArrowDownRight, Clock, Video, FileText } from "lucide-react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Revenue() {
  const [period, setPeriod] = useState("month");
  
  const { data: summary, isLoading: summaryLoading } = useGetRevenueSummary({ period: period as any });
  const { data: analytics, isLoading: analyticsLoading } = useGetRevenueAnalytics({ period: period as any });
  const { data: transactionsData, isLoading: transactionsLoading } = useGetTransactions();
  const transactions = Array.isArray(transactionsData) ? transactionsData : [];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
          <p className="text-muted-foreground mt-1">Track earnings, pending invoices, and financial growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-border bg-gradient-to-br from-primary/5 to-white border-primary/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><DollarSign className="w-5 h-5" /></div>
              {summary && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> {summary.revenueChange}%
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
              {summaryLoading ? <Skeleton className="h-8 w-32" /> : <h4 className="text-3xl font-bold">${summary?.totalRevenue?.toLocaleString()}</h4>}
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
              {summaryLoading ? <Skeleton className="h-8 w-24" /> : <h4 className="text-3xl font-bold">${summary?.pendingPayments?.toLocaleString()}</h4>}
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
              {summaryLoading ? <Skeleton className="h-8 w-16" /> : <h4 className="text-3xl font-bold">{summary?.completedConsultations}</h4>}
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
              {summaryLoading ? <Skeleton className="h-8 w-16" /> : <h4 className="text-3xl font-bold">{summary?.therapyHours}h</h4>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Growth</CardTitle>
          <CardDescription>Earnings over time compared to previous period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            {analyticsLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={Array.isArray(analytics) ? analytics : []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#532bce" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#532bce" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#532bce" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
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
              {transactionsLoading ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center"><Skeleton className="h-6 w-32 mx-auto" /></TableCell></TableRow>
              ) : (
                (Array.isArray(transactions) ? transactions : []).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="pl-6 font-medium font-mono text-xs">{tx.invoiceNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tx.date)}</TableCell>
                    <TableCell>{tx.clientName}</TableCell>
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
                    <TableCell className="text-right pr-6 font-bold">${(tx.amount || 0).toFixed(2)}</TableCell>
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
