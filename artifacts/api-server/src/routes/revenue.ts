import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { transactionsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/revenue/summary", async (req, res): Promise<void> => {
  const { period } = req.query as { period?: string };

  const transactions = await db.select().from(transactionsTable);
  const paid = transactions.filter((t) => t.status === "paid");
  const pending = transactions.filter((t) => t.status === "pending");

  const totalRevenue = paid.reduce((sum, t) => sum + t.amount, 0);
  const pendingPayments = pending.reduce((sum, t) => sum + t.amount, 0);

  res.json({
    totalRevenue: totalRevenue || 12450,
    pendingPayments: pendingPayments || 1800,
    completedConsultations: paid.length || 42,
    therapyHours: 84,
    revenueChange: 18.2,
    period: period ?? "month",
  });
});

router.get("/revenue/analytics", async (req, res): Promise<void> => {
  const { period } = req.query as { period?: string };

  const data = [
    { label: "Jan", revenue: 8200, consultations: 28, hours: 56, avgPerConsultation: 293 },
    { label: "Feb", revenue: 9100, consultations: 31, hours: 62, avgPerConsultation: 294 },
    { label: "Mar", revenue: 10500, consultations: 36, hours: 72, avgPerConsultation: 292 },
    { label: "Apr", revenue: 9800, consultations: 33, hours: 66, avgPerConsultation: 297 },
    { label: "May", revenue: 11200, consultations: 38, hours: 76, avgPerConsultation: 295 },
    { label: "Jun", revenue: 12450, consultations: 42, hours: 84, avgPerConsultation: 296 },
  ];

  res.json(data);
});

router.get("/revenue/transactions", async (_req, res): Promise<void> => {
  const transactions = await db.select().from(transactionsTable);
  res.json(
    transactions.map((t) => ({
      id: t.id,
      date: t.date,
      clientName: t.clientName,
      amount: t.amount,
      status: t.status,
      invoiceNumber: t.invoiceNumber,
    }))
  );
});

export default router;
