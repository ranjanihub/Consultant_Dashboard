import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useGetProfile, useUpdateProfile } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, Mail, Save, Camera, MapPin,
  Briefcase, Users, DollarSign, Star, Globe, Award,
} from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  name:            z.string().min(2),
  title:           z.string().min(2),
  bio:             z.string().min(20),
  experience:      z.coerce.number().min(0),
  consultationFee: z.coerce.number().min(0),
});

/* ── Stat pill ──────────────────────────────────────────────── */
function StatPill({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-lg font-bold leading-none">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/* ── Section heading ────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-sm font-bold uppercase tracking-widest text-primary">{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export default function Profile() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", title: "", bio: "", experience: 0, consultationFee: 0 },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name:            profile.name,
        title:           profile.title,
        bio:             profile.bio,
        experience:      profile.experience,
        consultationFee: profile.consultationFee,
      });
    }
  }, [profile, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProfile.mutate({ data: values }, {
      onSuccess: () => toast({ title: "Profile updated", description: "Your changes have been saved." }),
      onError:   () => toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" }),
    });
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl col-span-2" />
        </div>
      </div>
    );
  }

  const initials = (profile?.name ?? "SW").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">

      {/* ── Hero banner ────────────────────────────────────────── */}
      <Card className="overflow-hidden shadow-sm border-border">
        {/* gradient header */}
        <div className="h-40 bg-gradient-to-br from-primary via-violet-600 to-indigo-500 relative">
          {/* subtle pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <CardContent className="px-8 pb-0">
          {/* avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 mb-6">
            <div className="relative shrink-0">
              <Avatar className="w-28 h-28 border-4 border-white shadow-lg bg-white">
                {profile?.photoUrl
                  ? <AvatarImage src={profile.photoUrl} alt={profile.name} />
                  : <AvatarFallback className="text-3xl font-bold text-primary bg-primary/10">{initials}</AvatarFallback>}
              </Avatar>
              <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white shadow border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                <Camera className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 pb-4 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{profile?.name ?? "Dr. Sarah Wilson"}</h1>
                {profile?.verificationStatus === "verified" && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50 pl-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified
                  </Badge>
                )}
                <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                  Accepting Clients
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium">{profile?.title ?? "Clinical Psychologist"}</p>
              <div className="flex flex-wrap gap-4 pt-1">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" /> San Francisco, CA (Remote)
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" /> sarah.wilson@hexpertify.com
                </span>
              </div>
            </div>
          </div>

          {/* stat strip */}
          <div className="flex items-stretch border-t border-border divide-x divide-border -mx-8">
            <StatPill icon={Briefcase} value={`${profile?.experience ?? 12}y`}  label="Experience" />
            <StatPill icon={Users}     value="24"                                 label="Active Clients" />
            <StatPill icon={DollarSign} value={`$${profile?.consultationFee ?? 150}`} label="Per Session" />
            <StatPill icon={Star}      value="4.9"                                label="Rating" />
            <StatPill icon={Globe}     value={(Array.isArray(profile?.languages) ? profile.languages : ["English"]).length.toString()} label="Languages" />
          </div>
        </CardContent>
      </Card>

      {/* ── Main grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — identity cards */}
        <div className="space-y-5">

          {/* Specializations */}
          <Card className="shadow-sm border-border">
            <CardContent className="p-6">
              <SectionHeading>Specializations</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(profile?.specializations) ? profile.specializations : ["CBT", "EMDR", "Anxiety", "Depression", "Couples Therapy"]).map((spec, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold border border-primary/20">
                    <Award className="w-3 h-3" />{spec}
                  </span>
                ))}
                <button className="px-3 py-1.5 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  + Add
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="shadow-sm border-border">
            <CardContent className="p-6">
              <SectionHeading>Languages</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(profile?.languages) ? profile.languages : ["English", "Spanish"]).map((lang, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-foreground text-xs font-semibold border border-border">
                    <Globe className="w-3 h-3 text-muted-foreground" />{lang}
                  </span>
                ))}
                <button className="px-3 py-1.5 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  + Add
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="shadow-sm border-border">
            <CardContent className="p-6 space-y-3">
              <SectionHeading>Contact</SectionHeading>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground truncate">sarah.wilson@hexpertify.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground">San Francisco, CA</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — edit form */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border">
            <CardContent className="p-8">
              <SectionHeading>Edit Profile</SectionHeading>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Title</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[140px] resize-y" placeholder="Tell clients about your approach, background, and what to expect..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField control={form.control} name="experience" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="number" {...field} className="pr-14" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">years</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="consultationFee" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Fee (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                            <Input type="number" {...field} className="pl-7" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button type="submit" className="bg-primary text-white px-8" disabled={updateProfile.isPending}>
                      {updateProfile.isPending
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Saving…</>
                        : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
