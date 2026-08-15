import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Eye,
  Play,
  Sparkles,
  X,
  ChevronRight,
  BarChart3,
  Filter,
  ShieldAlert,
  Edit3,
  Download,
  Grid,
  List,
  Check,
  Award,
  BookOpen,
  Activity,
  Layers,
  HelpCircle,
  Smartphone,
  ClipboardCheck,
  Minus,
  TrendingDown,
  TrendingUp,
  User,
  UserPlus,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { cn } from '@/lib/utils';

const CLIENT_LIST = [
  "Sarah Jenkins",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "Jessica Taylor",
  "Sofia Rodriguez",
  "Marcus O'Neill",
];

const FREQUENCY_OPTIONS = [
  { id: "Daily", label: "Daily Assessment" },
  { id: "2-3 Times / Week", label: "2-3 Times / Week" },
  { id: "Weekly", label: "Weekly Check-in" },
  { id: "Bi-weekly", label: "Bi-weekly Evaluation" },
  { id: "Monthly", label: "Monthly Progress Scale" },
  { id: "As Needed (PRN)", label: "As Needed (PRN)" },
];

const TIME_OPTIONS = [
  "Morning (8:00 AM)",
  "Midday (12:00 PM)",
  "Evening (6:00 PM)",
  "Before Bed (9:30 PM)",
];

// Types
export interface AssessmentQuestion {
  id: string;
  text: string;
  subtext?: string;
  options: { label: string; value: number }[];
  isRiskTrigger?: boolean;
}

export interface AssessmentSeverityRange {
  minScore: number;
  maxScore: number;
  label: string;
  color: string;
  clinicalAction: string;
}

export interface ClinicalAssessment {
  id: string;
  title: string;
  acronym: string;
  questionCount: number;
  targetCondition: string;
  category?: string;
  timesCompleted: number;
  type: 'Standard' | 'Custom';
  description: string;
  estimatedMinutes?: number;
  validityScore?: string;
  targetPopulation?: string;
  authorOrSource?: string;
  questions?: AssessmentQuestion[];
  severityRanges?: AssessmentSeverityRange[];
  createdAt?: string;
  status?: 'Active' | 'Draft' | 'Archived';
  assignedClientCount?: number;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  assessmentAcronym: string;
  assessmentTitle: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  therapistName: string;
  completedAt: string;
  totalScore: number;
  maxScore: number;
  severityLabel: string;
  severityColor: string;
  flaggedRisk: boolean;
  answers: { questionId: string; questionText: string; answerLabel: string; score: number }[];
}

export interface AssessmentAssignment {
  id: string;
  assessmentId: string;
  assessmentAcronym: string;
  assessmentTitle: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  therapistName: string;
  assignedDate: string;
  dueDate: string;
  frequency: 'One-time' | 'Weekly' | 'Bi-weekly' | 'Monthly';
  status: 'Pending' | 'Completed' | 'Overdue';
}

// Mock Datasets (Synchronized with Super Admin)
export const mockClientsList = [
  { id: 'CL-101', name: 'Sarah Jenkins', therapy: 'CBT · Anxiety & Depression', therapist: 'Dr. Alex Harrison' },
  { id: 'CL-102', name: 'Michael Chen', therapy: 'ACT · Major Depression', therapist: 'Dr. Alex Harrison' },
  { id: 'CL-103', name: 'Emily Rodriguez', therapy: 'DBT · Distress Tolerance', therapist: 'Dr. Alex Harrison' },
  { id: 'CL-104', name: 'David Kim', therapy: 'CBT · Social Anxiety', therapist: 'Dr. Alex Harrison' },
  { id: 'CL-105', name: 'Jessica Taylor', therapy: 'CBT · Panic Protocol', therapist: 'Dr. Alex Harrison' },
  { id: 'CL-106', name: 'Sofia Rodriguez', therapy: 'ACT · Generalized Anxiety', therapist: 'Dr. Alex Harrison' },
  { id: 'CL-107', name: 'Marcus O\'Neill', therapy: 'Couples Therapy', therapist: 'Dr. Alex Harrison' },
];

export const mockAssessmentsData: ClinicalAssessment[] = [
  {
    id: 'ASS-01',
    title: 'Perceived Stress Scale-10',
    acronym: 'PSS-10',
    questionCount: 10,
    targetCondition: 'Perceived Stress',
    category: 'Stress',
    timesCompleted: 1240,
    type: 'Standard',
    description: 'Classic 10-item instrument measuring the degree to which situations in one\'s life are appraised as unpredictable, uncontrollable, and overloading.',
    estimatedMinutes: 4,
    validityScore: "Cronbach's α = 0.88",
    targetPopulation: 'General for all clients',
    authorOrSource: 'Cohen, Kamarck & Mermelstein (1983) / Mind Garden',
    status: 'Active',
    assignedClientCount: 380,
    createdAt: '2025-01-10',
    severityRanges: [
      { minScore: 0, maxScore: 13, label: 'Low Perceived Stress', color: 'bg-emerald-500', clinicalAction: 'Normal stress coping capacity. Continue routine wellness activities.' },
      { minScore: 14, maxScore: 26, label: 'Moderate Stress', color: 'bg-amber-500', clinicalAction: 'Stress management education and mindfulness practice recommended.' },
      { minScore: 27, maxScore: 40, label: 'High Perceived Stress', color: 'bg-rose-600', clinicalAction: 'Targeted CBT stress reduction protocol and clinical coping review indicated.' }
    ],
    questions: [
      {
        id: 'q1',
        text: 'In the last month, how often have you been upset because of something that happened unexpectedly?',
        options: [
          { label: 'Never (0)', value: 0 },
          { label: 'Almost Never (1)', value: 1 },
          { label: 'Sometimes (2)', value: 2 },
          { label: 'Fairly Often (3)', value: 3 },
          { label: 'Very Often (4)', value: 4 }
        ]
      },
      {
        id: 'q2',
        text: 'In the last month, how often have you felt that you were unable to control the important things in your life?',
        options: [
          { label: 'Never (0)', value: 0 },
          { label: 'Almost Never (1)', value: 1 },
          { label: 'Sometimes (2)', value: 2 },
          { label: 'Fairly Often (3)', value: 3 },
          { label: 'Very Often (4)', value: 4 }
        ]
      },
      {
        id: 'q3',
        text: 'In the last month, how often have you felt nervous and stressed?',
        options: [
          { label: 'Never (0)', value: 0 },
          { label: 'Almost Never (1)', value: 1 },
          { label: 'Sometimes (2)', value: 2 },
          { label: 'Fairly Often (3)', value: 3 },
          { label: 'Very Often (4)', value: 4 }
        ]
      },
      {
        id: 'q4',
        text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
        subtext: 'REVERSE SCORED ITEM',
        options: [
          { label: 'Never (0)', value: 0 },
          { label: 'Almost Never (1)', value: 1 },
          { label: 'Sometimes (2)', value: 2 },
          { label: 'Fairly Often (3)', value: 3 },
          { label: 'Very Often (4)', value: 4 }
        ]
      },
      {
        id: 'q5',
        text: 'In the last month, how often have you felt that things were going your way?',
        subtext: 'REVERSE SCORED ITEM',
        options: [
          { label: 'Never (0)', value: 0 },
          { label: 'Almost Never (1)', value: 1 },
          { label: 'Sometimes (2)', value: 2 },
          { label: 'Fairly Often (3)', value: 3 },
          { label: 'Very Often (4)', value: 4 }
        ]
      }
    ]
  },
  {
    id: 'ASS-02',
    title: 'Patient Health Questionnaire-9',
    acronym: 'PHQ-9',
    questionCount: 9,
    targetCondition: 'Major Depression',
    category: 'Depression',
    timesCompleted: 3420,
    type: 'Standard',
    description: 'Gold-standard 9-item depression screener incorporating DSM-5 criteria for depressive symptom severity and suicide risk screening.',
    estimatedMinutes: 3,
    validityScore: 'Sensitivity 88%, Specificity 88%',
    targetPopulation: 'Adults & Adolescents (12+)',
    authorOrSource: 'Kroenke, Spitzer & Williams (2001) / Pfizer',
    status: 'Active',
    assignedClientCount: 950,
    createdAt: '2025-01-05',
    severityRanges: [
      { minScore: 0, maxScore: 4, label: 'Minimal Depression', color: 'bg-emerald-500', clinicalAction: 'No immediate treatment needed. Monitor.' },
      { minScore: 5, maxScore: 9, label: 'Mild Depression', color: 'bg-emerald-600', clinicalAction: 'Watchful waiting; psychoeducation.' },
      { minScore: 10, maxScore: 14, label: 'Moderate Depression', color: 'bg-amber-500', clinicalAction: 'Treatment plan (psychotherapy / pharmacotherapy).' },
      { minScore: 15, maxScore: 19, label: 'Moderately Severe', color: 'bg-orange-500', clinicalAction: 'Active treatment with CBT or medication.' },
      { minScore: 20, maxScore: 27, label: 'Severe Depression', color: 'bg-rose-600', clinicalAction: 'Immediate priority clinical assessment and specialist referral.' }
    ],
    questions: [
      {
        id: 'q1',
        text: 'Little interest or pleasure in doing things',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ]
      },
      {
        id: 'q2',
        text: 'Feeling down, depressed, or hopeless',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ]
      },
      {
        id: 'q3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ]
      },
      {
        id: 'q9',
        text: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
        subtext: 'CRITICAL SAFETY RISK TRIGGER QUESTION',
        isRiskTrigger: true,
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ]
      }
    ]
  },
  {
    id: 'ASS-03',
    title: 'Generalized Anxiety Disorder-7',
    acronym: 'GAD-7',
    questionCount: 7,
    targetCondition: 'Generalized Anxiety',
    category: 'Anxiety',
    timesCompleted: 2890,
    type: 'Standard',
    description: 'Validated 7-item scale designed to screen for and measure the severity of Generalized Anxiety Disorder in clinical practice.',
    estimatedMinutes: 3,
    validityScore: 'Sensitivity 89%, Specificity 82%',
    targetPopulation: 'Adults (18+)',
    authorOrSource: 'Spitzer et al. (2006)',
    status: 'Active',
    assignedClientCount: 810,
    createdAt: '2025-01-08',
    severityRanges: [
      { minScore: 0, maxScore: 4, label: 'Minimal Anxiety', color: 'bg-emerald-500', clinicalAction: 'Normal baseline. Re-evaluate as needed.' },
      { minScore: 5, maxScore: 9, label: 'Mild Anxiety', color: 'bg-amber-500', clinicalAction: 'Relaxation training & anxiety psychoeducation.' },
      { minScore: 10, maxScore: 14, label: 'Moderate Anxiety', color: 'bg-orange-500', clinicalAction: 'CBT exposure & cognitive restructuring indicated.' },
      { minScore: 15, maxScore: 21, label: 'Severe Anxiety', color: 'bg-rose-600', clinicalAction: 'Immediate clinical review and panic/anxiety protocol.' }
    ],
    questions: [
      {
        id: 'g1',
        text: 'Feeling nervous, anxious, or on edge',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ]
      },
      {
        id: 'g2',
        text: 'Not being able to stop or control worrying',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ]
      },
      {
        id: 'g3',
        text: 'Worrying too much about different things',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ]
      }
    ]
  },
  {
    id: 'ASS-04',
    title: 'PTSD Checklist for DSM-5',
    acronym: 'PCL-5',
    questionCount: 20,
    targetCondition: 'Trauma & Stressor-Related',
    category: 'Trauma',
    timesCompleted: 640,
    type: 'Standard',
    description: 'Self-report rating scale for assessing the 20 DSM-5 symptoms of posttraumatic stress disorder.',
    estimatedMinutes: 8,
    validityScore: "Cronbach's α = 0.94",
    targetPopulation: 'Adult Trauma Survivors',
    authorOrSource: 'Weathers et al. (2013) / National Center for PTSD',
    status: 'Active',
    assignedClientCount: 210,
    createdAt: '2025-01-15',
    severityRanges: [
      { minScore: 0, maxScore: 30, label: 'Sub-Clinical Trauma', color: 'bg-emerald-500', clinicalAction: 'Below clinical cut-off (31-33).' },
      { minScore: 31, maxScore: 50, label: 'Moderate PTSD Symptoms', color: 'bg-amber-500', clinicalAction: 'EMDR or Trauma-Focused CBT indicated.' },
      { minScore: 51, maxScore: 80, label: 'Severe PTSD Symptoms', color: 'bg-rose-600', clinicalAction: 'Comprehensive trauma protocol & clinical priority.' }
    ]
  },
  {
    id: 'ASS-05',
    title: 'WHO-5 Well-Being Index',
    acronym: 'WHO-5',
    questionCount: 5,
    targetCondition: 'Subjective Well-Being',
    category: 'Wellness',
    timesCompleted: 1520,
    type: 'Standard',
    description: 'Short 5-item questionnaire covering subjective emotional well-being over the past two weeks.',
    estimatedMinutes: 2,
    validityScore: 'High Construct Validity',
    targetPopulation: 'General Population',
    authorOrSource: 'World Health Organization (1998)',
    status: 'Active',
    assignedClientCount: 420,
    createdAt: '2025-02-01',
    severityRanges: [
      { minScore: 0, maxScore: 50, label: 'Reduced Well-Being / Depression Risk', color: 'bg-rose-600', clinicalAction: 'Screen for depression using PHQ-9.' },
      { minScore: 51, maxScore: 75, label: 'Moderate Well-Being', color: 'bg-amber-500', clinicalAction: 'Positive psychology & lifestyle interventions.' },
      { minScore: 76, maxScore: 100, label: 'Optimal Well-Being', color: 'bg-emerald-500', clinicalAction: 'Maintain current positive routine.' }
    ]
  },
  {
    id: 'ASS-06',
    title: 'AUDIT-C Alcohol Screener',
    acronym: 'AUDIT-C',
    questionCount: 3,
    targetCondition: 'Substance Use Risk',
    category: 'Substance',
    timesCompleted: 980,
    type: 'Standard',
    description: 'Brief 3-item alcohol screening tool that reliably identifies hazardous drinking or active alcohol use disorders.',
    estimatedMinutes: 2,
    validityScore: 'Sensitivity 86%',
    targetPopulation: 'Adults (18+)',
    authorOrSource: 'Bush et al. (1998) / World Health Organization',
    status: 'Active',
    assignedClientCount: 310,
    createdAt: '2025-02-05'
  }
];

export const mockSubmissionsData: AssessmentSubmission[] = [
  {
    id: 'SUB-901',
    assessmentId: 'ASS-02',
    assessmentAcronym: 'PHQ-9',
    assessmentTitle: 'Patient Health Questionnaire-9',
    clientId: 'CL-101',
    clientName: 'Sarah Jenkins',
    therapistName: 'Dr. Alex Harrison',
    completedAt: '2026-08-01 14:32',
    totalScore: 16,
    maxScore: 27,
    severityLabel: 'Moderately Severe Depression',
    severityColor: 'bg-rose-600 text-white',
    flaggedRisk: true,
    answers: [
      { questionId: 'q1', questionText: 'Little interest or pleasure in doing things', answerLabel: 'More than half the days (2)', score: 2 },
      { questionId: 'q2', questionText: 'Feeling down, depressed, or hopeless', answerLabel: 'Nearly every day (3)', score: 3 },
      { questionId: 'q3', questionText: 'Trouble falling or staying asleep', answerLabel: 'More than half the days (2)', score: 2 },
      { questionId: 'q9', questionText: 'Thoughts of self-harm or hurting yourself', answerLabel: 'Several days (1)', score: 1 }
    ]
  },
  {
    id: 'SUB-902',
    assessmentId: 'ASS-03',
    assessmentAcronym: 'GAD-7',
    assessmentTitle: 'Generalized Anxiety Disorder-7',
    clientId: 'CL-102',
    clientName: 'Michael Chen',
    therapistName: 'Dr. Alex Harrison',
    completedAt: '2026-08-01 11:15',
    totalScore: 8,
    maxScore: 21,
    severityLabel: 'Mild Anxiety',
    severityColor: 'bg-amber-500 text-white',
    flaggedRisk: false,
    answers: [
      { questionId: 'g1', questionText: 'Feeling nervous, anxious, or on edge', answerLabel: 'Several days (1)', score: 1 },
      { questionId: 'g2', questionText: 'Not being able to stop or control worrying', answerLabel: 'More than half the days (2)', score: 2 },
      { questionId: 'g3', questionText: 'Worrying too much about different things', answerLabel: 'Several days (1)', score: 1 }
    ]
  },
  {
    id: 'SUB-903',
    assessmentId: 'ASS-02',
    assessmentAcronym: 'PHQ-9',
    assessmentTitle: 'Patient Health Questionnaire-9',
    clientId: 'CL-104',
    clientName: 'David Kim',
    therapistName: 'Dr. Alex Harrison',
    completedAt: '2026-08-02 09:40',
    totalScore: 8,
    maxScore: 27,
    severityLabel: 'Mild Depression',
    severityColor: 'bg-amber-500 text-white',
    flaggedRisk: false,
    answers: []
  },
  {
    id: 'SUB-904',
    assessmentId: 'ASS-04',
    assessmentAcronym: 'PCL-5',
    assessmentTitle: 'PTSD Checklist for DSM-5',
    clientId: 'CL-103',
    clientName: 'Emily Rodriguez',
    therapistName: 'Dr. Alex Harrison',
    completedAt: '2026-07-26 16:20',
    totalScore: 24,
    maxScore: 80,
    severityLabel: 'Sub-Clinical Trauma',
    severityColor: 'bg-emerald-500 text-white',
    flaggedRisk: false,
    answers: []
  },
  {
    id: 'SUB-905',
    assessmentId: 'ASS-03',
    assessmentAcronym: 'GAD-7',
    assessmentTitle: 'Generalized Anxiety Disorder-7',
    clientId: 'CL-105',
    clientName: 'Jessica Taylor',
    therapistName: 'Dr. Alex Harrison',
    completedAt: '2026-07-12 10:05',
    totalScore: 3,
    maxScore: 21,
    severityLabel: 'Minimal Anxiety (Remission)',
    severityColor: 'bg-emerald-500 text-white',
    flaggedRisk: false,
    answers: []
  }
];

export const mockAssignmentsData: AssessmentAssignment[] = [
  {
    id: 'ASN-301',
    assessmentId: 'ASS-02',
    assessmentAcronym: 'PHQ-9',
    assessmentTitle: 'Patient Health Questionnaire-9',
    clientId: 'CL-101',
    clientName: 'Sarah Jenkins',
    therapistName: 'Dr. Alex Harrison',
    assignedDate: '2026-08-01',
    dueDate: '2026-08-08',
    frequency: 'Weekly',
    status: 'Pending'
  },
  {
    id: 'ASN-302',
    assessmentId: 'ASS-03',
    assessmentAcronym: 'GAD-7',
    assessmentTitle: 'Generalized Anxiety Disorder-7',
    clientId: 'CL-102',
    clientName: 'Michael Chen',
    therapistName: 'Dr. Alex Harrison',
    assignedDate: '2026-07-28',
    dueDate: '2026-08-04',
    frequency: 'Bi-weekly',
    status: 'Completed'
  },
  {
    id: 'ASN-303',
    assessmentId: 'ASS-04',
    assessmentAcronym: 'PCL-5',
    assessmentTitle: 'PTSD Checklist for DSM-5',
    clientId: 'CL-103',
    clientName: 'Emily Rodriguez',
    therapistName: 'Dr. Alex Harrison',
    assignedDate: '2026-07-25',
    dueDate: '2026-08-01',
    frequency: 'Monthly',
    status: 'Completed'
  },
  {
    id: 'ASN-304',
    assessmentId: 'ASS-03',
    assessmentAcronym: 'GAD-7',
    assessmentTitle: 'Generalized Anxiety Disorder-7',
    clientId: 'CL-104',
    clientName: 'David Kim',
    therapistName: 'Dr. Alex Harrison',
    assignedDate: '2026-07-31',
    dueDate: '2026-08-05',
    frequency: 'One-time',
    status: 'Pending'
  }
];

export default function Assessments() {
  // Main State
  const [assessments, setAssessments] = useState<ClinicalAssessment[]>(mockAssessmentsData);
  const [submissions] = useState<AssessmentSubmission[]>(mockSubmissionsData);
  const [assignments, setAssignments] = useState<AssessmentAssignment[]>(mockAssignmentsData);

  // Active Navigation Tab: 'library' | 'submissions' | 'assignments'
  const [activeTab, setActiveTab] = useState<'library' | 'submissions' | 'assignments'>('library');

  // Filter and View States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [activeProtocolModal, setActiveProtocolModal] = useState<ClinicalAssessment | null>(null);
  const [activeRunnerModal, setActiveRunnerModal] = useState<ClinicalAssessment | null>(null);
  const [selectedSubmissionModal, setSelectedSubmissionModal] = useState<AssessmentSubmission | null>(null);

  // Runner Simulator Internal State
  const [runnerCurrentStep, setRunnerCurrentStep] = useState(0);
  const [runnerAnswers, setRunnerAnswers] = useState<Record<string, number>>({});
  const [runnerCompletedReport, setRunnerCompletedReport] = useState<{
    score: number;
    maxScore: number;
    severity: AssessmentSeverityRange | null;
    flagged: boolean;
  } | null>(null);

  // Multi-Step Assignment Modal State (Identical to Activities page)
  const [assignModalAssessment, setAssignModalAssessment] = useState<ClinicalAssessment | null>(null);
  const [assignStep, setAssignStep] = useState<1 | 2>(1);
  const [selectedClientsToAssign, setSelectedClientsToAssign] = useState<string[]>([]);
  const [clientFrequencies, setClientFrequencies] = useState<
    Record<string, { frequency: string; timeOfDay: string }>
  >({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper functions for assignment modal
  const openAssignModal = (assessment: ClinicalAssessment) => {
    setAssignModalAssessment(assessment);
    setAssignStep(1);
    const initialClient = CLIENT_LIST[0] || "Sarah Jenkins";
    setSelectedClientsToAssign([initialClient]);
    setClientFrequencies({
      [initialClient]: { frequency: "Weekly", timeOfDay: "Morning (8:00 AM)" },
    });
  };

  const toggleClientSelection = (clientName: string) => {
    setSelectedClientsToAssign((prev) => {
      const isSelected = prev.includes(clientName);
      let updated: string[];
      if (isSelected) {
        updated = prev.filter((c) => c !== clientName);
      } else {
        updated = [...prev, clientName];
      }
      if (!isSelected && !clientFrequencies[clientName]) {
        setClientFrequencies((fPrev) => ({
          ...fPrev,
          [clientName]: { frequency: "Weekly", timeOfDay: "Morning (8:00 AM)" },
        }));
      }
      return updated;
    });
  };

  const toggleSelectAllClients = () => {
    if (selectedClientsToAssign.length === CLIENT_LIST.length) {
      setSelectedClientsToAssign([CLIENT_LIST[0]]);
    } else {
      setSelectedClientsToAssign([...CLIENT_LIST]);
      const newFreqs: Record<string, { frequency: string; timeOfDay: string }> = {};
      CLIENT_LIST.forEach((c) => {
        newFreqs[c] = clientFrequencies[c] || { frequency: "Weekly", timeOfDay: "Morning (8:00 AM)" };
      });
      setClientFrequencies(newFreqs);
    }
  };

  const applyFrequencyToAll = (freq: string) => {
    setClientFrequencies((prev) => {
      const next = { ...prev };
      selectedClientsToAssign.forEach((c) => {
        next[c] = {
          frequency: freq,
          timeOfDay: next[c]?.timeOfDay || "Morning (8:00 AM)",
        };
      });
      return next;
    });
  };

  const updateClientFrequency = (clientName: string, frequency: string) => {
    setClientFrequencies((prev) => ({
      ...prev,
      [clientName]: {
        frequency,
        timeOfDay: prev[clientName]?.timeOfDay || "Morning (8:00 AM)",
      },
    }));
  };

  const updateClientTimeOfDay = (clientName: string, timeOfDay: string) => {
    setClientFrequencies((prev) => ({
      ...prev,
      [clientName]: {
        frequency: prev[clientName]?.frequency || "Weekly",
        timeOfDay,
      },
    }));
  };

  const handleConfirmAssignment = () => {
    if (!assignModalAssessment || selectedClientsToAssign.length === 0) return;

    const newAssignments: AssessmentAssignment[] = selectedClientsToAssign.map((clientName, idx) => {
      const cfg = clientFrequencies[clientName] || { frequency: "Weekly", timeOfDay: "Morning (8:00 AM)" };
      return {
        id: `ASN-${Date.now().toString().slice(-4)}-${idx}`,
        assessmentId: assignModalAssessment.id,
        assessmentAcronym: assignModalAssessment.acronym,
        assessmentTitle: assignModalAssessment.title,
        clientId: `CL-${100 + idx}`,
        clientName,
        therapistName: "Dr. Alex Harrison",
        assignedDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        frequency: cfg.frequency as any,
        status: "Pending",
      };
    });

    setAssignments((prev) => [...newAssignments, ...prev]);
    setAssignModalAssessment(null);
    setAssignStep(1);
    showToast(
      `Successfully assigned ${assignModalAssessment.acronym} to ${selectedClientsToAssign.length} client(s)!`
    );
  };

  // Submission Filter State
  const [submissionFilter, setSubmissionFilter] = useState<'All' | 'High Risk' | 'Moderate' | 'Mild' | 'Minimal'>('All');

  // Trigger Toast Notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Assessments Library
  const filteredAssessments = assessments.filter((ass) => {
    const matchesSearch =
      ass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ass.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ass.targetCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ass.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || ass.category === selectedCategory;
    const matchesType = selectedType === 'All' || ass.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (submissionFilter === 'All') return true;
    if (submissionFilter === 'High Risk') return sub.flaggedRisk || sub.severityLabel.toLowerCase().includes('severe');
    if (submissionFilter === 'Moderate') return sub.severityLabel.toLowerCase().includes('moderate');
    if (submissionFilter === 'Mild') return sub.severityLabel.toLowerCase().includes('mild');
    if (submissionFilter === 'Minimal') return sub.severityLabel.toLowerCase().includes('minimal');
    return true;
  });

  // Interactive Test Simulator Runner
  const handleOpenRunner = (assessment: ClinicalAssessment) => {
    let questionsToUse = assessment.questions;
    if (!questionsToUse || questionsToUse.length === 0) {
      questionsToUse = Array.from({ length: assessment.questionCount || 5 }).map((_, idx) => ({
        id: `gen_${idx + 1}`,
        text: `Diagnostic Item #${idx + 1}: Rate symptom severity for ${assessment.targetCondition}`,
        subtext: 'Over the last 2 weeks, how frequently have you been affected?',
        options: [
          { label: 'Not at all (0)', value: 0 },
          { label: 'Several days (1)', value: 1 },
          { label: 'More than half the days (2)', value: 2 },
          { label: 'Nearly every day (3)', value: 3 }
        ],
        isRiskTrigger: idx === assessment.questionCount - 1
      }));
    }
    const fullAssessmentObj = { ...assessment, questions: questionsToUse };
    setActiveRunnerModal(fullAssessmentObj);
    setRunnerCurrentStep(0);
    setRunnerAnswers({});
    setRunnerCompletedReport(null);
  };

  const calculateResultsWithAnswers = (answersMap: Record<string, number>) => {
    if (!activeRunnerModal || !activeRunnerModal.questions) return;
    let score = 0;
    let flagged = false;

    activeRunnerModal.questions.forEach((q) => {
      const selectedVal = answersMap[q.id] !== undefined ? answersMap[q.id] : 0;
      score += selectedVal;
      if (q.isRiskTrigger && selectedVal > 0) {
        flagged = true;
      }
    });

    const maxScore = activeRunnerModal.questions.reduce((acc, q) => {
      const maxOpt = Math.max(...q.options.map((o) => o.value));
      return acc + maxOpt;
    }, 0);

    let matchedSeverity: AssessmentSeverityRange | null = null;
    if (activeRunnerModal.severityRanges && activeRunnerModal.severityRanges.length > 0) {
      matchedSeverity =
        activeRunnerModal.severityRanges.find((r) => score >= r.minScore && score <= r.maxScore) ||
        activeRunnerModal.severityRanges[activeRunnerModal.severityRanges.length - 1];
    } else {
      const ratio = score / (maxScore || 1);
      if (ratio < 0.25) matchedSeverity = { minScore: 0, maxScore: 5, label: 'Minimal / Low Risk', color: 'bg-emerald-500', clinicalAction: 'No immediate action required.' };
      else if (ratio < 0.5) matchedSeverity = { minScore: 6, maxScore: 10, label: 'Mild Symptom Elevation', color: 'bg-amber-500', clinicalAction: 'Monitor and review at next follow-up.' };
      else if (ratio < 0.75) matchedSeverity = { minScore: 11, maxScore: 15, label: 'Moderate Symptoms', color: 'bg-orange-500', clinicalAction: 'Consider targeted CBT or clinical intervention.' };
      else matchedSeverity = { minScore: 16, maxScore: 30, label: 'Severe Clinical Elevation', color: 'bg-rose-600', clinicalAction: 'Immediate priority clinical assessment indicated.' };
    }

    setRunnerCompletedReport({
      score,
      maxScore,
      severity: matchedSeverity,
      flagged
    });
  };

  const handleRunnerSelectAnswer = (qId: string, val: number) => {
    const newAnswers = { ...runnerAnswers, [qId]: val };
    setRunnerAnswers(newAnswers);

    if (!activeRunnerModal || !activeRunnerModal.questions) return;
    const totalQuestions = activeRunnerModal.questions.length;

    setTimeout(() => {
      setRunnerCurrentStep((currentStep) => {
        if (currentStep < totalQuestions - 1) {
          return currentStep + 1;
        } else {
          calculateResultsWithAnswers(newAnswers);
          return currentStep;
        }
      });
    }, 180);
  };

  return (
    <div className="space-y-6 pb-16 max-w-[1400px] mx-auto">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#5e2be2] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top border border-purple-300">
          <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
          <span className="font-extrabold text-xs tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Clinical Assessment Inventory & Psychometrics"
        description="Monitor standardized scale responses (PHQ-9, GAD-7, PSS-10, PCL-5), track patient risk safety alerts, evaluate progress, and run test simulators."
      />



      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by acronym, condition, title..."
            className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-[#5e2be2]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 px-3 py-1.5 outline-none focus:border-[#5e2be2]"
            >
              <option value="All">All Categories</option>
              <option value="Depression">Depression</option>
              <option value="Anxiety">Anxiety</option>
              <option value="Stress">Stress</option>
              <option value="Trauma">Trauma</option>
              <option value="Wellness">Wellness</option>
              <option value="Substance">Substance</option>
            </select>
          </div>


        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto p-1">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'library'
                ? 'bg-[#5e2be2] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Screener Library ({assessments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all relative ${
              activeTab === 'submissions'
                ? 'bg-[#5e2be2] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Patient Submissions & Risk Alerts</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-2 right-2" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'assignments'
                ? 'bg-[#5e2be2] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Client Assignment Hub ({assignments.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCREENER LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssessments.map((ass) => (
                <div
                  key={ass.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-purple-50 text-[#5e2be2] font-black text-xs rounded-lg border border-purple-100">
                        {ass.acronym}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {ass.questionCount} Items · {ass.estimatedMinutes || 4} mins
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#5e2be2] transition-colors">
                      {ass.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {ass.description}
                    </p>


                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRunner(ass)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-emerald-700" />
                      <span>Run</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAssignModal(ass)}
                      className="px-3 py-1.5 bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Assign</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Instrument</th>
                    <th className="py-4 px-6">Target Condition</th>
                    <th className="py-4 px-6">Items &amp; Time</th>
                    <th className="py-4 px-6">Completions</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.map((ass) => (
                    <tr key={ass.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-purple-50 text-[#5e2be2] font-black text-xs rounded-lg border border-purple-100">
                            {ass.acronym}
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">{ass.title}</span>
                            <span className="text-xs text-slate-400">{ass.authorOrSource || 'Standard'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700 text-xs">{ass.targetCondition}</td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                        {ass.questionCount} Questions ({ass.estimatedMinutes || 4} mins)
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-emerald-600">{ass.timesCompleted} evaluated</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveProtocolModal(ass)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenRunner(ass)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-colors"
                          >
                            Run Test
                          </button>
                          <button
                            type="button"
                            onClick={() => openAssignModal(ass)}
                            className="px-2.5 py-1.5 bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs rounded-xl transition-colors"
                          >
                            Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUBMISSIONS LOG */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Severity:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['All', 'High Risk', 'Moderate', 'Mild', 'Minimal'] as const).map((filterVal) => (
                  <button
                    key={filterVal}
                    type="button"
                    onClick={() => setSubmissionFilter(filterVal)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      submissionFilter === filterVal
                        ? 'bg-[#5e2be2] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filterVal}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-bold text-slate-400">
              Showing {filteredSubmissions.length} evaluation logs
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Instrument</th>
                  <th className="py-4 px-6">Score &amp; Severity</th>
                  <th className="py-4 px-6">Safety Risk</th>
                  <th className="py-4 px-6">Completed Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{sub.clientName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-extrabold text-xs rounded-md border border-slate-200">
                        {sub.assessmentAcronym}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 text-base">{sub.totalScore}/{sub.maxScore}</span>
                    </td>
                    <td className="py-4 px-6">
                      {sub.flaggedRisk ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-800 rounded-md font-black text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> High Risk Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Normal
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 font-semibold">{sub.completedAt}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmissionModal(sub)}
                        className="px-3 py-1.5 bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-bold text-xs rounded-xl transition-colors"
                      >
                        View Answers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Assigned Screener</th>
                  <th className="py-4 px-6">Frequency</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((asn) => (
                  <tr key={asn.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{asn.clientName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-purple-50 text-[#5e2be2] font-black text-xs rounded-md border border-purple-100">
                        {asn.assessmentAcronym}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700 text-xs">{asn.frequency}</td>
                    <td className="py-4 px-6 font-semibold text-slate-700 text-xs">{asn.dueDate}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-extrabold ${
                        asn.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {asn.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Reminder sent to ${asn.clientName}!`);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        Remind
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Protocol Details Modal */}
      {activeProtocolModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-xl w-full shadow-2xl space-y-5 animate-in fade-in-0 zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 bg-purple-50 text-[#5e2be2] font-black text-xs rounded-md border border-purple-100">
                  {activeProtocolModal.acronym}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{activeProtocolModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProtocolModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {activeProtocolModal.description}
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Target Condition:</span>
                <span className="font-extrabold text-slate-800">{activeProtocolModal.targetCondition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Item Count:</span>
                <span className="font-extrabold text-slate-800">{activeProtocolModal.questionCount} Questions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Psychometric Reliability:</span>
                <span className="font-extrabold text-slate-800">{activeProtocolModal.validityScore || 'Validated Scale'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveProtocolModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = activeProtocolModal;
                  setActiveProtocolModal(null);
                  handleOpenRunner(target);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl"
              >
                Run Test Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Simulator Runner Modal */}
      {activeRunnerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-2xl w-full shadow-2xl space-y-6 border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-md">
                  SIMULATOR MODE · {activeRunnerModal.acronym}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{activeRunnerModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveRunnerModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!runnerCompletedReport ? (
              <div className="space-y-5">
                {activeRunnerModal.questions && activeRunnerModal.questions.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
                      <span>Question {runnerCurrentStep + 1} of {activeRunnerModal.questions.length}</span>
                      <span>Progress {Math.round(((runnerCurrentStep + 1) / activeRunnerModal.questions.length) * 100)}%</span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 mb-1">
                      {activeRunnerModal.questions[runnerCurrentStep].text}
                    </h4>
                    {activeRunnerModal.questions[runnerCurrentStep].subtext && (
                      <p className="text-xs text-slate-400 font-medium mb-4">
                        {activeRunnerModal.questions[runnerCurrentStep].subtext}
                      </p>
                    )}

                    <div className="space-y-2 mt-4">
                      {activeRunnerModal.questions[runnerCurrentStep].options.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleRunnerSelectAnswer(activeRunnerModal.questions![runnerCurrentStep].id, opt.value)}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                            runnerAnswers[activeRunnerModal.questions![runnerCurrentStep].id] === opt.value
                              ? 'bg-[#5e2be2] text-white border-[#5e2be2] shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {runnerAnswers[activeRunnerModal.questions![runnerCurrentStep].id] === opt.value && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 text-center space-y-2">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Simulator Evaluation Results</span>
                  <div className="text-3xl font-black text-slate-900">
                    {runnerCompletedReport.score} / {runnerCompletedReport.maxScore} Points
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-extrabold ${runnerCompletedReport.severity?.color || 'bg-purple-600'} text-white`}>
                    {runnerCompletedReport.severity?.label}
                  </span>
                  <p className="text-xs text-slate-600 mt-2 font-medium">
                    Clinical Action: <strong>{runnerCompletedReport.severity?.clinicalAction}</strong>
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveRunnerModal(null)}
                    className="px-5 py-2.5 bg-[#5e2be2] text-white font-extrabold text-xs rounded-xl shadow-md"
                  >
                    Finish Test Simulation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assign Assessment & Select Frequency Multi-Step Modal */}
      {assignModalAssessment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-5">
            {/* Header with Step Indicator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {assignStep === 1 ? "1. Select Client(s)" : "2. Select Assessment Frequency"}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {assignStep === 1
                    ? `Choose which client(s) will receive "${assignModalAssessment.title}".`
                    : `Configure individual assessment frequencies for each assigned client.`}
                </p>
              </div>
              <span className="text-xs font-extrabold text-[#5e2be2] bg-purple-50 px-3 py-1 rounded-full border border-purple-100 shrink-0">
                Step {assignStep} of 2
              </span>
            </div>

            {/* STEP 1: Select Client(s) */}
            {assignStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Clients ({selectedClientsToAssign.length} selected)
                  </span>
                  <button
                    type="button"
                    onClick={toggleSelectAllClients}
                    className="text-xs font-bold text-[#5e2be2] hover:underline cursor-pointer"
                  >
                    {selectedClientsToAssign.length === CLIENT_LIST.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {CLIENT_LIST.map((client) => {
                    const isChecked = selectedClientsToAssign.includes(client);
                    return (
                      <div
                        key={client}
                        onClick={() => toggleClientSelection(client)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-purple-50/80 border-[#5e2be2]/40 text-[#5e2be2] font-semibold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isChecked
                                ? "bg-[#5e2be2] border-[#5e2be2] text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-semibold">{client}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Configure Per-Client Frequency & Schedule */}
            {assignStep === 2 && (
              <div className="space-y-4">
                {/* Bulk Shortcut Bar */}
                <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Quick Bulk Apply:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Daily", "2-3 Times / Week", "Weekly", "As Needed (PRN)"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => applyFrequencyToAll(f)}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white hover:bg-purple-50 text-slate-700 hover:text-[#5e2be2] border border-slate-200 hover:border-[#5e2be2]/30 transition-colors cursor-pointer"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per-Client Frequency Configuration List */}
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {selectedClientsToAssign.map((clientName) => {
                    const currentConfig = clientFrequencies[clientName] || {
                      frequency: "Weekly",
                      timeOfDay: "Morning (8:00 AM)",
                    };
                    const initials = clientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("");

                    return (
                      <div
                        key={clientName}
                        className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-sm hover:border-purple-200 transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-100 text-[#5e2be2] font-bold flex items-center justify-center text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-tight">{clientName}</p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Individual Schedule</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-[#5e2be2] border border-purple-100">
                            {currentConfig.frequency}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Frequency
                            </label>
                            <select
                              value={currentConfig.frequency}
                              onChange={(e) => updateClientFrequency(clientName, e.target.value)}
                              className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5e2be2] focus:outline-none"
                            >
                              {FREQUENCY_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              Preferred Time
                            </label>
                            <select
                              value={currentConfig.timeOfDay}
                              onChange={(e) => updateClientTimeOfDay(clientName, e.target.value)}
                              className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5e2be2] focus:outline-none"
                            >
                              {TIME_OPTIONS.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAssignModalAssessment(null);
                  setAssignStep(1);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {assignStep === 2 && (
                  <button
                    type="button"
                    onClick={() => setAssignStep(1)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                  >
                    Back
                  </button>
                )}

                {assignStep === 1 ? (
                  <button
                    type="button"
                    disabled={selectedClientsToAssign.length === 0}
                    onClick={() => setAssignStep(2)}
                    className="px-5 py-2.5 bg-[#5e2be2] hover:bg-[#4f28d9] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: Configure Schedule</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmAssignment}
                    className="px-5 py-2.5 bg-[#5e2be2] hover:bg-[#4f28d9] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Confirm Assignment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Breakdown Modal */}
      {selectedSubmissionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-xl w-full shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 bg-purple-50 text-[#5e2be2] font-black text-xs rounded-md">
                  {selectedSubmissionModal.assessmentAcronym}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedSubmissionModal.clientName}</h3>
                <span className="text-xs text-slate-400 font-medium">Completed on {selectedSubmissionModal.completedAt}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmissionModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Evaluation Score</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {selectedSubmissionModal.totalScore} / {selectedSubmissionModal.maxScore}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-md text-xs font-extrabold ${selectedSubmissionModal.severityColor}`}>
                {selectedSubmissionModal.severityLabel}
              </span>
            </div>

            {selectedSubmissionModal.answers.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Item Responses</span>
                {selectedSubmissionModal.answers.map((ans, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                    <span className="font-medium text-slate-800">{ans.questionText}</span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">{ans.answerLabel}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSubmissionModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
