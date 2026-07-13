import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { User, ShieldCheck, Mail, Save, Upload, MapPin } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  bio: z.string().min(20),
  experience: z.coerce.number().min(0),
  consultationFee: z.coerce.number().min(0),
});

export default function Profile() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      experience: 0,
      consultationFee: 0,
    },
  });

  // Init form when data loads
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        experience: profile.experience,
        consultationFee: profile.consultationFee,
      });
    }
  }, [profile, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProfile.mutate({ data: values }, {
      onSuccess: () => {
        toast({ title: "Profile updated", description: "Your changes have been saved." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
      }
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your public presence and professional details.</p>
      </div>

      <Card className="shadow-sm border-border overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-indigo-600 relative"></div>
        <CardContent className="px-8 pb-8 relative pt-0">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-md bg-white">
                {profile?.photoUrl ? (
                  <AvatarImage src={profile.photoUrl} alt={profile.name} />
                ) : (
                  <AvatarFallback className="text-2xl font-bold text-primary bg-primary/10">SW</AvatarFallback>
                )}
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 w-8 h-8 rounded-full shadow-sm border border-border">
                <Upload className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{profile?.name}</h2>
                {profile?.verificationStatus === 'verified' && (
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 pl-1">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg">{profile?.title}</p>
            </div>
            
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" /> San Francisco, CA (Remote)
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" /> sarah.wilson@hexpertify.com
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="min-h-[150px] resize-y"
                      />
                    </FormControl>
                    <FormDescription>Displayed on your public profile. Markdown supported.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="number" {...field} className="pr-12" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">years</div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consultationFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Fee</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</div>
                          <Input type="number" {...field} className="pl-7" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <FormLabel>Specializations</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile?.specializations.map((spec, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 font-normal bg-secondary">{spec}</Badge>
                    ))}
                    <Badge variant="outline" className="px-3 py-1 border-dashed cursor-pointer hover:bg-secondary">+ Add</Badge>
                  </div>
                </div>

                <div>
                  <FormLabel>Languages</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile?.languages.map((lang, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 font-normal bg-secondary">{lang}</Badge>
                    ))}
                    <Badge variant="outline" className="px-3 py-1 border-dashed cursor-pointer hover:bg-secondary">+ Add</Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border">
                <Button type="submit" className="bg-primary text-white" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
