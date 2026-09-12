import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Star, MessageSquare, CheckCircle2 } from "lucide-react";
import { formatDate, getInitials } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PageHeader } from "@/components/page-header";
import { getAuthUser } from "@/lib/auth";

export default function Reviews() {
  const authUser = getAuthUser();
  const consultantName = authUser?.name || 'Sadaf Bhimani';
  const consultantId = authUser?.id || '';

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<any>({
    averageRating: 4.9,
    totalReviews: 0,
    recommendationPercent: 98,
    ratingTrend: [],
    ratingDistribution: [
      { stars: 5, count: 0 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 }
    ]
  });
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?consultantName=${encodeURIComponent(consultantName)}&consultantId=${encodeURIComponent(consultantId)}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (data.success) {
            setSummary(data.summary || {});
            setReviewsList(Array.isArray(data.reviews) ? data.reviews : []);
          }
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReviews();
    return () => { isMounted = false; };
  }, [consultantName, consultantId]);

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Client Reviews & Ratings"
        description="Monitor client feedback, satisfaction ratings, and overall clinical reputation."
        badge="CLIENT FEEDBACK"
        icon={<Star className="w-4 h-4 text-purple-200" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="shadow-sm border-border bg-gradient-to-b from-amber-50/50 to-white">
          <CardContent className="p-5 sm:p-8 flex flex-col items-center justify-center text-center">
            {loading ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : (
              <>
                <div className="text-5xl font-black text-amber-500 mb-2">{(summary?.averageRating || 4.9).toFixed(1)}</div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-6 h-6 ${star <= Math.round(summary?.averageRating || 5) ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground">Based on {summary?.totalReviews || reviewsList.length || 0} reviews</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {loading ? (
              <Skeleton className="h-28 w-full" />
            ) : (
              (summary?.ratingDistribution || []).map((item: any) => {
                const total = summary?.totalReviews || 1;
                const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <div key={item.stars} className="flex items-center gap-3 text-xs font-semibold">
                    <span className="w-12 text-slate-600">{item.stars} Stars</span>
                    <Progress value={percentage} className="h-2 flex-1 bg-slate-100" />
                    <span className="w-8 text-right text-slate-400 font-mono">{item.count}</span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly Rating Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[120px] w-full">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary?.ratingTrend || []} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="rating" name="Avg Rating" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Verified Client Reviews</CardTitle>
          <CardDescription>Real testimonials and consultation feedback from clients</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : reviewsList.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No reviews yet.</div>
            ) : (
              reviewsList.map((review: any, idx: number) => {
                const name = review.clientName || 'Verified Client';
                const initials = getInitials(name);

                return (
                  <div key={review.id || idx} className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarFallback className="bg-amber-100 text-amber-900 font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-2">
                            {name}
                            {review.clientTitle && (
                              <span className="text-[11px] font-normal text-slate-400">({review.clientTitle})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{formatDate(review.date)}</span>
                    </div>

                    <p className="text-slate-700 leading-relaxed text-sm pl-13">{review.reviewText}</p>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
