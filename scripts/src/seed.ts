import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  console.log("Starting database seeding with dummy data for all fields across all tables...");

  // Dynamically import database and schema after dotenv loading
  const { db } = await import("@workspace/db");
  const {
    clientsTable,
    sessionsTable,
    sessionReportsTable,
    assessmentsTable,
    assessmentTrendsTable,
    moodLogsTable,
    homeworkTable,
    activityLogsTable,
    calendarEventsTable,
    availabilitySlotsTable,
    transactionsTable,
    reviewsTable,
    blogPostsTable,
    blogOutlinesTable,
    therapistProfileTable,
  } = await import("@workspace/db");

  // 1. Seed Therapist Profile
  console.log("Seeding therapist profile...");
  const [profile] = await db.insert(therapistProfileTable).values({
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
  }).returning();

  // 2. Seed Clients
  console.log("Seeding clients...");
  const clientsData = [
    {
      name: "Sarah Jenkins",
      initials: "SJ",
      age: 29,
      gender: "Female",
      status: "active" as const,
      primaryGoal: "Manage generalized anxiety and workplace stress",
      presentingProblems: ["Generalized Anxiety Disorder", "Insomnia", "Workplace Stress", "Imposter Syndrome"],
      identifiedConcerns: ["Frequent panic sensations during team presentations", "Ruminative night thoughts", "Fear of failure"],
      therapyGoals: ["Reduce GAD-7 score below 5", "Establish healthy sleep hygiene routine", "Practice assertiveness techniques at work"],
      preferredLanguage: "English",
      communicationPreference: "Video",
      therapyTimeline: "3-6 months",
      aiIntakeSummary: "Client reports 6-month history of escalating anxiety following a promotion. High motivation for CBT intervention. Responding very well to cognitive restructuring.",
      progressPercent: 75,
      startDate: "2026-02-10",
      lastSession: "2026-07-20",
      nextSession: "2026-07-27",
    },
    {
      name: "Michael Chen",
      initials: "MC",
      age: 36,
      gender: "Male",
      status: "high_priority" as const,
      primaryGoal: "Overcome depressive episodes and build daily routine",
      presentingProblems: ["Major Depressive Disorder (Mild)", "Social Isolation", "Low Energy"],
      identifiedConcerns: ["Lack of motivation for exercise", "Negative self-talk", "Withdrawal from friendships"],
      therapyGoals: ["Complete behavioral activation logs 5x/week", "Re-engage in weekend cycling group", "Identify and challenge 3 cognitive distortions daily"],
      preferredLanguage: "English",
      communicationPreference: "Video",
      therapyTimeline: "6-12 months",
      aiIntakeSummary: "Client reports persistent low mood following recent career pivot. Responding positively to Behavioral Activation and ACT values clarification exercises.",
      progressPercent: 60,
      startDate: "2026-03-01",
      lastSession: "2026-07-21",
      nextSession: "2026-07-28",
    },
    {
      name: "Emily Rodriguez",
      initials: "ER",
      age: 42,
      gender: "Female",
      status: "active" as const,
      primaryGoal: "Process relationship dynamics and improve emotional regulation",
      presentingProblems: ["Adjustment Disorder", "Emotional Dysregulation", "Marital Friction"],
      identifiedConcerns: ["Difficulty communicating boundaries", "Overwhelming emotion spikes during conflicts"],
      therapyGoals: ["Learn DBT TIPP skills for acute distress", "Implement weekly structured check-ins with partner"],
      preferredLanguage: "Spanish",
      communicationPreference: "In-Person",
      therapyTimeline: "3-6 months",
      aiIntakeSummary: "Client seeking support navigating life transition and parental caregiving demands. Benefits from somatic grounding and emotion regulation modules.",
      progressPercent: 85,
      startDate: "2026-01-18",
      lastSession: "2026-07-19",
      nextSession: "2026-07-26",
    },
    {
      name: "David Kim",
      initials: "DK",
      age: 31,
      gender: "Male",
      status: "new" as const,
      primaryGoal: "Manage social anxiety in leadership role",
      presentingProblems: ["Social Anxiety Disorder", "Public Speaking Fear"],
      identifiedConcerns: ["Avoidance of high-stakes executive meetings", "Physical symptoms of distress in group settings"],
      therapyGoals: ["Construct exposure hierarchy for public speaking", "Utilize grounding techniques prior to presentations"],
      preferredLanguage: "English",
      communicationPreference: "Video",
      therapyTimeline: "3-6 months",
      aiIntakeSummary: "New intake client with clear motivation. Baseline PHQ-9: 5, GAD-7: 14. Commencing CBT exposure protocol.",
      progressPercent: 30,
      startDate: "2026-07-10",
      lastSession: "2026-07-17",
      nextSession: "2026-07-24",
    },
    {
      name: "Jessica Taylor",
      initials: "JT",
      age: 25,
      gender: "Female",
      status: "completed" as const,
      primaryGoal: "Address panic symptoms and return to comfortable social activities",
      presentingProblems: ["Panic Disorder with Agoraphobia (In Remission)"],
      identifiedConcerns: ["Fear of elevated heart rate in crowded spaces"],
      therapyGoals: ["Successfully navigate interoceptive exposure exercises", "Maintain panic self-management plan"],
      preferredLanguage: "English",
      communicationPreference: "Video",
      therapyTimeline: "6 months",
      aiIntakeSummary: "Client completed 16 sessions of CBT for panic disorder. Achieved full symptom remission and met all therapeutic goals.",
      progressPercent: 100,
      startDate: "2026-01-05",
      lastSession: "2026-06-30",
      nextSession: undefined,
    },
  ];

  const clients = await db.insert(clientsTable).values(clientsData).returning();
  const [sarah, michael, emily, david, jessica] = clients;

  // 3. Seed Sessions
  console.log("Seeding sessions...");
  const sessionsData = [
    {
      clientId: sarah.id,
      sessionType: "CBT",
      sessionSubtype: "Cognitive Restructuring",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      durationMinutes: 60,
      sessionNumber: 12,
      isNext: false,
      reportSubmitted: true,
      status: "completed",
      sessionDate: "2026-07-20",
    },
    {
      clientId: sarah.id,
      sessionType: "CBT",
      sessionSubtype: "Exposure & Relapse Prevention",
      startTime: "09:00 AM",
      endTime: "10:00 AM",
      durationMinutes: 60,
      sessionNumber: 13,
      isNext: true,
      reportSubmitted: false,
      status: "upcoming",
      sessionDate: "2026-07-27",
    },
    {
      clientId: michael.id,
      sessionType: "ACT",
      sessionSubtype: "Values Clarification",
      startTime: "10:30 AM",
      endTime: "11:30 AM",
      durationMinutes: 60,
      sessionNumber: 8,
      isNext: false,
      reportSubmitted: true,
      status: "completed",
      sessionDate: "2026-07-21",
    },
    {
      clientId: michael.id,
      sessionType: "ACT",
      sessionSubtype: "Behavioral Activation Check-in",
      startTime: "10:30 AM",
      endTime: "11:30 AM",
      durationMinutes: 60,
      sessionNumber: 9,
      isNext: true,
      reportSubmitted: false,
      status: "upcoming",
      sessionDate: "2026-07-28",
    },
    {
      clientId: emily.id,
      sessionType: "DBT",
      sessionSubtype: "Distress Tolerance & Grounding",
      startTime: "02:00 PM",
      endTime: "03:00 PM",
      durationMinutes: 60,
      sessionNumber: 15,
      isNext: false,
      reportSubmitted: true,
      status: "completed",
      sessionDate: "2026-07-19",
    },
    {
      clientId: david.id,
      sessionType: "CBT",
      sessionSubtype: "Intake & Psychoeducation",
      startTime: "04:00 PM",
      endTime: "05:00 PM",
      durationMinutes: 60,
      sessionNumber: 1,
      isNext: false,
      reportSubmitted: true,
      status: "completed",
      sessionDate: "2026-07-17",
    },
    {
      clientId: david.id,
      sessionType: "CBT",
      sessionSubtype: "Hierarchy Construction",
      startTime: "04:00 PM",
      endTime: "05:00 PM",
      durationMinutes: 60,
      sessionNumber: 2,
      isNext: true,
      reportSubmitted: false,
      status: "upcoming",
      sessionDate: "2026-07-24",
    },
  ];

  const sessions = await db.insert(sessionsTable).values(sessionsData).returning();

  // 4. Seed Session Reports for completed sessions
  console.log("Seeding session reports...");
  const completedSessions = sessions.filter(s => s.status === "completed");
  for (const session of completedSessions) {
    await db.insert(sessionReportsTable).values({
      sessionId: session.id,
      durationMinutes: session.durationMinutes,
      clientCooperation: "High",
      clientEngagementLevel: "Active Participant",
      moodComparedToPrevious: "Improved",
      progressTowardsGoals: "Client demonstrated good mastery of skills discussed and completed assigned practice logs.",
      techniquesUsed: ["Cognitive Restructuring", "Socratic Questioning", "Box Breathing", "Psychoeducation"],
      topicsDiscussed: ["Workplace performance anxiety", "Sleep routine adjustments", "Cognitive distortions review"],
      riskFlags: "None - client reports stable mood and safety.",
      clinicalSummary: `Session #${session.sessionNumber} focused on evaluating cognitive patterns and practical behavioral strategies. Client engaged constructively throughout the session.`,
      internalNotes: "Client showed significant insight regarding catastrophizing thoughts. Plan to introduce advanced exposure exercises next session.",
      homeworkActivity: "Daily CBT Thought Record & 5-min Box Breathing",
      homeworkInstructions: "Record automatic thoughts during stressful work moments and practice box breathing twice daily.",
      homeworkFrequency: "Daily",
      nextSessionRecommendation: "Continue CBT protocol, review completed thought logs, and progress exposure hierarchy.",
      followUpMessage: "Great job in our session today! Keep up the practice with box breathing before team meetings.",
      paymentEligible: true,
    });
  }

  // 5. Seed Assessments
  console.log("Seeding assessments...");
  const assessmentsData = [
    {
      clientId: sarah.id,
      type: "GAD-7",
      name: "Generalized Anxiety Disorder-7",
      currentScore: 6.0,
      maxScore: 21.0,
      previousScore: 14.0,
      severity: "Mild Anxiety",
      completedAt: "2026-07-18",
    },
    {
      clientId: sarah.id,
      type: "PHQ-9",
      name: "Patient Health Questionnaire-9",
      currentScore: 4.0,
      maxScore: 27.0,
      previousScore: 9.0,
      severity: "Minimal Depression",
      completedAt: "2026-07-18",
    },
    {
      clientId: michael.id,
      type: "PHQ-9",
      name: "Patient Health Questionnaire-9",
      currentScore: 8.0,
      maxScore: 27.0,
      previousScore: 16.0,
      severity: "Mild Depression",
      completedAt: "2026-07-19",
    },
    {
      clientId: emily.id,
      type: "GAD-7",
      name: "Generalized Anxiety Disorder-7",
      currentScore: 5.0,
      maxScore: 21.0,
      previousScore: 11.0,
      severity: "Mild Anxiety",
      completedAt: "2026-07-15",
    },
    {
      clientId: david.id,
      type: "GAD-7",
      name: "Generalized Anxiety Disorder-7",
      currentScore: 14.0,
      maxScore: 21.0,
      previousScore: 16.0,
      severity: "Moderate Anxiety",
      completedAt: "2026-07-10",
    },
  ];

  const assessments = await db.insert(assessmentsTable).values(assessmentsData).returning();

  // 6. Seed Assessment Trends
  console.log("Seeding assessment trends...");
  for (const assessment of assessments) {
    const trendScores = [
      { date: "2026-04-15", score: Math.min(assessment.maxScore, assessment.currentScore + 8) },
      { date: "2026-05-15", score: Math.min(assessment.maxScore, assessment.currentScore + 5) },
      { date: "2026-06-15", score: (assessment.previousScore ?? assessment.currentScore + 2) },
      { date: "2026-07-18", score: assessment.currentScore },
    ];
    for (const t of trendScores) {
      await db.insert(assessmentTrendsTable).values({
        assessmentId: assessment.id,
        date: t.date,
        score: t.score,
      });
    }
  }

  // 7. Seed Mood Logs
  console.log("Seeding mood logs...");
  const moodLogsData = [
    { clientId: sarah.id, date: "2026-07-23", mood: 8.0, note: "Felt confident during morning presentation after box breathing." },
    { clientId: sarah.id, date: "2026-07-22", mood: 7.5, note: "Good sleep, manageable workload." },
    { clientId: sarah.id, date: "2026-07-21", mood: 6.5, note: "Slight anxiety regarding upcoming quarterly review." },
    { clientId: michael.id, date: "2026-07-23", mood: 7.0, note: "Went for a 30-minute afternoon walk. Mood boosted." },
    { clientId: michael.id, date: "2026-07-22", mood: 6.0, note: "Completed behavioral activation log, felt neutral to positive." },
    { clientId: emily.id, date: "2026-07-23", mood: 8.5, note: "Had peaceful evening conversation with spouse using ground rules." },
    { clientId: david.id, date: "2026-07-23", mood: 5.5, note: "Practiced 4-7-8 breathing before executive sync." },
  ];
  await db.insert(moodLogsTable).values(moodLogsData);

  // 8. Seed Homework
  console.log("Seeding homework...");
  const homeworkData = [
    {
      clientId: sarah.id,
      activity: "CBT Thought Record",
      instructions: "Complete daily thought record log when experiencing stress ratings above 5/10.",
      frequency: "Daily",
      dueDate: "2026-07-27",
      status: "completed",
      completionPercent: 90,
      streak: 5,
      clientReflection: "Recognizing catastrophizing thoughts early allowed me to pause and reframe effectively.",
    },
    {
      clientId: michael.id,
      activity: "Behavioral Activation Cycling",
      instructions: "Go for a 30-minute cycling session at least 3 times this week.",
      frequency: "3x / week",
      dueDate: "2026-07-28",
      status: "pending",
      completionPercent: 66,
      streak: 2,
      clientReflection: "Felt energized after Tuesday ride.",
    },
    {
      clientId: emily.id,
      activity: "DBT TIPP & Grounding Practice",
      instructions: "Practice temperature & paced breathing exercises daily before dinner.",
      frequency: "Daily",
      dueDate: "2026-07-26",
      status: "completed",
      completionPercent: 100,
      streak: 7,
      clientReflection: "Very effective at reducing evening tension.",
    },
    {
      clientId: david.id,
      activity: "Social Exposure Hierarchy Drafting",
      instructions: "List 5 social/work situations ranked by distress level (1-100).",
      frequency: "Once",
      dueDate: "2026-07-24",
      status: "pending",
      completionPercent: 50,
      streak: 1,
      clientReflection: "Working through the list, finding it helpful to organize thoughts.",
    },
  ];
  await db.insert(homeworkTable).values(homeworkData);

  // 9. Seed Activity Logs
  console.log("Seeding activity logs...");
  const activityLogsData = [
    {
      clientId: sarah.id,
      activityType: "homework_completed",
      description: "Completed CBT Thought Record entry for July 23",
      timeAgo: "2 hours ago",
    },
    {
      clientId: sarah.id,
      activityType: "assessment_completed",
      description: "Completed GAD-7 Assessment with score 6 (Mild)",
      timeAgo: "5 days ago",
    },
    {
      clientId: michael.id,
      activityType: "mood_checkin",
      description: "Logged mood rating 7.0/10 with activity note",
      timeAgo: "4 hours ago",
    },
    {
      clientId: emily.id,
      activityType: "journal_shared",
      description: "Shared reflection on DBT TIPP exercise practice",
      timeAgo: "1 day ago",
    },
    {
      clientId: david.id,
      activityType: "message_received",
      description: "Sent question regarding exposure hierarchy template",
      timeAgo: "6 hours ago",
    },
  ];
  await db.insert(activityLogsTable).values(activityLogsData);

  // 10. Seed Calendar Events
  console.log("Seeding calendar events...");
  const calendarEventsData = [
    {
      title: "Session with Sarah Jenkins",
      clientName: "Sarah Jenkins",
      start: "2026-07-27T09:00:00.000Z",
      end: "2026-07-27T10:00:00.000Z",
      type: "session",
      sessionType: "CBT",
      isRecurring: true,
    },
    {
      title: "Session with Michael Chen",
      clientName: "Michael Chen",
      start: "2026-07-28T10:30:00.000Z",
      end: "2026-07-28T11:30:00.000Z",
      type: "session",
      sessionType: "ACT",
      isRecurring: true,
    },
    {
      title: "Clinical Supervision & Peer Intervision",
      clientName: undefined,
      start: "2026-07-27T13:00:00.000Z",
      end: "2026-07-27T14:30:00.000Z",
      type: "blocked",
      sessionType: undefined,
      isRecurring: true,
    },
    {
      title: "Session with David Kim",
      clientName: "David Kim",
      start: "2026-07-24T16:00:00.000Z",
      end: "2026-07-24T17:00:00.000Z",
      type: "session",
      sessionType: "CBT",
      isRecurring: false,
    },
    {
      title: "Session with Emily Rodriguez",
      clientName: "Emily Rodriguez",
      start: "2026-07-26T14:00:00.000Z",
      end: "2026-07-26T15:00:00.000Z",
      type: "session",
      sessionType: "DBT",
      isRecurring: true,
    },
  ];
  await db.insert(calendarEventsTable).values(calendarEventsData);

  // 11. Seed Availability Slots
  console.log("Seeding availability slots...");
  const availabilitySlotsData = [
    { dayOfWeek: "Monday", startTime: "09:00 AM", endTime: "05:00 PM", isRecurring: true },
    { dayOfWeek: "Tuesday", startTime: "09:00 AM", endTime: "05:00 PM", isRecurring: true },
    { dayOfWeek: "Wednesday", startTime: "09:00 AM", endTime: "05:00 PM", isRecurring: true },
    { dayOfWeek: "Thursday", startTime: "09:00 AM", endTime: "05:00 PM", isRecurring: true },
    { dayOfWeek: "Friday", startTime: "09:00 AM", endTime: "04:00 PM", isRecurring: true },
  ];
  await db.insert(availabilitySlotsTable).values(availabilitySlotsData);

  // 12. Seed Transactions
  console.log("Seeding transactions...");
  const transactionsData = [
    {
      date: "2026-07-20",
      clientName: "Sarah Jenkins",
      amount: 160.0,
      status: "paid",
      invoiceNumber: "INV-2026-0891",
    },
    {
      date: "2026-07-21",
      clientName: "Michael Chen",
      amount: 160.0,
      status: "paid",
      invoiceNumber: "INV-2026-0892",
    },
    {
      date: "2026-07-19",
      clientName: "Emily Rodriguez",
      amount: 160.0,
      status: "paid",
      invoiceNumber: "INV-2026-0890",
    },
    {
      date: "2026-07-17",
      clientName: "David Kim",
      amount: 160.0,
      status: "pending",
      invoiceNumber: "INV-2026-0893",
    },
    {
      date: "2026-07-12",
      clientName: "Jessica Taylor",
      amount: 160.0,
      status: "paid",
      invoiceNumber: "INV-2026-0885",
    },
  ];
  await db.insert(transactionsTable).values(transactionsData);

  // 13. Seed Reviews
  console.log("Seeding reviews...");
  const reviewsData = [
    {
      rating: 5,
      reviewText: "Dr. Harrison is an extraordinarily compassionate and skilled therapist. His CBT framework and practical exercises gave me back control over my panic attacks.",
      date: "2026-07-15",
      therapistReply: "Thank you so much for your kind words! It has been an honor supporting you on your mental health journey.",
    },
    {
      rating: 5,
      reviewText: "Warm, empathetic, and highly structured sessions. The digital client portal and homework tracking made sticking to my treatment plan effortless.",
      date: "2026-07-02",
      therapistReply: "I appreciate your feedback! Consistency and dedication are key, and you've done fantastic work.",
    },
    {
      rating: 5,
      reviewText: "Helped me navigate workplace burnout and establish sustainable boundaries without feeling guilty.",
      date: "2026-06-20",
      therapistReply: "Setting boundaries is hard work—so glad to see the positive impact it's had on your daily life!",
    },
  ];
  await db.insert(reviewsTable).values(reviewsData);

  // 14. Seed Blog Posts
  console.log("Seeding blog posts...");
  const blogPostsData = [
    {
      title: "5 Proven CBT Techniques to Overcome Workplace Burnout",
      featuredImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      category: "CBT Insights",
      tags: ["Burnout", "CBT", "Stress Management", "Workplace Wellness"],
      content: `Workplace burnout is more than just feeling overworked—it's a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. In this article, we explore 5 evidence-based Cognitive Behavioral Therapy (CBT) techniques to regain control...\n\n1. Identify Cognitive Distortions (All-or-Nothing Thinking)\n2. Practice Box Breathing during High-Pressure Moments\n3. Establish Clear Workplace Boundaries\n4. Reframe Catastrophizing Thoughts\n5. Implement Scheduled Behavioral Breaks.`,
      status: "published",
    },
    {
      title: "Understanding Mindfulness in Modern Psychotherapy",
      featuredImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      category: "Mindfulness",
      tags: ["Mindfulness", "ACT", "Self-Care", "Mental Health"],
      content: `Mindfulness has transitioned from ancient meditative traditions into a core pillar of modern clinical psychology. By cultivating non-judgmental awareness of the present moment, clients can unhook from intrusive thoughts and build emotional resilience...`,
      status: "published",
    },
    {
      title: "The Role of Sleep Hygiene in Anxiety Management",
      featuredImage: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80",
      category: "Anxiety",
      tags: ["Sleep", "Anxiety", "Self-Care", "Health"],
      content: `Quality sleep and anxiety regulation are deeply interconnected. When sleep is disrupted, emotional reactivity increases. Learn practical stimulus control and sleep hygiene strategies recommended by clinical psychologists...`,
      status: "submitted",
    },
  ];
  await db.insert(blogPostsTable).values(blogPostsData);

  // 15. Seed Blog Outlines
  console.log("Seeding blog outlines...");
  const blogOutlinesData = [
    {
      proposedTitle: "Navigating Life Transitions with Acceptance & Commitment Therapy (ACT)",
      keyPoints: [
        "Defining ACT and psychological flexibility",
        "Clarifying personal core values during major shifts",
        "Defusion techniques for fear of uncertainty",
        "Actionable steps for daily commitment",
      ],
      targetAudience: "Adults navigating career changes, parenthood, or relocation",
      keywords: ["ACT Therapy", "Life Transitions", "Values", "Mindfulness"],
      notes: "Outline drafted. Ready for review by clinical communications team.",
      status: "approved",
    },
    {
      proposedTitle: "A Guide to De-escalating Panic Attacks in Public",
      keyPoints: [
        "Understanding physical panic symptoms",
        "Somatic grounding (5-4-3-2-1 technique)",
        "Self-compassion and breaking panic cycles",
      ],
      targetAudience: "Individuals diagnosed with Panic Disorder or Agoraphobia",
      keywords: ["Panic Attacks", "Grounding", "Anxiety Support"],
      notes: "Pending final reference additions.",
      status: "pending",
    },
  ];
  await db.insert(blogOutlinesTable).values(blogOutlinesData);

  console.log("Successfully inserted dummy data into ALL fields across ALL 15 tables!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
