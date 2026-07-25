import { Router, type IRouter } from "express";

const router: IRouter = Router();

const DEFAULT_THERAPIST = {
  id: "therapist-1",
  name: "Dr. Alex Harrison, PsyD",
  email: "alex.harrison@hexpertify.com",
  title: "Licensed Clinical Psychologist & CBT Specialist",
  licenseNumber: "PSY-98421",
  role: "therapist",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
};

router.post("/auth/login", (req, res): void => {
  const { email, password, role } = req.body || {};

  // For demonstration and clinical suite login
  res.json({
    success: true,
    token: "hexpertify_demo_jwt_token_2026",
    user: {
      ...DEFAULT_THERAPIST,
      email: email || DEFAULT_THERAPIST.email,
      role: role || "therapist",
    },
    message: "Authentication successful. Welcome to Hexpertify Clinical Suite.",
  });
});

router.post("/auth/logout", (_req, res): void => {
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

router.get("/auth/me", (_req, res): void => {
  res.json(DEFAULT_THERAPIST);
});

export default router;
