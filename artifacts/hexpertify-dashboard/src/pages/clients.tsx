import { useState } from "react";
import { useGetClients } from "@workspace/api-client-react";
import AddClientDialog from "@/components/AddClientDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Filter, MoreHorizontal, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addClientOpen, setAddClientOpen] = useState(false);

  const { data: clients, isLoading } = useGetClients({
    query: {
      search: search || undefined,
      status: statusFilter !== "all" ? (statusFilter as any) : undefined
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>;
      case 'completed': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200">Completed</Badge>;
      case 'high_priority': return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">High Priority</Badge>;
      case 'new': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">New</Badge>;
      case 'inactive': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200">Inactive</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your caseload, progress, and upcoming sessions.</p>
        </div>
        <Button className="shrink-0 bg-primary text-white" onClick={() => setAddClientOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <AddClientDialog open={addClientOpen} onOpenChange={setAddClientOpen} />

      <Card className="shadow-sm border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search clients by name..." 
                  className="pl-9 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="high_priority">High Priority</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {clients?.length || 0} clients
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] pl-6">Client Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Primary Goal</TableHead>
                <TableHead>Next Session</TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-10 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : clients?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No clients found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                clients?.map((client) => (
                  <TableRow key={client.id} className="group cursor-pointer hover:bg-secondary/30 transition-colors">
                    <TableCell className="pl-6">
                      <Link href={`/clients/${client.id}`} className="flex items-center gap-3 w-full block">
                        <Avatar className="h-10 w-10 border border-border group-hover:border-primary/20 transition-colors">
                          <AvatarFallback className="bg-primary/5 text-primary font-medium">{client.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-[15px] group-hover:text-primary transition-colors">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.age} yrs • {client.gender}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(client.status)}
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={client.primaryGoal}>
                      {client.primaryGoal}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                        {client.nextSession ? formatDate(client.nextSession) : <span className="text-muted-foreground italic">Unscheduled</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/clients/${client.id}`}>View Workspace</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Schedule Session</DropdownMenuItem>
                          <DropdownMenuItem>Assign Homework</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10">Archive Client</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
