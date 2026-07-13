import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { therapistProfileTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/profile", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(therapistProfileTable);

  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
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
