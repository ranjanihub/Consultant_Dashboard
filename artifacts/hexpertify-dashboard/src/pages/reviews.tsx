import { useGetReviewsSummary, useGetReviews } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Star, MessageSquare } from "lucide-react";
import { formatDate, getInitials } from "@/lib/format";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Reviews() {
  const { data: summary, isLoading: summaryLoading } = useGetReviewsSummary();
  const { data: reviews, isLoading: reviewsLoading } = useGetReviews();

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Reviews</h1>
        <p className="text-muted-foreground mt-1">Monitor your patient feedback and clinical reputation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border bg-gradient-to-b from-amber-50/50 to-white">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            {summaryLoading ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : (
              <>
                <div className="text-5xl font-black text-amber-500 mb-2">{summary?.averageRating.toFixed(1)}</div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-6 h-6 ${star <= (summary?.averageRating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm font-medium text-muted-foreground">Based on {summary?.totalReviews} reviews</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="space-y-3 mt-2">
                {[5,4,3,2,1].map(i => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                {summary?.ratingDistribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1 w-12 font-medium">
                      {dist.stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <Progress value={(dist.count / (summary.totalReviews || 1)) * 100} className="h-2.5 flex-1 bg-secondary" indicatorClassName="bg-amber-400" />
                    <div className="w-8 text-right text-muted-foreground">{dist.count}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rating Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[140px] w-full mt-2">
              {summaryLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summary?.ratingTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} dy={5} />
                    <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                    <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
          <CardTitle className="text-lg">Recent Reviews</CardTitle>
          <CardDescription>Latest patient feedback and comments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {reviewsLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : reviews?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No reviews yet.</div>
            ) : (
              reviews?.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-4">{review.reviewText}</p>
                  
                  {review.therapistReply ? (
                    <div className="bg-secondary/50 rounded-lg p-4 ml-4 border-l-2 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">SW</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-primary">Your Reply</span>
                      </div>
                      <p className="text-sm text-slate-600 italic">"{review.therapistReply}"</p>
                    </div>
                  ) : (
                    <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 ml-1">
                      <MessageSquare className="w-4 h-4" /> Reply to review
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
