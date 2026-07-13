import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, KeyRound, MonitorSmartphone, CreditCard, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your security, notifications, and billing.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Tabs defaultValue="security" className="w-full flex flex-col md:flex-row gap-6">
          <TabsList className="flex flex-col w-full md:w-64 h-auto bg-transparent space-y-1 items-start justify-start p-0 shrink-0 border-r-0 md:border-r border-border rounded-none md:pr-4">
            <TabsTrigger value="security" className="w-full justify-start px-4 py-2.5 rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground font-medium">
              <Lock className="w-4 h-4 mr-3 text-muted-foreground" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full justify-start px-4 py-2.5 rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground font-medium">
              <Bell className="w-4 h-4 mr-3 text-muted-foreground" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="w-full justify-start px-4 py-2.5 rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground font-medium">
              <CreditCard className="w-4 h-4 mr-3 text-muted-foreground" /> Billing
            </TabsTrigger>
            <TabsTrigger value="devices" className="w-full justify-start px-4 py-2.5 rounded-lg data-[state=active]:bg-secondary data-[state=active]:text-foreground font-medium">
              <MonitorSmartphone className="w-4 h-4 mr-3 text-muted-foreground" /> Devices
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
            <TabsContent value="security" className="m-0 space-y-6 outline-none">
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary" /> Password
                  </CardTitle>
                  <CardDescription>Update your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 max-w-sm">
                    <Label htmlFor="current-pwd">Current Password</Label>
                    <Input id="current-pwd" type="password" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <Label htmlFor="new-pwd">New Password</Label>
                    <Input id="new-pwd" type="password" />
                  </div>
                  <div className="space-y-2 max-w-sm pb-4">
                    <Label htmlFor="confirm-pwd">Confirm New Password</Label>
                    <Input id="confirm-pwd" type="password" />
                  </div>
                  <Button className="bg-primary text-white">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div className="space-y-0.5">
                      <div className="font-medium">Authenticator App</div>
                      <div className="text-sm text-muted-foreground">Use an app like Google Authenticator to generate codes.</div>
                    </div>
                    <Button variant="outline" className="shrink-0">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0 space-y-6 outline-none">
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Email Notifications</CardTitle>
                  <CardDescription>Choose what updates you want to receive via email.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">New Session Booked</div>
                      <div className="text-sm text-muted-foreground">Receive an email when a client books a session.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">Session Cancellations</div>
                      <div className="text-sm text-muted-foreground">Receive an email when a session is canceled.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">New Reviews</div>
                      <div className="text-sm text-muted-foreground">Get notified when a client leaves a review.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">Pending Reports</div>
                      <div className="text-sm text-muted-foreground">Daily reminder for incomplete session reports.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="m-0 outline-none">
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Payout Settings</CardTitle>
                  <CardDescription>Manage how you receive payments for your services.</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Billing integration is managed via Stripe Connect.</p>
                  <Button variant="outline">Manage on Stripe</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices" className="m-0 outline-none">
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Active Sessions</CardTitle>
                  <CardDescription>Devices currently logged into your account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3">
                        <MonitorSmartphone className="w-5 h-5 text-primary" />
                        <div>
                          <div className="text-sm font-medium">Mac OS · Chrome</div>
                          <div className="text-xs text-muted-foreground">San Francisco, CA · Current session</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
