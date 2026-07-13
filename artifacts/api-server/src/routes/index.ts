import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import clientsRouter from "./clients";
import sessionsRouter from "./sessions";
import calendarRouter from "./calendar";
import outcomesRouter from "./outcomes";
import revenueRouter from "./revenue";
import reviewsRouter from "./reviews";
import blogRouter from "./blog";
import profileRouter from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(clientsRouter);
router.use(sessionsRouter);
router.use(calendarRouter);
router.use(outcomesRouter);
router.use(revenueRouter);
router.use(reviewsRouter);
router.use(blogRouter);
router.use(profileRouter);

export default router;
