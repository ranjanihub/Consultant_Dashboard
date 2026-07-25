import { useState } from "react";
import { useLocation } from "wouter";
import { setAuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Activity, 
  FileText,
  KeyRound
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState("dr.harrison@hexpertify.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState<"therapist" | "admin">("therapist");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both your clinical email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setAuthUser({
        id: "doc-1",
        name: "Dr. Alex Harrison, PsyD",
        title: "Licensed Clinical Psychologist",
        email: email,
        role: role,
        avatarInitials: "AH",
        photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      });

      setIsLoading(false);
      toast({
        title: "Authentication Successful",
        description: "Welcome back, Dr. Alex Harrison! Redirecting to Clinical Suite...",
      });

      setLocation("/");
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail("dr.harrison@hexpertify.com");
    setPassword("password123");
    setIsLoading(true);

    setTimeout(() => {
      setAuthUser({
        id: "doc-1",
        name: "Dr. Alex Harrison, PsyD",
        title: "Licensed Clinical Psychologist",
        email: "dr.harrison@hexpertify.com",
        role: "therapist",
        avatarInitials: "AH",
        photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      });

      setIsLoading(false);
      toast({
        title: "Demo Mode Activated",
        description: "Signed in as Dr. Alex Harrison, PsyD.",
      });

      setLocation("/");
    }, 400);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotEmail("");
      toast({
        title: "Password Reset Link Sent",
        description: `Instructions have been sent to ${forgotEmail}. Please check your inbox.`,
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 grid grid-cols-1 lg:grid-cols-12 overflow-hidden font-sans">
      {/* Left Column - Hero Branding & Features (Hidden on mobile) */}
      <div className="hidden lg:flex lg:col-span-7 relative bg-gradient-to-br from-[#2a137e] via-[#4522c0] to-[#160c49] p-12 flex-col justify-between overflow-hidden">
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-xl">
            <img
              src="/hexpertify-logo.png"
              alt="Hexpertify — Anytime, Anywhere"
              className="h-10 w-auto object-contain mix-blend-multiply"
            />
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-3 py-1 text-xs backdrop-blur-md font-medium">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> HIPAA & ISO 27001 Certified
          </Badge>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 my-auto py-12 space-y-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Clinical Management Reimagined
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            Empowering Mental Health Professionals <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-200 to-amber-200">Anytime, Anywhere.</span>
          </h1>

          <p className="text-purple-100/80 text-lg leading-relaxed font-normal">
            Streamline client sessions, automated GAD-7/CBT outcome analytics, payment-gated clinical reports, and HIPAA-compliant video consultations in one unified workspace.
          </p>

          {/* Feature Bullets */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Outcome Analytics</h4>
                <p className="text-purple-200/60 text-xs mt-0.5">Real-time GAD-7 & PHQ-9 trends</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-blue-500/20 text-blue-300 rounded-lg shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Smart Teletherapy</h4>
                <p className="text-purple-200/60 text-xs mt-0.5">HD encrypted video & notes</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Payment Gated Notes</h4>
                <p className="text-purple-200/60 text-xs mt-0.5">Automated invoice release</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-purple-500/20 text-purple-300 rounded-lg shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Client Portal</h4>
                <p className="text-purple-200/60 text-xs mt-0.5">Interactive homework & mood logs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 border-t border-white/10 pt-6 flex items-center justify-between text-xs text-purple-200/70">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80"
              alt="Practitioner"
              className="w-9 h-9 rounded-full border border-white/30 object-cover"
            />
            <div>
              <p className="text-white font-semibold text-xs">Dr. Alex Harrison, PsyD</p>
              <p className="text-purple-200/60 text-[11px]">Beck Institute Certified CBT Practitioner</p>
            </div>
          </div>
          <span className="text-[11px] bg-white/10 px-2.5 py-1 rounded-md text-white font-mono">v2.4.0 Clinical Suite</span>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="lg:col-span-5 bg-white flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
        {/* Top Mobile Brand */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <img
            src="/hexpertify-logo.png"
            alt="Hexpertify Logo"
            className="h-10 w-auto object-contain mix-blend-multiply"
          />
          <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
            HIPAA Secure
          </Badge>
        </div>

        <div className="max-w-md w-full mx-auto my-auto space-y-8 py-4">
          {/* Header text */}
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign In to Workspace</h2>
            <p className="text-slate-500 text-sm">
              Access your clinical dashboard, client records, and therapy schedules.
            </p>
          </div>

          {/* Role selector tab */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setRole("therapist")}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                role === "therapist" ? "bg-white text-primary shadow-sm font-bold" : "hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> Practitioner / Therapist
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                role === "admin" ? "bg-white text-primary shadow-sm font-bold" : "hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Clinic Admin
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Clinical Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@hexpertify.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-3.5 bg-slate-50 border-slate-200 focus:bg-white text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="text-xs font-semibold text-primary hover:underline">
                      Forgot password?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-primary" /> Reset Password
                      </DialogTitle>
                      <DialogDescription>
                        Enter your registered clinical email address and we'll send you password recovery instructions.
                      </DialogDescription>
                    </DialogHeader>
                    {resetSent ? (
                      <div className="py-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Check Your Email</h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          We have sent a reset link to <span className="font-semibold text-slate-700">{forgotEmail}</span>.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="forgot-email" className="text-xs font-semibold">Email Address</Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="dr.harrison@hexpertify.com"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full font-bold">
                          Send Recovery Instructions
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-3.5 pr-10 bg-slate-50 border-slate-200 focus:bg-white text-slate-900 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(c) => setRememberMe(!!c)}
                />
                <label
                  htmlFor="remember"
                  className="text-xs font-medium text-slate-600 cursor-pointer select-none"
                >
                  Keep me signed in for 30 days
                </label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-[#4320b5] text-white font-bold rounded-xl shadow-lg shadow-primary/20 text-base transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Clinical Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                Or Quick Access
              </span>
            </div>
          </div>

          {/* 1-Click Demo Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full h-11 border-2 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-900 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Fast 1-Click Demo Sign In (Dr. Alex Harrison)</span>
          </Button>
        </div>

        {/* Bottom Footer */}
        <div className="text-center text-xs text-slate-400 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted Access</span>
          </div>
          <div>© {new Date().getFullYear()} Hexpertify Health. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}
