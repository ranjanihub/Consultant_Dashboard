import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { htmlChunkPagesTable, htmlChunkRevisionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

// Helper to validate identifier URL slug: unique, no spaces, lowercase, numbers, hyphens
export function validateIdentifierUrl(slug: string): { valid: boolean; message?: string } {
  if (!slug) {
    return { valid: false, message: "Identifier URL is required." };
  }
  if (/\s/.test(slug)) {
    return { valid: false, message: "Identifier URL cannot contain spaces." };
  }
  const validRegex = /^[a-z0-9-]+$/;
  if (!validRegex.test(slug)) {
    return { valid: false, message: "Identifier URL can only contain lowercase letters, numbers, and hyphens (-)." };
  }
  return { valid: true };
}

// Initial sample data if database table is empty
const SAMPLE_PAGES = [
  {
    id: 1,
    title: "Career Guidance",
    identifierUrl: "career-guidance",
    status: "published",
    seoDetails: {
      metaTitle: "Career Guidance & Professional Counseling | Hexpertify",
      metaDescription: "Transform your career path with personalized clinical psychology and professional guidance.",
      metaKeywords: "career guidance, professional growth, mentorship, hexpertify",
      canonicalUrl: "https://hexpertify.com/career-guidance",
      ogTitle: "Career Guidance | Hexpertify",
      ogDescription: "Expert career counseling anytime, anywhere.",
      ogImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
      ogAltText: "Career guidance workspace",
      robotsIndexing: "index, follow",
    },
    chunks: [
      {
        id: "chunk-hero-1",
        name: "Hero Header",
        type: "hero",
        order: 1,
        content: `
          <div class="bg-gradient-to-r from-teal-600 to-indigo-700 text-white py-16 px-8 rounded-2xl text-center shadow-lg my-4">
            <h1 class="text-4xl font-extrabold tracking-tight mb-4">Empower Your Professional Journey</h1>
            <p class="text-lg opacity-90 max-w-2xl mx-auto mb-6">Discover evidence-based career counseling and cognitive development tailored to your personal goals.</p>
            <a href="#book" class="inline-block bg-white text-teal-700 font-bold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition">Book a Consultation</a>
          </div>
        `,
      },
      {
        id: "chunk-feature-1",
        name: "Key Benefits",
        type: "feature",
        order: 2,
        content: `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div class="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">01</div>
              <h3 class="text-xl font-bold mb-2">Personalized Roadmap</h3>
              <p class="text-gray-600 text-sm">Tailored assessments to map out actionable career milestones.</p>
            </div>
            <div class="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">02</div>
              <h3 class="text-xl font-bold mb-2">Leadership Skills</h3>
              <p class="text-gray-600 text-sm">Build emotional intelligence and resilience in corporate environments.</p>
            </div>
            <div class="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xl mb-4">03</div>
              <h3 class="text-xl font-bold mb-2">1-on-1 Mentorship</h3>
              <p class="text-gray-600 text-sm">Direct access to certified experts with ongoing feedback.</p>
            </div>
          </div>
        `,
      },
    ],
    createdBy: "Dr. Alex Harrison",
    lastModifiedBy: "Dr. Alex Harrison",
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-25T11:00:00.000Z",
  },
  {
    id: 2,
    title: "Corporate Training",
    identifierUrl: "corporate-training",
    status: "published",
    seoDetails: {
      metaTitle: "Enterprise Corporate Mental Health & Wellness | Hexpertify",
      metaDescription: "Scalable mental wellness programs for corporate teams.",
      metaKeywords: "corporate training, mental health, wellness workshops",
      canonicalUrl: "https://hexpertify.com/corporate-training",
      ogTitle: "Corporate Training Solutions",
      ogDescription: "Boost workplace productivity and psychological safety.",
      ogImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200",
      ogAltText: "Corporate workshop session",
      robotsIndexing: "index, follow",
    },
    chunks: [
      {
        id: "chunk-hero-2",
        name: "Corporate Hero",
        type: "hero",
        order: 1,
        content: `
          <div class="bg-slate-900 text-white py-16 px-8 rounded-2xl text-center shadow-xl my-4">
            <span class="bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase px-3 py-1 rounded-full tracking-wider border border-teal-500/30">Enterprise Programs</span>
            <h1 class="text-4xl font-extrabold tracking-tight mt-4 mb-4">Build Resilient & High-Performing Teams</h1>
            <p class="text-lg opacity-80 max-w-2xl mx-auto mb-6">Science-backed corporate wellness workshops and executive coaching solutions.</p>
          </div>
        `,
      },
    ],
    createdBy: "Sarah Wilson",
    lastModifiedBy: "Dr. Alex Harrison",
    createdAt: "2026-07-22T09:30:00.000Z",
    updatedAt: "2026-07-24T14:15:00.000Z",
  },
  {
    id: 3,
    title: "Privacy Policy",
    identifierUrl: "privacy-policy",
    status: "draft",
    seoDetails: {
      metaTitle: "Privacy Policy | Hexpertify",
      metaDescription: "Our commitment to data protection, privacy, and confidentiality.",
      metaKeywords: "privacy policy, data protection, confidentiality",
      canonicalUrl: "https://hexpertify.com/privacy-policy",
      ogTitle: "Privacy Policy",
      ogDescription: "Hexpertify privacy commitment.",
      robotsIndexing: "noindex, follow",
    },
    chunks: [
      {
        id: "chunk-text-1",
        name: "Policy Overview",
        type: "text",
        order: 1,
        content: `
          <div class="prose max-w-4xl mx-auto py-8">
            <h2 class="text-2xl font-bold mb-4">Hexpertify Privacy Policy</h2>
            <p class="mb-4 text-gray-700 leading-relaxed">At Hexpertify, we prioritize patient confidentiality, HIPAA compliance, and data encryption. This policy outlines how personal and session data is handled.</p>
          </div>
        `,
      },
    ],
    createdBy: "Admin",
    lastModifiedBy: "Admin",
    createdAt: "2026-07-24T08:00:00.000Z",
    updatedAt: "2026-07-24T08:00:00.000Z",
  },
  {
    id: 4,
    title: "Consultant Details",
    identifierUrl: "consultant-details",
    status: "published",
    seoDetails: {
      metaTitle: "Dr. Sarah Jenkins | Hexpertify Consultant Details",
      metaDescription: "Book a clinical consultation with Dr. Sarah Jenkins, Ph.D., Senior Clinical Psychologist & Executive Performance Coach.",
      metaKeywords: "consultant details, clinical psychology, executive coaching, hexpertify",
      canonicalUrl: "https://hexpertify.com/consultant-details",
      ogTitle: "Dr. Sarah Jenkins | Hexpertify Consultant",
      ogDescription: "Book 1-on-1 online or in-person consultations with leading clinical specialists.",
      ogImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200",
      ogAltText: "Dr. Sarah Jenkins Profile",
      robotsIndexing: "index, follow",
    },
    chunks: [
      {
        id: "chunk-hero-consultant",
        name: "1. Hero Section",
        type: "hero",
        order: 1,
        content: `
          <div class="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-indigo-800/40 relative overflow-hidden my-4">
            <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
              <div class="relative group">
                <div class="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-indigo-950 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80" alt="Dr. Sarah Jenkins" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <span class="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full border-2 border-slate-900 flex items-center gap-1 shadow-lg">
                  <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> Available Today
                </span>
              </div>
              <div class="flex-1 text-center md:text-left space-y-4">
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span class="bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-400/30">Verified Senior Specialist</span>
                  <span class="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-400/30">Online & In-Person</span>
                </div>
                <div>
                  <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Dr. Sarah Jenkins, Ph.D.</h1>
                  <p class="text-purple-200 text-lg font-medium mt-1">Senior Clinical Psychologist & Executive Performance Coach</p>
                  <p class="text-slate-400 text-sm mt-1">Hexpertify Mental Health & Corporate Leadership Advisory</p>
                </div>
                <div class="flex flex-wrap items-center justify-center md:justify-start gap-6 py-2 border-y border-indigo-800/50 text-sm text-slate-300">
                  <div class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg><span class="font-bold text-white">4.9</span> <span class="text-slate-400">(128 Client Reviews)</span></div>
                  <div class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span class="font-bold text-white">12+ Years</span> Exp.</div>
                  <div class="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span class="text-slate-300">San Francisco, CA (Virtual Worldwide)</span></div>
                </div>
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div>
                    <span class="text-xs text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
                    <span class="text-3xl font-extrabold text-white">₹2,499 <span class="text-sm font-normal text-slate-300">/ 50-min session</span></span>
                  </div>
                  <div class="flex items-center gap-3 w-full sm:w-auto">
                    <a href="#book-consultation" class="flex-1 sm:flex-none text-center bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition duration-200">Book Consultation</a>
                    <a href="#contact-consultant" class="flex-1 sm:flex-none text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl transition duration-200">Contact Specialist</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-about-consultant",
        name: "2. About Consultant",
        type: "text",
        order: 2,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">About Dr. Sarah Jenkins</h2>
                <p class="text-xs text-gray-500">Professional background, education & career summary</p>
              </div>
            </div>
            <div class="space-y-6 text-gray-700 leading-relaxed text-sm">
              <p>
                Dr. Sarah Jenkins is a board-certified Clinical Psychologist and Executive Performance Consultant with over 12 years of specialized clinical experience. She empowers individuals, corporate executives, and high-performing teams to master emotional resilience, overcome workplace burnout, and navigate complex behavioral challenges.
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
                <div>
                  <h4 class="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                    Education & Credentials
                  </h4>
                  <ul class="space-y-2 text-xs text-gray-600">
                    <li class="flex items-start gap-2"><span>•</span><span><strong>Ph.D. in Clinical Psychology</strong> - Stanford University</span></li>
                    <li class="flex items-start gap-2"><span>•</span><span><strong>M.S. in Cognitive Neuroscience</strong> - UC Berkeley</span></li>
                    <li class="flex items-start gap-2"><span>•</span><span><strong>B.A. in Psychology (Honors)</strong> - UCLA</span></li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15l-2 5l9-9l-9-9l2 5l-7 4z"/></svg>
                    Certifications & Accreditation
                  </h4>
                  <ul class="space-y-2 text-xs text-gray-600">
                    <li class="flex items-start gap-2"><span>•</span><span><strong>Licensed Clinical Psychologist (LCP)</strong> - License #CP-40291</span></li>
                    <li class="flex items-start gap-2"><span>•</span><span><strong>Board Certified Executive Coach (BCC)</strong> - International Coaching Federation</span></li>
                    <li class="flex items-start gap-2"><span>•</span><span><strong>Advanced CBT & EMDR Specialist</strong> - American Psychological Association</span></li>
                  </ul>
                </div>
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-sm mb-2">Key Career Achievements</h4>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                  <li class="flex items-center gap-2 p-3 bg-purple-50/60 rounded-lg border border-purple-100">
                    <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Published 15+ peer-reviewed articles on workplace resilience.</span>
                  </li>
                  <li class="flex items-center gap-2 p-3 bg-purple-50/60 rounded-lg border border-purple-100">
                    <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Advised 40+ Fortune 500 leadership teams on mental wellness.</span>
                  </li>
                  <li class="flex items-center gap-2 p-3 bg-purple-50/60 rounded-lg border border-purple-100">
                    <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Keynote speaker at the National Mental Health Summit 2024.</span>
                  </li>
                  <li class="flex items-center gap-2 p-3 bg-purple-50/60 rounded-lg border border-purple-100">
                    <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>Over 2,500+ successful individual therapy hours completed.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-expertise-consultant",
        name: "3. Areas of Expertise",
        type: "feature",
        order: 3,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Areas of Expertise</h2>
              <p class="text-xs text-gray-500 mt-1">Specialized clinical disciplines & professional consultation domains</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-5 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-purple-200 transition duration-200">
                <div class="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">01</div>
                <h3 class="font-bold text-gray-900 text-base mb-1">Cognitive Behavioral Therapy (CBT)</h3>
                <p class="text-xs text-gray-600 leading-relaxed">Evidence-based cognitive restructuring to overcome anxiety, depression, and obsessive thought cycles.</p>
              </div>
              <div class="p-5 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-purple-200 transition duration-200">
                <div class="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3">02</div>
                <h3 class="font-bold text-gray-900 text-base mb-1">Executive Leadership Coaching</h3>
                <p class="text-xs text-gray-600 leading-relaxed">High-performance psychological strategies for C-suite executives, founders, and team managers.</p>
              </div>
              <div class="p-5 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-purple-200 transition duration-200">
                <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">03</div>
                <h3 class="font-bold text-gray-900 text-base mb-1">Stress & Burnout Recovery</h3>
                <p class="text-xs text-gray-600 leading-relaxed">Targeted interventions to restore nervous system balance and prevent corporate fatigue.</p>
              </div>
              <div class="p-5 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-purple-200 transition duration-200">
                <div class="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">04</div>
                <h3 class="font-bold text-gray-900 text-base mb-1">Interpersonal Communication</h3>
                <p class="text-xs text-gray-600 leading-relaxed">Enhancing relationship dynamics, boundary setting, and workplace conflict resolution.</p>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-services-consultant",
        name: "4. Services Offered",
        type: "custom",
        order: 4,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Services Offered</h2>
                <p class="text-xs text-gray-500">Tailored consultation sessions and therapy packages</p>
              </div>
              <span class="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100 self-start sm:self-auto">Instant Booking Available</span>
            </div>
            <div class="space-y-4">
              <div class="p-5 rounded-xl border border-gray-200 hover:border-purple-300 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition duration-200">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <h3 class="font-bold text-gray-900 text-base">Individual Clinical Consultation</h3>
                    <span class="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Most Popular</span>
                  </div>
                  <p class="text-xs text-gray-600 max-w-xl">One-on-one confidential therapy focusing on anxiety management, personal goal alignment, and psychological resilience.</p>
                  <div class="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 50 Minutes</span>
                    <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> Video / Audio</span>
                  </div>
                </div>
                <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div class="text-right">
                    <span class="text-2xl font-extrabold text-gray-900">₹2,499</span>
                    <span class="block text-[10px] text-gray-400">per session</span>
                  </div>
                  <a href="#book-consultation" class="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition">Book Now</a>
                </div>
              </div>

              <div class="p-5 rounded-xl border border-gray-200 hover:border-purple-300 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition duration-200">
                <div class="space-y-1">
                  <h3 class="font-bold text-gray-900 text-base">Executive Leadership & Mindset Coaching</h3>
                  <p class="text-xs text-gray-600 max-w-xl">Deep-dive coaching designed for corporate leaders, founders, and high-impact professionals seeking stress management and mental clarity.</p>
                  <div class="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 75 Minutes</span>
                    <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> Video Consultation</span>
                  </div>
                </div>
                <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div class="text-right">
                    <span class="text-2xl font-extrabold text-gray-900">₹4,499</span>
                    <span class="block text-[10px] text-gray-400">per session</span>
                  </div>
                  <a href="#book-consultation" class="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition">Book Now</a>
                </div>
              </div>

              <div class="p-5 rounded-xl border border-gray-200 hover:border-purple-300 bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition duration-200">
                <div class="space-y-1">
                  <h3 class="font-bold text-gray-900 text-base">Corporate Team Burnout Workshop</h3>
                  <p class="text-xs text-gray-600 max-w-xl">Group interactive session for enterprise teams to build emotional intelligence, psychological safety, and burnout prevention protocols.</p>
                  <div class="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 120 Minutes</span>
                    <span class="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Group Workshop</span>
                  </div>
                </div>
                <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div class="text-right">
                    <span class="text-2xl font-extrabold text-gray-900">₹12,999</span>
                    <span class="block text-[10px] text-gray-400">group package</span>
                  </div>
                  <a href="#contact-consultant" class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition">Inquire</a>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-experience-consultant",
        name: "5. Experience",
        type: "custom",
        order: 5,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Professional Work Experience</h2>
              <p class="text-xs text-gray-500 mt-1">Career timeline and institutional affiliations</p>
            </div>
            <div class="relative border-l-2 border-purple-200 ml-4 space-y-6">
              <div class="relative pl-6">
                <span class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-purple-100"></span>
                <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <h3 class="font-bold text-gray-900 text-sm">Lead Clinical Psychologist & Advisory Board Member</h3>
                  <span class="text-xs font-semibold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">2021 - Present</span>
                </div>
                <p class="text-xs font-medium text-purple-700 mb-2">Hexpertify Health & Wellness Advisory</p>
                <p class="text-xs text-gray-600 leading-relaxed">Directing high-impact executive wellness consultations and managing cognitive performance roadmaps for enterprise clients globally.</p>
              </div>
              <div class="relative pl-6">
                <span class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></span>
                <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <h3 class="font-bold text-gray-900 text-sm">Senior Consultant & Behavioral Specialist</h3>
                  <span class="text-xs text-gray-500">2017 - 2021</span>
                </div>
                <p class="text-xs font-medium text-gray-700 mb-2">Pacific Behavioral Health Center, San Francisco</p>
                <p class="text-xs text-gray-600 leading-relaxed">Led outpatient CBT programs, specialized in panic disorder recovery, and mentored clinical psychology interns.</p>
              </div>
              <div class="relative pl-6">
                <span class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></span>
                <div class="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <h3 class="font-bold text-gray-900 text-sm">Clinical Psychology Fellow</h3>
                  <span class="text-xs text-gray-500">2014 - 2017</span>
                </div>
                <p class="text-xs font-medium text-gray-700 mb-2">Stanford University Medical Center</p>
                <p class="text-xs text-gray-600 leading-relaxed">Conducted clinical trials on stress resilience, biofeedback therapy, and neuro-cognitive assessments.</p>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-industries-consultant",
        name: "6. Industries Served",
        type: "custom",
        order: 6,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-5">
              <h2 class="text-xl font-bold text-gray-900">Industries Served</h2>
              <p class="text-xs text-gray-500 mt-1">Cross-sector corporate advisory and consultation domain expertise</p>
            </div>
            <div class="flex flex-wrap gap-3">
              <div class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-gray-800 text-xs font-semibold hover:border-purple-300 hover:bg-purple-50/50 transition">
                <span class="w-2 h-2 rounded-full bg-purple-600"></span> Healthcare & Lifesciences
              </div>
              <div class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-gray-800 text-xs font-semibold hover:border-purple-300 hover:bg-purple-50/50 transition">
                <span class="w-2 h-2 rounded-full bg-indigo-600"></span> Technology & SaaS Enterprise
              </div>
              <div class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-gray-800 text-xs font-semibold hover:border-purple-300 hover:bg-purple-50/50 transition">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span> Banking & Financial Services
              </div>
              <div class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-gray-800 text-xs font-semibold hover:border-purple-300 hover:bg-purple-50/50 transition">
                <span class="w-2 h-2 rounded-full bg-amber-600"></span> Higher Education & Research
              </div>
              <div class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-gray-800 text-xs font-semibold hover:border-purple-300 hover:bg-purple-50/50 transition">
                <span class="w-2 h-2 rounded-full bg-rose-600"></span> Legal & Professional Services
              </div>
              <div class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-slate-50 text-gray-800 text-xs font-semibold hover:border-purple-300 hover:bg-purple-50/50 transition">
                <span class="w-2 h-2 rounded-full bg-blue-600"></span> Non-Profit & Public Sector
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-skills-consultant",
        name: "7. Skills",
        type: "custom",
        order: 7,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Skills & Competencies</h2>
              <p class="text-xs text-gray-500 mt-1">Core clinical techniques and leadership proficiencies</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Cognitive Behavioral Therapy (CBT)</span>
                  <span class="text-purple-600">98%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-purple-600 rounded-full" style="width: 98%;"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Executive Coaching & Leadership Mindset</span>
                  <span class="text-purple-600">95%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-purple-600 rounded-full" style="width: 95%;"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Crisis Intervention & Biofeedback</span>
                  <span class="text-purple-600">92%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-purple-600 rounded-full" style="width: 92%;"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex justify-between text-xs font-semibold text-gray-800">
                  <span>Workplace Burnout Prevention</span>
                  <span class="text-purple-600">96%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-purple-600 rounded-full" style="width: 96%;"></div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-portfolio-consultant",
        name: "8. Portfolio & Case Studies",
        type: "custom",
        order: 8,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Portfolio & Case Studies</h2>
              <p class="text-xs text-gray-500 mt-1">Demonstrated client outcomes and successful intervention stories</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div class="p-5 rounded-xl border border-gray-200 bg-slate-50 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Corporate SaaS Case</span>
                  <h3 class="font-bold text-gray-900 text-sm mt-3 mb-2">Enterprise Executive Resilience Transformation</h3>
                  <p class="text-xs text-gray-600 leading-relaxed">Designed a 6-month mindfulness and burnout prevention program for 120 tech leaders, yielding a 35% reduction in employee stress scores.</p>
                </div>
                <div class="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span class="font-bold text-emerald-700">Outcome: +40% Retention</span>
                  <span class="text-gray-400">2024</span>
                </div>
              </div>

              <div class="p-5 rounded-xl border border-gray-200 bg-slate-50 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Individual Therapy</span>
                  <h3 class="font-bold text-gray-900 text-sm mt-3 mb-2">High-Anxiety Panic Disorder Recovery</h3>
                  <p class="text-xs text-gray-600 leading-relaxed">Utilized 12 targeted CBT sessions to assist a senior executive in regaining full workplace confidence following panic attacks.</p>
                </div>
                <div class="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span class="font-bold text-emerald-700">Outcome: 100% Symptoms Resolved</span>
                  <span class="text-gray-400">2023</span>
                </div>
              </div>

              <div class="p-5 rounded-xl border border-gray-200 bg-slate-50 flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Healthcare Advisory</span>
                  <h3 class="font-bold text-gray-900 text-sm mt-3 mb-2">Physician Psychological Safety Protocol</h3>
                  <p class="text-xs text-gray-600 leading-relaxed">Implemented a peer support framework for medical staff in high-volume emergency wards, significantly boosting morale.</p>
                </div>
                <div class="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                  <span class="font-bold text-emerald-700">Outcome: 4.8/5 Staff Satisfaction</span>
                  <span class="text-gray-400">2024</span>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-testimonials-consultant",
        name: "9. Testimonials",
        type: "testimonial",
        order: 9,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Client Testimonials</h2>
              <p class="text-xs text-gray-500 mt-1">Verified feedback from patients and executive mentees</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="p-5 rounded-xl border border-gray-100 bg-slate-50/80 space-y-3 relative">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1 text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </div>
                  <span class="text-[10px] text-gray-400 font-semibold uppercase">Verified Client</span>
                </div>
                <p class="text-xs text-gray-700 italic leading-relaxed">
                  "Working with Dr. Sarah Jenkins completely turned around my career transition. Her structured CBT sessions gave me concrete tools to tackle high-pressure burnout."
                </p>
                <div class="flex items-center gap-3 pt-2">
                  <div class="w-8 h-8 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center text-xs">RK</div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-xs">Rohan K.</h4>
                    <p class="text-[10px] text-gray-500">VP of Engineering • Tech Industry</p>
                  </div>
                </div>
              </div>

              <div class="p-5 rounded-xl border border-gray-100 bg-slate-50/80 space-y-3 relative">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1 text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </div>
                  <span class="text-[10px] text-gray-400 font-semibold uppercase">Verified Client</span>
                </div>
                <p class="text-xs text-gray-700 italic leading-relaxed">
                  "Empathetic, incredibly knowledgeable, and deeply perceptive. Dr. Jenkins helped me navigate severe imposter syndrome with compassionate professionalism."
                </p>
                <div class="flex items-center gap-3 pt-2">
                  <div class="w-8 h-8 rounded-full bg-indigo-200 text-indigo-800 font-bold flex items-center justify-center text-xs">AM</div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-xs">Ananya M.</h4>
                    <p class="text-[10px] text-gray-500">Healthcare Founder & Surgeon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-faq-consultant",
        name: "10. FAQs Accordion",
        type: "faq",
        order: 10,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p class="text-xs text-gray-500 mt-1">Common queries regarding consultation sessions, privacy & scheduling</p>
            </div>
            <div class="space-y-4">
              <details class="group p-4 rounded-xl border border-gray-200 bg-slate-50/50 [&_summary::-webkit-details-marker]:hidden">
                <summary class="flex items-center justify-between cursor-pointer font-bold text-gray-900 text-sm">
                  <span>How do I prepare for my first 1-on-1 consultation?</span>
                  <span class="transition group-open:rotate-180 text-purple-600 font-bold">+</span>
                </summary>
                <p class="text-xs text-gray-600 mt-3 leading-relaxed border-t border-gray-200/60 pt-3">
                  Ensure you have a quiet, private space with a stable internet connection. You will receive an automated video link 15 minutes prior to the appointment. Feel free to list key topics or goals you would like to address.
                </p>
              </details>

              <details class="group p-4 rounded-xl border border-gray-200 bg-slate-50/50 [&_summary::-webkit-details-marker]:hidden">
                <summary class="flex items-center justify-between cursor-pointer font-bold text-gray-900 text-sm">
                  <span>Are all session details and health records strictly confidential?</span>
                  <span class="transition group-open:rotate-180 text-purple-600 font-bold">+</span>
                </summary>
                <p class="text-xs text-gray-600 mt-3 leading-relaxed border-t border-gray-200/60 pt-3">
                  Yes, absolute confidentiality is guaranteed under strict HIPAA compliance guidelines and APA ethical codes. No session details are shared with employers or external third parties.
                </p>
              </details>

              <details class="group p-4 rounded-xl border border-gray-200 bg-slate-50/50 [&_summary::-webkit-details-marker]:hidden">
                <summary class="flex items-center justify-between cursor-pointer font-bold text-gray-900 text-sm">
                  <span>What is the cancellation and rescheduling policy?</span>
                  <span class="transition group-open:rotate-180 text-purple-600 font-bold">+</span>
                </summary>
                <p class="text-xs text-gray-600 mt-3 leading-relaxed border-t border-gray-200/60 pt-3">
                  You can reschedule or cancel your consultation up to 24 hours before the session without any fee directly from your Hexpertify client dashboard.
                </p>
              </details>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-availability-consultant",
        name: "11. Availability",
        type: "custom",
        order: 11,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Weekly Availability & Consultation Modes</h2>
              <p class="text-xs text-gray-500 mt-1">Operating hours and available session formats</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-slate-50 p-5 rounded-xl border border-gray-200 space-y-3">
                <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Weekly Schedule (Timezone: IST / GMT+5:30)
                </h3>
                <ul class="space-y-2 text-xs">
                  <li class="flex justify-between text-gray-700"><span>Monday - Friday</span><span class="font-bold text-gray-900">09:00 AM - 06:00 PM</span></li>
                  <li class="flex justify-between text-gray-700"><span>Saturday</span><span class="font-bold text-gray-900">10:00 AM - 02:00 PM</span></li>
                  <li class="flex justify-between text-gray-400"><span>Sunday</span><span class="font-semibold text-rose-500">Closed (Emergency Only)</span></li>
                </ul>
              </div>
              <div class="bg-slate-50 p-5 rounded-xl border border-gray-200 space-y-3">
                <h3 class="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                  Consultation Formats Supported
                </h3>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="p-2.5 bg-white rounded-lg border border-gray-200 font-semibold text-gray-800 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> HD Video Call
                  </div>
                  <div class="p-2.5 bg-white rounded-lg border border-gray-200 font-semibold text-gray-800 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span> Audio Session
                  </div>
                  <div class="p-2.5 bg-white rounded-lg border border-gray-200 font-semibold text-gray-800 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-purple-500"></span> In-Clinic Visit
                  </div>
                  <div class="p-2.5 bg-white rounded-lg border border-gray-200 font-semibold text-gray-800 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span> Secure Messaging
                  </div>
                </div>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-booking-card-consultant",
        name: "12. Sticky Booking Card",
        type: "cta",
        order: 12,
        content: `
          <div id="book-consultation" class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/40 my-6 sticky top-20 z-20">
            <div class="flex items-center justify-between border-b border-indigo-800/60 pb-4 mb-4">
              <div>
                <span class="text-[10px] text-purple-300 uppercase tracking-widest font-bold block">Consultation Fee</span>
                <span class="text-3xl font-extrabold text-white">₹2,499</span>
                <span class="text-xs text-slate-300 font-normal"> / 50-min session</span>
              </div>
              <span class="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">Next Slot: 4:00 PM</span>
            </div>
            <div class="space-y-3 mb-6">
              <div class="text-xs text-slate-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                Instant Booking Confirmation
              </div>
              <div class="text-xs text-slate-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                100% HIPAA Confidential & Encrypted
              </div>
              <div class="text-xs text-slate-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                Free Rescheduling up to 24 hours prior
              </div>
            </div>
            <div class="space-y-3">
              <button onclick="alert('Proceeding to consultation checkout...')" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg transition duration-200">
                Book Consultation Now
              </button>
              <button id="contact-consultant" onclick="alert('Opening direct consultant message dialog...')" class="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs py-2.5 rounded-xl transition duration-200">
                Send Message to Specialist
              </button>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-related-consultant",
        name: "13. Related Consultants",
        type: "feature",
        order: 13,
        content: `
          <div class="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm my-6">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-gray-900">Related Consultants</h2>
              <p class="text-xs text-gray-500 mt-1">Explore other certified specialists in clinical psychology & coaching</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div class="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition text-center space-y-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" alt="Dr. Maya Lin" class="w-20 h-20 rounded-full object-cover mx-auto border-2 border-purple-200 shadow">
                <div>
                  <h3 class="font-bold text-gray-900 text-sm">Dr. Maya Lin</h3>
                  <p class="text-[11px] text-purple-700 font-medium">Neuropsychologist</p>
                  <p class="text-[10px] text-gray-500">8+ Years Experience</p>
                </div>
                <div class="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold">
                  <span>★ 4.8</span> <span class="text-gray-400 font-normal">(94 reviews)</span>
                </div>
                <button class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-lg transition">View Profile</button>
              </div>

              <div class="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition text-center space-y-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" alt="Dr. Marcus Vance" class="w-20 h-20 rounded-full object-cover mx-auto border-2 border-purple-200 shadow">
                <div>
                  <h3 class="font-bold text-gray-900 text-sm">Dr. Marcus Vance</h3>
                  <p class="text-[11px] text-purple-700 font-medium">Executive Leadership Coach</p>
                  <p class="text-[10px] text-gray-500">15+ Years Experience</p>
                </div>
                <div class="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold">
                  <span>★ 5.0</span> <span class="text-gray-400 font-normal">(160 reviews)</span>
                </div>
                <button class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-lg transition">View Profile</button>
              </div>

              <div class="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition text-center space-y-3">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80" alt="Elena Rostova" class="w-20 h-20 rounded-full object-cover mx-auto border-2 border-purple-200 shadow">
                <div>
                  <h3 class="font-bold text-gray-900 text-sm">Elena Rostova, M.S.</h3>
                  <p class="text-[11px] text-purple-700 font-medium">Stress & Resilience Specialist</p>
                  <p class="text-[10px] text-gray-500">10+ Years Experience</p>
                </div>
                <div class="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold">
                  <span>★ 4.9</span> <span class="text-gray-400 font-normal">(112 reviews)</span>
                </div>
                <button class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-lg transition">View Profile</button>
              </div>
            </div>
          </div>
        `,
      },
      {
        id: "chunk-final-cta-consultant",
        name: "14. Final CTA Banner",
        type: "cta",
        order: 14,
        content: `
          <div class="bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center shadow-xl my-8 relative overflow-hidden">
            <div class="max-w-2xl mx-auto space-y-4 relative z-10">
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Begin Your Growth & Resilience Journey?</h2>
              <p class="text-sm opacity-90 leading-relaxed">Book a 1-on-1 confidential consultation with Dr. Sarah Jenkins today and gain actionable insights tailored to your personal and professional life.</p>
              <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#book-consultation" class="bg-white text-purple-900 hover:bg-gray-100 font-extrabold text-sm px-8 py-3.5 rounded-full shadow-lg transition">Book Consultation Now</a>
                <a href="#contact-consultant" class="border border-white/30 text-white hover:bg-white/10 font-bold text-sm px-6 py-3.5 rounded-full transition">Have Questions? Contact Us</a>
              </div>
            </div>
          </div>
        `,
      },
    ],
    createdBy: "Dr. Sarah Jenkins",
    lastModifiedBy: "Admin",
    createdAt: "2026-07-25T12:00:00.000Z",
    updatedAt: "2026-07-25T12:00:00.000Z",
  },
];

// Memory store fallback if DB is empty or disconnected
let memoryPages = [...SAMPLE_PAGES];
let memoryRevisions: Record<number, any[]> = {
  1: [
    {
      id: 101,
      pageId: 1,
      versionNumber: 1,
      snapshot: SAMPLE_PAGES[0],
      summaryOfChanges: "Initial published draft created",
      updatedBy: "Dr. Alex Harrison",
      createdAt: "2026-07-20T10:00:00.000Z",
    },
  ],
};

// GET /api/html-chunks/pages
router.get("/html-chunks/pages", async (req, res): Promise<void> => {
  try {
    const search = (req.query.search as string || "").toLowerCase();
    const status = (req.query.status as string || "").toLowerCase();

    let pagesFromDb: any[] = [];
    try {
      pagesFromDb = await db.select().from(htmlChunkPagesTable);
    } catch (_e) {

      // Database query error fallback to memory
    }

    let source = pagesFromDb.length > 0 ? pagesFromDb.map((p) => ({
      id: p.id,
      title: p.title,
      identifierUrl: p.identifierUrl,
      status: p.status,
      seoDetails: p.seoDetails,
      chunks: p.chunks,
      createdBy: p.createdBy,
      lastModifiedBy: p.lastModifiedBy,
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    })) : memoryPages;

    if (search) {
      source = source.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.identifierUrl.toLowerCase().includes(search)
      );
    }

    if (status && status !== "all") {
      source = source.filter((p) => p.status.toLowerCase() === status);
    }

    res.json(source);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch HTML Chunk pages" });
  }
});

// GET /api/html-chunks/pages/:id
router.get("/html-chunks/pages/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    let page: any = null;

    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.id, id));
      if (rows.length > 0) {
        const p = rows[0];
        page = {
          id: p.id,
          title: p.title,
          identifierUrl: p.identifierUrl,
          status: p.status,
          seoDetails: p.seoDetails,
          chunks: p.chunks,
          createdBy: p.createdBy,
          lastModifiedBy: p.lastModifiedBy,
          createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
          updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
        };
      }
    } catch (_e) {
      // fallback
    }

    if (!page) {
      page = memoryPages.find((p) => p.id === id);
    }

    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }

    res.json(page);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/html-chunks/public/:slug
router.get("/html-chunks/public/:slug", async (req, res): Promise<void> => {
  try {
    const slug = req.params.slug;
    let page: any = null;

    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.identifierUrl, slug));
      if (rows.length > 0) {
        page = rows[0];
      }
    } catch (_e) {
      // fallback
    }

    if (!page) {
      page = memoryPages.find((p) => p.identifierUrl === slug);
    }

    if (!page || page.status !== "published") {
      res.status(404).json({ error: "Published page not found" });
      return;
    }

    res.json(page);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/html-chunks/pages
router.post("/html-chunks/pages", async (req, res): Promise<void> => {
  try {
    const { title, identifierUrl, status, seoDetails, chunks, createdBy } = req.body;

    if (!title) {
      res.status(400).json({ error: "Page title is required." });
      return;
    }

    const validation = validateIdentifierUrl(identifierUrl);
    if (!validation.valid) {
      res.status(400).json({ error: validation.message });
      return;
    }

    // Check duplicate slug
    let existingSlug = false;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.identifierUrl, identifierUrl));
      if (rows.length > 0) existingSlug = true;
    } catch (_e) {
      existingSlug = memoryPages.some((p) => p.identifierUrl === identifierUrl);
    }

    if (existingSlug) {
      res.status(400).json({ error: `Identifier URL '${identifierUrl}' already exists. Please choose a unique slug.` });
      return;
    }

    const now = new Date().toISOString();
    const newPageObj = {
      title,
      identifierUrl,
      status: status || "draft",
      seoDetails: seoDetails || {},
      chunks: chunks || [],
      createdBy: createdBy || "Dr. Alex Harrison",
      lastModifiedBy: createdBy || "Dr. Alex Harrison",
      createdAt: now,
      updatedAt: now,
    };

    let newId = memoryPages.length > 0 ? Math.max(...memoryPages.map((p) => p.id)) + 1 : 1;

    try {
      const [inserted] = await db.insert(htmlChunkPagesTable).values({
        title: newPageObj.title,
        identifierUrl: newPageObj.identifierUrl,
        status: newPageObj.status,
        seoDetails: newPageObj.seoDetails,
        chunks: newPageObj.chunks,
        createdBy: newPageObj.createdBy,
        lastModifiedBy: newPageObj.lastModifiedBy,
      }).returning();

      newId = inserted.id;
    } catch (_e) {
      // fallback
    }

    const createdPage = { id: newId, ...newPageObj };
    memoryPages.push(createdPage);

    // Initial Revision
    const initialRev = {
      id: Date.now(),
      pageId: newId,
      versionNumber: 1,
      snapshot: createdPage,
      summaryOfChanges: "Initial version created",
      updatedBy: createdPage.createdBy,
      createdAt: now,
    };
    if (!memoryRevisions[newId]) memoryRevisions[newId] = [];
    memoryRevisions[newId].push(initialRev);

    try {
      await db.insert(htmlChunkRevisionsTable).values({
        pageId: newId,
        versionNumber: 1,
        snapshot: createdPage,
        summaryOfChanges: "Initial version created",
        updatedBy: createdPage.createdBy,
      });
    } catch (_e) {}

    res.status(201).json(createdPage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/html-chunks/pages/:id
router.put("/html-chunks/pages/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, identifierUrl, status, seoDetails, chunks, lastModifiedBy, summaryOfChanges } = req.body;

    const validation = validateIdentifierUrl(identifierUrl);
    if (!validation.valid) {
      res.status(400).json({ error: validation.message });
      return;
    }

    // Check slug duplicate for other pages
    let duplicateSlug = false;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.identifierUrl, identifierUrl));
      if (rows.length > 0 && rows[0].id !== id) {
        duplicateSlug = true;
      }
    } catch (_e) {
      duplicateSlug = memoryPages.some((p) => p.identifierUrl === identifierUrl && p.id !== id);
    }

    if (duplicateSlug) {
      res.status(400).json({ error: `Identifier URL '${identifierUrl}' is already used by another page.` });
      return;
    }

    const now = new Date().toISOString();
    const existingIndex = memoryPages.findIndex((p) => p.id === id);

    let updatedPage: any = {
      id,
      title,
      identifierUrl,
      status,
      seoDetails,
      chunks,
      createdBy: existingIndex >= 0 ? memoryPages[existingIndex].createdBy : "Admin",
      lastModifiedBy: lastModifiedBy || "Dr. Alex Harrison",
      createdAt: existingIndex >= 0 ? memoryPages[existingIndex].createdAt : now,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      memoryPages[existingIndex] = updatedPage;
    }

    try {
      await db.update(htmlChunkPagesTable)
        .set({
          title,
          identifierUrl,
          status,
          seoDetails,
          chunks,
          lastModifiedBy: updatedPage.lastModifiedBy,
          updatedAt: new Date(),
        })
        .where(eq(htmlChunkPagesTable.id, id));
    } catch (_e) {}

    // Add version revision
    const currentRevs = memoryRevisions[id] || [];
    const nextVersion = currentRevs.length > 0 ? Math.max(...currentRevs.map((r) => r.versionNumber)) + 1 : 1;

    const newRev = {
      id: Date.now(),
      pageId: id,
      versionNumber: nextVersion,
      snapshot: updatedPage,
      summaryOfChanges: summaryOfChanges || "Updated page content & settings",
      updatedBy: updatedPage.lastModifiedBy,
      createdAt: now,
    };

    if (!memoryRevisions[id]) memoryRevisions[id] = [];
    memoryRevisions[id].unshift(newRev);

    try {
      await db.insert(htmlChunkRevisionsTable).values({
        pageId: id,
        versionNumber: nextVersion,
        snapshot: updatedPage,
        summaryOfChanges: summaryOfChanges || "Updated page content & settings",
        updatedBy: updatedPage.lastModifiedBy,
      });
    } catch (_e) {}

    res.json(updatedPage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/html-chunks/pages/:id
router.delete("/html-chunks/pages/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    memoryPages = memoryPages.filter((p) => p.id !== id);
    delete memoryRevisions[id];

    try {
      await db.delete(htmlChunkPagesTable).where(eq(htmlChunkPagesTable.id, id));
    } catch (_e) {}

    res.json({ message: "Page deleted successfully", id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/html-chunks/pages/:id/revisions
router.get("/html-chunks/pages/:id/revisions", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    let revisionsFromDb: any[] = [];

    try {

      revisionsFromDb = await db.select()
        .from(htmlChunkRevisionsTable)
        .where(eq(htmlChunkRevisionsTable.pageId, id))
        .orderBy(desc(htmlChunkRevisionsTable.versionNumber));
    } catch (_e) {}

    let list = revisionsFromDb.length > 0 ? revisionsFromDb.map((r) => ({
      id: r.id,
      pageId: r.pageId,
      versionNumber: r.versionNumber,
      snapshot: r.snapshot,
      summaryOfChanges: r.summaryOfChanges,
      updatedBy: r.updatedBy,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    })) : (memoryRevisions[id] || []);

    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/html-chunks/pages/:id/restore/:version
router.post("/html-chunks/pages/:id/restore/:version", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const versionNumber = parseInt(req.params.version, 10);

    const revs = memoryRevisions[id] || [];
    const targetRev = revs.find((r) => r.versionNumber === versionNumber);

    if (!targetRev) {
      res.status(404).json({ error: `Revision v${versionNumber} not found for page #${id}` });
      return;
    }

    const restoredSnapshot = targetRev.snapshot;
    const now = new Date().toISOString();

    const updatedPage = {
      ...restoredSnapshot,
      id,
      lastModifiedBy: "Dr. Alex Harrison",
      updatedAt: now,
    };

    const idx = memoryPages.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryPages[idx] = updatedPage;
    } else {
      memoryPages.push(updatedPage);
    }

    // Add new revision entry for restore operation
    const nextVersion = revs.length > 0 ? Math.max(...revs.map((r) => r.versionNumber)) + 1 : 1;
    const restoreRev = {
      id: Date.now(),
      pageId: id,
      versionNumber: nextVersion,
      snapshot: updatedPage,
      summaryOfChanges: `Restored back to version v${versionNumber}`,
      updatedBy: "Dr. Alex Harrison",
      createdAt: now,
    };
    memoryRevisions[id].unshift(restoreRev);

    try {
      await db.update(htmlChunkPagesTable)
        .set({
          title: updatedPage.title,
          identifierUrl: updatedPage.identifierUrl,
          status: updatedPage.status,
          seoDetails: updatedPage.seoDetails,
          chunks: updatedPage.chunks,
          lastModifiedBy: updatedPage.lastModifiedBy,
          updatedAt: new Date(),
        })
        .where(eq(htmlChunkPagesTable.id, id));
    } catch (_e) {}

    res.json({ message: `Successfully restored version v${versionNumber}`, page: updatedPage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
