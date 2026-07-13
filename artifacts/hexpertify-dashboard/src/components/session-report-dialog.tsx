import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitSessionReport } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Check, ChevronLeft, ChevronRight, Save } from "lucide-react";

const formSchema = z.object({
  durationMinutes: z.coerce.number().min(1),
  clientCooperation: z.enum(["excellent", "good", "fair", "poor"]),
  clientEngagementLevel: z.enum(["high", "medium", "low"]),
  moodComparedToPrevious: z.enum(["much_better", "better", "same", "worse", "much_worse"]),
  progressTowardsGoals: z.enum(["significant", "moderate", "minimal", "none"]),
  techniquesUsed: z.string(),
  topicsDiscussed: z.string(),
  riskFlags: z.string().optional(),
  clinicalSummary: z.string().min(10),
  internalNotes: z.string().optional(),
  homeworkActivity: z.string().optional(),
  homeworkInstructions: z.string().optional(),
  homeworkFrequency: z.string().optional(),
  nextSessionRecommendation: z.enum(["3_days", "1_week", "2_weeks", "1_month", "custom"]),
  followUpMessage: z.string().optional(),
});

type SessionReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: number | null;
  clientName?: string;
  onSuccess?: () => void;
};

export function SessionReportDialog({ open, onOpenChange, sessionId, clientName, onSuccess }: SessionReportDialogProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const { toast } = useToast();
  const submitReport = useSubmitSessionReport();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      durationMinutes: 50,
      clientCooperation: "good",
      clientEngagementLevel: "medium",
      moodComparedToPrevious: "same",
      progressTowardsGoals: "moderate",
      techniquesUsed: "",
      topicsDiscussed: "",
      riskFlags: "",
      clinicalSummary: "",
      internalNotes: "",
      homeworkActivity: "",
      homeworkInstructions: "",
      homeworkFrequency: "",
      nextSessionRecommendation: "1_week",
      followUpMessage: "",
    },
  });

  const STEPS = [
    { title: "Session Details", desc: "Basic information about the session." },
    { title: "Client Status", desc: "Observations on cooperation and engagement." },
    { title: "Intervention", desc: "Techniques and topics discussed." },
    { title: "Clinical Summary", desc: "Core clinical notes and risk assessment." },
    { title: "Homework", desc: "Assigned activities between sessions." },
    { title: "Follow-up", desc: "Next steps and recommendations." }
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!sessionId) return;
    
    const payload = {
      ...values,
      techniquesUsed: values.techniquesUsed.split(',').map(t => t.trim()).filter(Boolean),
      topicsDiscussed: values.topicsDiscussed.split(',').map(t => t.trim()).filter(Boolean),
      riskFlags: values.riskFlags || null,
      internalNotes: values.internalNotes || null,
      homeworkActivity: values.homeworkActivity || null,
      homeworkInstructions: values.homeworkInstructions || null,
      homeworkFrequency: values.homeworkFrequency || null,
      followUpMessage: values.followUpMessage || null,
    };

    submitReport.mutate({ sessionId, data: payload }, {
      onSuccess: () => {
        toast({ title: "Report Submitted", description: "The session report has been successfully recorded." });
        onOpenChange(false);
        setStep(1);
        form.reset();
        if (onSuccess) onSuccess();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to submit report.", variant: "destructive" });
      }
    });
  }

  const nextStep = async () => {
    // Validate current step fields
    let isValid = false;
    switch (step) {
      case 1: isValid = await form.trigger(["durationMinutes"]); break;
      case 2: isValid = await form.trigger(["clientCooperation", "clientEngagementLevel", "moodComparedToPrevious", "progressTowardsGoals"]); break;
      case 3: isValid = await form.trigger(["techniquesUsed", "topicsDiscussed"]); break;
      case 4: isValid = await form.trigger(["clinicalSummary", "riskFlags", "internalNotes"]); break;
      case 5: isValid = await form.trigger(["homeworkActivity", "homeworkInstructions", "homeworkFrequency"]); break;
      case 6: isValid = await form.trigger(["nextSessionRecommendation", "followUpMessage"]); break;
      default: isValid = true;
    }
    
    if (isValid && step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-white">
        <div className="bg-secondary/30 px-6 py-4 border-b border-border flex flex-col gap-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl">Session Report: {clientName}</DialogTitle>
            <DialogDescription>
              Step {step} of {totalSteps}: {STEPS[step - 1].title}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-1.5 w-full">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-primary/10'}`} 
              />
            ))}
          </div>
        </div>

        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* STEP 1 */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="durationMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* STEP 2 */}
              <div className={step === 2 ? 'block' : 'hidden'}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="clientCooperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Cooperation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEngagementLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engagement Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="moodComparedToPrevious"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mood compared to prev.</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="much_better">Much Better</SelectItem>
                            <SelectItem value="better">Better</SelectItem>
                            <SelectItem value="same">Same</SelectItem>
                            <SelectItem value="worse">Worse</SelectItem>
                            <SelectItem value="much_worse">Much Worse</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="progressTowardsGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Progress Towards Goals</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="significant">Significant</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="minimal">Minimal</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* STEP 3 */}
              <div className={step === 3 ? 'block' : 'hidden'}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="techniquesUsed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Techniques Used (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cognitive Restructuring, Exposure" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topicsDiscussed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topics Discussed (comma separated)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Workplace Stress, Family boundaries" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* STEP 4 */}
              <div className={step === 4 ? 'block' : 'hidden'}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="clinicalSummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clinical Summary</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[100px]" placeholder="Detailed session notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="riskFlags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Risk Flags (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Any safety concerns observed" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="internalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Therapist Notes (Private)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Notes for your own reference..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* STEP 5 */}
              <div className={step === 5 ? 'block' : 'hidden'}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="homeworkActivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned Activity Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Thought Record Worksheet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="homeworkInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Instructions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How should the client complete this?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="homeworkFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Daily, when anxious" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* STEP 6 */}
              <div className={step === 6 ? 'block' : 'hidden'}>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nextSessionRecommendation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Session Recommendation</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="3_days">In 3 Days</SelectItem>
                            <SelectItem value="1_week">In 1 Week</SelectItem>
                            <SelectItem value="2_weeks">In 2 Weeks</SelectItem>
                            <SelectItem value="1_month">In 1 Month</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="followUpMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Automated Follow-up Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Message to send client after session..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            </form>
          </Form>
        </div>
        
        <div className="px-6 py-4 bg-secondary/30 border-t border-border flex justify-between items-center">
          <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          {step < totalSteps ? (
            <Button type="button" className="bg-primary text-white" onClick={nextStep}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="button" 
              className="bg-primary text-white" 
              onClick={form.handleSubmit(onSubmit)}
              disabled={submitReport.isPending}
            >
              {submitReport.isPending ? "Submitting..." : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Complete Report
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
