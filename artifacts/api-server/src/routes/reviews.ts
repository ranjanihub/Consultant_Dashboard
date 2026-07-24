import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/reviews/summary", async (_req, res): Promise<void> => {
  const reviews = await db.select().from(reviewsTable);

  if (reviews.length === 0) {
    res.json({
      averageRating: 4.8,
      totalReviews: 3,
      recommendationPercent: 100,
      ratingTrend: [
        { month: "Jan", rating: 4.6, count: 12 },
        { month: "Feb", rating: 4.7, count: 14 },
        { month: "Mar", rating: 4.8, count: 16 },
        { month: "Apr", rating: 4.7, count: 13 },
        { month: "May", rating: 4.9, count: 18 },
        { month: "Jun", rating: 4.8, count: 16 },
      ],
      ratingDistribution: [
        { stars: 5, count: 3 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    });
    return;
  }

  const totalReviews = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const recommendedCount = reviews.filter((r) => r.rating >= 4).length;
  const recommendationPercent = Math.round((recommendedCount / totalReviews) * 100);

  const distributionMap: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      distributionMap[r.rating]++;
    }
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: distributionMap[stars],
  }));

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData: Record<string, { totalRating: number; count: number }> = {};

  reviews.forEach((r) => {
    let monthStr = "Jul";
    try {
      const parts = r.date.split("-");
      if (parts.length >= 2) {
        const m = parseInt(parts[1], 10) - 1;
        if (m >= 0 && m < 12) {
          monthStr = monthNames[m];
        }
      }
    } catch (e) {}

    if (!monthlyData[monthStr]) {
      monthlyData[monthStr] = { totalRating: 0, count: 0 };
    }
    monthlyData[monthStr].totalRating += r.rating;
    monthlyData[monthStr].count++;
  });

  const ratingTrend = monthNames
    .filter((m) => monthlyData[m])
    .map((m) => ({
      month: m,
      rating: Math.round((monthlyData[m].totalRating / monthlyData[m].count) * 10) / 10,
      count: monthlyData[m].count,
    }));

  if (ratingTrend.length === 0) {
    ratingTrend.push(
      { month: "Jan", rating: 4.6, count: 12 },
      { month: "Feb", rating: 4.7, count: 14 },
      { month: "Mar", rating: 4.8, count: 16 },
      { month: "Apr", rating: 4.7, count: 13 },
      { month: "May", rating: 4.9, count: 18 },
      { month: "Jun", rating: 4.8, count: 16 }
    );
  }

  res.json({
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews,
    recommendationPercent,
    ratingTrend,
    ratingDistribution,
  });
});

router.get("/reviews", async (_req, res): Promise<void> => {
  let reviews = await db.select().from(reviewsTable);
  if (reviews.length === 0) {
    reviews = [
      {
        id: 1,
        rating: 5,
        reviewText: "Dr. Harrison is an extraordinarily compassionate and skilled therapist. His CBT framework and practical exercises gave me back control over my panic attacks.",
        date: "2026-07-15",
        therapistReply: "Thank you so much for your kind words! It has been an honor supporting you on your mental health journey.",
        createdAt: new Date("2026-07-15T10:00:00Z"),
      },
      {
        id: 2,
        rating: 5,
        reviewText: "Warm, empathetic, and highly structured sessions. The digital client portal and homework tracking made sticking to my treatment plan effortless.",
        date: "2026-07-02",
        therapistReply: "I appreciate your feedback! Consistency and dedication are key, and you've done fantastic work.",
        createdAt: new Date("2026-07-02T14:30:00Z"),
      },
      {
        id: 3,
        rating: 5,
        reviewText: "Helped me navigate workplace burnout and establish sustainable boundaries without feeling guilty.",
        date: "2026-06-20",
        therapistReply: "Setting boundaries is hard work—so glad to see the positive impact it's had on your daily life!",
        createdAt: new Date("2026-06-20T09:15:00Z"),
      }
    ] as any;
  }
  res.json(reviews);
});

export default router;
