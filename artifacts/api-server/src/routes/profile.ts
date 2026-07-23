import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { therapistProfileTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/profile", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(therapistProfileTable);

  if (!profile) {
    res.json({
      id: 1,
      name: "Dr. Alex Harrison, PsyD",
      title: "Licensed Clinical Psychologist & CBT Specialist",
      bio: "Dr. Alex Harrison is a licensed clinical psychologist with over 12 years of experience specializing in Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), and evidence-based treatment for anxiety, depression, and trauma.",
      qualifications: [
        "Psy.D. in Clinical Psychology - Stanford University",
        "Licensed Clinical Psychologist (License #PSY-98421)",
        "Certified CBT Diplomate - Beck Institute",
        "Certified EMDR Practitioner - EMDRIA",
      ],
      experience: 12,
      languages: ["English", "Spanish"],
      specializations: [
        "Generalized Anxiety & Panic",
        "Depression & Mood Disorders",
        "Workplace Burnout & Stress",
        "Trauma & Post-Traumatic Stress",
        "Relationship Dynamics",
      ],
      verificationStatus: "verified",
      consultationFee: 160.0,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      consultationHours: "09:00 AM - 06:00 PM",
      isAvailable: true,
      photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    });
    return;
  }

  res.json({
    id: profile.id,
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    qualifications: profile.qualifications,
    experience: profile.experience,
    languages: profile.languages,
    specializations: profile.specializations,
    verificationStatus: profile.verificationStatus,
    consultationFee: profile.consultationFee,
    workingDays: profile.workingDays,
    consultationHours: profile.consultationHours,
    isAvailable: profile.isAvailable,
    photoUrl: profile.photoUrl,
  });
});

router.patch("/profile", async (req, res): Promise<void> => {
  const [profile] = await db.select().from(therapistProfileTable);

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const updates: Partial<typeof therapistProfileTable.$inferInsert> = {};
  const allowed = [
    "name", "title", "bio", "qualifications", "experience",
    "languages", "specializations", "consultationFee",
    "workingDays", "consultationHours", "isAvailable",
  ] as const;

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      (updates as Record<string, unknown>)[key] = req.body[key];
    }
  }

  const [updated] = await db
    .update(therapistProfileTable)
    .set(updates)
    .where(eq(therapistProfileTable.id, profile.id))
    .returning();

  res.json({
    id: updated.id,
    name: updated.name,
    title: updated.title,
    bio: updated.bio,
    qualifications: updated.qualifications,
    experience: updated.experience,
    languages: updated.languages,
    specializations: updated.specializations,
    verificationStatus: updated.verificationStatus,
    consultationFee: updated.consultationFee,
    workingDays: updated.workingDays,
    consultationHours: updated.consultationHours,
    isAvailable: updated.isAvailable,
    photoUrl: updated.photoUrl,
  });
});

export default router;
