import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
 
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
    
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc3) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc3 = __getOwnPropDesc(from, key)) || desc3.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "../../node_modules/.pnpm/dotenv@17.4.2/node_modules/dotenv/lib/main.js"(exports, module) {
    var fs2 = __require("fs");
    var path3 = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var TIPS = [
      "\u25C8 encrypted .env [www.dotenvx.com]",
      "\u25C8 secrets for agents [www.dotenvx.com]",
      "\u2301 auth for agents [www.vestauth.com]",
      "\u2318 custom filepath { path: '/custom/path/.env' }",
      "\u2318 enable debugging { debug: true }",
      "\u2318 override existing { override: true }",
      "\u2318 suppress logs { quiet: true }",
      "\u2318 multiple files { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text12) {
      return supportsAnsi() ? `\x1B[2m${text12}\x1B[0m` : text12;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`\u26A0 ${message}`);
    }
    function _debug(message) {
      console.log(`\u2506 ${message}`);
    }
    function _log(message) {
      console.log(`\u25C7 ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path3.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path3.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("no encoding is specified (UTF-8 is used by default)");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path4 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path4, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`failed to load ${path4} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path3.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// src/app.ts
import express from "express";
import cors from "cors";
import path2 from "node:path";

// src/routes/index.ts
import { Router as Router14 } from "express";

// src/routes/health.ts
import { Router } from "express";

// ../../lib/api-zod/src/generated/api.ts
import * as zod from "zod";
var HealthCheckResponse = zod.object({
  "status": zod.string()
});
var GetDashboardStatsResponse = zod.object({
  "sessionsToday": zod.number(),
  "sessionsRemaining": zod.number(),
  "activeClients": zod.number(),
  "newClientsThisWeek": zod.number(),
  "pendingReports": zod.number(),
  "homeworkToReview": zod.number(),
  "homeworkDueToday": zod.number(),
  "therapyHoursThisWeek": zod.number(),
  "improvementAverage": zod.number(),
  "totalClientsCount": zod.number(),
  "therapistName": zod.string(),
  "therapistTitle": zod.string(),
  "isAvailable": zod.boolean(),
  "therapyHoursToday": zod.string()
});
var GetUpcomingSessionsResponseItem = zod.object({
  "id": zod.number(),
  "clientName": zod.string(),
  "clientInitials": zod.string(),
  "sessionType": zod.string(),
  "sessionSubtype": zod.string().optional(),
  "startTime": zod.string(),
  "endTime": zod.string(),
  "durationMinutes": zod.number(),
  "countdownLabel": zod.string(),
  "sessionNumber": zod.number(),
  "isNext": zod.boolean()
});
var GetUpcomingSessionsResponse = zod.array(GetUpcomingSessionsResponseItem);
var GetPendingReportsResponseItem = zod.object({
  "sessionId": zod.number(),
  "clientName": zod.string(),
  "clientInitials": zod.string(),
  "sessionDate": zod.string(),
  "sessionTime": zod.string(),
  "sessionType": zod.string(),
  "sessionNumber": zod.number()
});
var GetPendingReportsResponse = zod.array(GetPendingReportsResponseItem);
var GetWeeklyScheduleResponseItem = zod.object({
  "day": zod.string(),
  "booked": zod.number(),
  "completed": zod.number(),
  "available": zod.number()
});
var GetWeeklyScheduleResponse = zod.array(GetWeeklyScheduleResponseItem);
var GetRecentActivityResponseItem = zod.object({
  "id": zod.number(),
  "clientName": zod.string(),
  "clientInitials": zod.string(),
  "activityType": zod.enum(["homework_completed", "assessment_completed", "mood_checkin", "journal_shared", "message_received"]),
  "description": zod.string(),
  "timeAgo": zod.string()
});
var GetRecentActivityResponse = zod.array(GetRecentActivityResponseItem);
var GetClientImprovementSummaryResponse = zod.object({
  "score": zod.number(),
  "changePercent": zod.number(),
  "changeDirection": zod.enum(["up", "down", "stable"]),
  "trend": zod.array(zod.object({
    "month": zod.string(),
    "score": zod.number()
  }))
});
var GetClientsQueryParams = zod.object({
  "status": zod.enum(["active", "completed", "inactive", "high_priority", "new"]).optional(),
  "search": zod.coerce.string().optional()
});
var GetClientsResponseItem = zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "initials": zod.string(),
  "age": zod.number(),
  "gender": zod.string(),
  "status": zod.enum(["active", "completed", "inactive", "high_priority", "new"]),
  "primaryGoal": zod.string(),
  "lastSession": zod.string().nullish(),
  "nextSession": zod.string().nullish(),
  "progressPercent": zod.number()
});
var GetClientsResponse = zod.array(GetClientsResponseItem);
var GetClientParams = zod.object({
  "id": zod.coerce.number()
});
var GetClientResponse = zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "initials": zod.string(),
  "age": zod.number(),
  "gender": zod.string(),
  "status": zod.string(),
  "primaryGoal": zod.string(),
  "presentingProblems": zod.array(zod.string()),
  "identifiedConcerns": zod.array(zod.string()),
  "therapyGoals": zod.array(zod.string()),
  "preferredLanguage": zod.string(),
  "communicationPreference": zod.string(),
  "therapyTimeline": zod.string(),
  "aiIntakeSummary": zod.string(),
  "sessionCount": zod.number(),
  "startDate": zod.string()
});
var GetClientAssessmentsParams = zod.object({
  "id": zod.coerce.number()
});
var GetClientAssessmentsResponseItem = zod.object({
  "id": zod.number(),
  "type": zod.enum(["PHQ-9", "GAD-7", "PANAS", "other"]),
  "name": zod.string(),
  "currentScore": zod.number(),
  "maxScore": zod.number(),
  "previousScore": zod.number().nullish(),
  "severity": zod.string(),
  "completedAt": zod.string(),
  "trend": zod.array(zod.object({
    "date": zod.string(),
    "score": zod.number()
  }))
});
var GetClientAssessmentsResponse = zod.array(GetClientAssessmentsResponseItem);
var GetClientMoodParams = zod.object({
  "id": zod.coerce.number()
});
var GetClientMoodResponse = zod.object({
  "today": zod.number().nullish(),
  "weeklyTrend": zod.array(zod.object({
    "date": zod.string(),
    "mood": zod.number(),
    "note": zod.string().nullish()
  }))
});
var GetClientHomeworkParams = zod.object({
  "id": zod.coerce.number()
});
var GetClientHomeworkResponseItem = zod.object({
  "id": zod.number(),
  "activity": zod.string(),
  "instructions": zod.string(),
  "frequency": zod.string(),
  "dueDate": zod.string(),
  "status": zod.enum(["completed", "pending", "missed"]),
  "completionPercent": zod.number(),
  "streak": zod.number(),
  "clientReflection": zod.string().nullish()
});
var GetClientHomeworkResponse = zod.array(GetClientHomeworkResponseItem);
var GetClientSessionHistoryParams = zod.object({
  "id": zod.coerce.number()
});
var GetClientSessionHistoryResponseItem = zod.object({
  "id": zod.number(),
  "date": zod.string(),
  "durationMinutes": zod.number(),
  "sessionType": zod.string(),
  "summary": zod.string(),
  "homeworkAssigned": zod.string().nullish(),
  "therapistNotes": zod.string().nullish()
});
var GetClientSessionHistoryResponse = zod.array(GetClientSessionHistoryResponseItem);
var SubmitSessionReportParams = zod.object({
  "id": zod.coerce.number()
});
var SubmitSessionReportBody = zod.object({
  "durationMinutes": zod.number(),
  "clientCooperation": zod.enum(["excellent", "good", "fair", "poor"]),
  "clientEngagementLevel": zod.enum(["high", "medium", "low"]),
  "moodComparedToPrevious": zod.enum(["much_better", "better", "same", "worse", "much_worse"]),
  "progressTowardsGoals": zod.enum(["significant", "moderate", "minimal", "none"]),
  "techniquesUsed": zod.array(zod.string()),
  "topicsDiscussed": zod.array(zod.string()),
  "riskFlags": zod.string().nullish(),
  "clinicalSummary": zod.string(),
  "internalNotes": zod.string().nullish(),
  "homeworkActivity": zod.string().nullish(),
  "homeworkInstructions": zod.string().nullish(),
  "homeworkFrequency": zod.string().nullish(),
  "nextSessionRecommendation": zod.enum(["3_days", "1_week", "2_weeks", "1_month", "custom"]),
  "followUpMessage": zod.string().nullish()
});
var SubmitSessionReportResponse = zod.object({
  "id": zod.number(),
  "sessionId": zod.number(),
  "submittedAt": zod.string(),
  "paymentEligible": zod.boolean()
});
var GetCalendarEventsQueryParams = zod.object({
  "start": zod.date().optional(),
  "end": zod.date().optional(),
  "view": zod.enum(["day", "week", "month"]).optional()
});
var GetCalendarEventsResponseItem = zod.object({
  "id": zod.number(),
  "title": zod.string(),
  "clientName": zod.string().nullish(),
  "start": zod.string(),
  "end": zod.string(),
  "type": zod.enum(["session", "blocked", "holiday", "available"]),
  "sessionType": zod.string().nullish(),
  "isRecurring": zod.boolean()
});
var GetCalendarEventsResponse = zod.array(GetCalendarEventsResponseItem);
var GetAvailabilityResponseItem = zod.object({
  "id": zod.number(),
  "dayOfWeek": zod.string(),
  "startTime": zod.string(),
  "endTime": zod.string(),
  "isRecurring": zod.boolean()
});
var GetAvailabilityResponse = zod.array(GetAvailabilityResponseItem);
var SetAvailabilityBody = zod.object({
  "dayOfWeek": zod.string(),
  "startTime": zod.string(),
  "endTime": zod.string(),
  "isRecurring": zod.boolean()
});
var SetAvailabilityResponse = zod.object({
  "id": zod.number(),
  "dayOfWeek": zod.string(),
  "startTime": zod.string(),
  "endTime": zod.string(),
  "isRecurring": zod.boolean()
});
var FetchClientOutcomesParams = zod.object({
  "clientId": zod.coerce.number()
});
var FetchClientOutcomesResponse = zod.object({
  "clientId": zod.number(),
  "clientName": zod.string(),
  "improvementScore": zod.number(),
  "goalAchievementRate": zod.number(),
  "totalGoals": zod.number(),
  "completedGoals": zod.number(),
  "goalsInProgress": zod.number(),
  "attendancePercent": zod.number(),
  "sessionsAttended": zod.number(),
  "missedSessions": zod.number(),
  "rescheduledSessions": zod.number(),
  "homeworkCompletionPercent": zod.number(),
  "assignedActivities": zod.number(),
  "completedActivities": zod.number(),
  "currentStreak": zod.number(),
  "engagementScore": zod.number(),
  "engagementLevel": zod.enum(["high", "medium", "low"]),
  "assessmentTrends": zod.array(zod.object({
    "name": zod.string(),
    "data": zod.array(zod.object({
      "date": zod.string(),
      "score": zod.number()
    }))
  }))
});
var GetCaseloadOutcomesQueryParams = zod.object({
  "period": zod.enum(["week", "month", "year", "custom"]).optional()
});
var GetCaseloadOutcomesResponse = zod.object({
  "averageImprovementScore": zod.number(),
  "averageGoalAchievementRate": zod.number(),
  "averageAssessmentImprovement": zod.number(),
  "overallAttendanceRate": zod.number(),
  "averageHomeworkAdherence": zod.number(),
  "averageEngagementScore": zod.number(),
  "period": zod.string(),
  "clientBreakdown": zod.array(zod.object({
    "clientId": zod.number(),
    "clientName": zod.string(),
    "improvementScore": zod.number(),
    "engagementScore": zod.number(),
    "status": zod.string()
  }))
});
var GetRevenueSummaryQueryParams = zod.object({
  "period": zod.enum(["week", "month", "year", "custom"]).optional()
});
var GetRevenueSummaryResponse = zod.object({
  "totalRevenue": zod.number(),
  "pendingPayments": zod.number(),
  "completedConsultations": zod.number(),
  "therapyHours": zod.number(),
  "revenueChange": zod.number(),
  "period": zod.string()
});
var GetRevenueAnalyticsQueryParams = zod.object({
  "period": zod.enum(["week", "month", "year", "custom"]).optional()
});
var GetRevenueAnalyticsResponseItem = zod.object({
  "label": zod.string(),
  "revenue": zod.number(),
  "consultations": zod.number(),
  "hours": zod.number(),
  "avgPerConsultation": zod.number()
});
var GetRevenueAnalyticsResponse = zod.array(GetRevenueAnalyticsResponseItem);
var GetTransactionsResponseItem = zod.object({
  "id": zod.number(),
  "date": zod.string(),
  "clientName": zod.string(),
  "amount": zod.number(),
  "status": zod.enum(["paid", "pending", "overdue"]),
  "invoiceNumber": zod.string()
});
var GetTransactionsResponse = zod.array(GetTransactionsResponseItem);
var GetReviewsSummaryResponse = zod.object({
  "averageRating": zod.number(),
  "totalReviews": zod.number(),
  "recommendationPercent": zod.number(),
  "ratingTrend": zod.array(zod.object({
    "month": zod.string(),
    "rating": zod.number(),
    "count": zod.number()
  })),
  "ratingDistribution": zod.array(zod.object({
    "stars": zod.number(),
    "count": zod.number()
  }))
});
var GetReviewsResponseItem = zod.object({
  "id": zod.number(),
  "rating": zod.number(),
  "reviewText": zod.string(),
  "date": zod.string(),
  "therapistReply": zod.string().nullish()
});
var GetReviewsResponse = zod.array(GetReviewsResponseItem);
var SubmitBlogPostBody = zod.object({
  "title": zod.string(),
  "featuredImage": zod.string().nullish(),
  "category": zod.string(),
  "tags": zod.array(zod.string()).optional(),
  "content": zod.string()
});
var SubmitBlogPostResponse = zod.object({
  "id": zod.number(),
  "title": zod.string(),
  "category": zod.string(),
  "tags": zod.array(zod.string()),
  "content": zod.string(),
  "status": zod.enum(["draft", "submitted", "published"]),
  "createdAt": zod.string()
});
var GetBlogPostsResponseItem = zod.object({
  "id": zod.number(),
  "title": zod.string(),
  "category": zod.string(),
  "tags": zod.array(zod.string()),
  "content": zod.string(),
  "status": zod.enum(["draft", "submitted", "published"]),
  "createdAt": zod.string()
});
var GetBlogPostsResponse = zod.array(GetBlogPostsResponseItem);
var SubmitBlogOutlineBody = zod.object({
  "proposedTitle": zod.string(),
  "keyPoints": zod.array(zod.string()),
  "targetAudience": zod.string(),
  "keywords": zod.array(zod.string()),
  "notes": zod.string().nullish()
});
var SubmitBlogOutlineResponse = zod.object({
  "id": zod.number(),
  "proposedTitle": zod.string(),
  "keyPoints": zod.array(zod.string()),
  "targetAudience": zod.string(),
  "keywords": zod.array(zod.string()),
  "notes": zod.string().nullish(),
  "status": zod.enum(["pending", "approved", "rejected"]),
  "createdAt": zod.string()
});
var GetBlogOutlinesResponseItem = zod.object({
  "id": zod.number(),
  "proposedTitle": zod.string(),
  "keyPoints": zod.array(zod.string()),
  "targetAudience": zod.string(),
  "keywords": zod.array(zod.string()),
  "notes": zod.string().nullish(),
  "status": zod.enum(["pending", "approved", "rejected"]),
  "createdAt": zod.string()
});
var GetBlogOutlinesResponse = zod.array(GetBlogOutlinesResponseItem);
var GetProfileResponse = zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "title": zod.string(),
  "bio": zod.string(),
  "qualifications": zod.array(zod.string()),
  "experience": zod.number(),
  "languages": zod.array(zod.string()),
  "specializations": zod.array(zod.string()),
  "verificationStatus": zod.enum(["verified", "pending", "unverified"]),
  "consultationFee": zod.number(),
  "workingDays": zod.array(zod.string()),
  "consultationHours": zod.string(),
  "isAvailable": zod.boolean(),
  "photoUrl": zod.string().nullish()
});
var UpdateProfileBody = zod.object({
  "name": zod.string().optional(),
  "title": zod.string().optional(),
  "bio": zod.string().optional(),
  "qualifications": zod.array(zod.string()).optional(),
  "experience": zod.number().optional(),
  "languages": zod.array(zod.string()).optional(),
  "specializations": zod.array(zod.string()).optional(),
  "consultationFee": zod.number().optional(),
  "workingDays": zod.array(zod.string()).optional(),
  "consultationHours": zod.string().optional(),
  "isAvailable": zod.boolean().optional()
});
var UpdateProfileResponse = zod.object({
  "id": zod.number(),
  "name": zod.string(),
  "title": zod.string(),
  "bio": zod.string(),
  "qualifications": zod.array(zod.string()),
  "experience": zod.number(),
  "languages": zod.array(zod.string()),
  "specializations": zod.array(zod.string()),
  "verificationStatus": zod.enum(["verified", "pending", "unverified"]),
  "consultationFee": zod.number(),
  "workingDays": zod.array(zod.string()),
  "consultationHours": zod.string(),
  "isAvailable": zod.boolean(),
  "photoUrl": zod.string().nullish()
});

// src/routes/health.ts
var router = Router();
router.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Consultant Dashboard API Server is running" });
});
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
var health_default = router;

// src/routes/auth.ts
import { Router as Router2 } from "express";
var router2 = Router2();
var DEFAULT_THERAPIST = {
  id: "therapist-1",
  name: "Dr. Alex Harrison, PsyD",
  email: "alex.harrison@hexpertify.com",
  title: "Licensed Clinical Psychologist & CBT Specialist",
  licenseNumber: "PSY-98421",
  role: "therapist",
  avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
};
router2.post("/auth/login", (req, res) => {
  const { email, password, role } = req.body || {};
  res.json({
    success: true,
    token: "hexpertify_demo_jwt_token_2026",
    user: {
      ...DEFAULT_THERAPIST,
      email: email || DEFAULT_THERAPIST.email,
      role: role || "therapist"
    },
    message: "Authentication successful. Welcome to Hexpertify Clinical Suite."
  });
});
router2.post("/auth/logout", (_req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully."
  });
});
router2.get("/auth/me", (_req, res) => {
  res.json(DEFAULT_THERAPIST);
});
var auth_default = router2;

// src/routes/dashboard.ts
import { Router as Router3 } from "express";

// ../../lib/db/src/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// ../../lib/db/src/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
  activitiesTable: () => activitiesTable,
  activityLogsTable: () => activityLogsTable,
  assessmentTrendsTable: () => assessmentTrendsTable,
  assessmentsTable: () => assessmentsTable,
  availabilitySlotsTable: () => availabilitySlotsTable,
  blogOutlinesTable: () => blogOutlinesTable,
  blogPostsTable: () => blogPostsTable,
  calendarEventsTable: () => calendarEventsTable,
  clientStatusEnum: () => clientStatusEnum,
  clientsTable: () => clientsTable,
  homeworkTable: () => homeworkTable,
  htmlChunkPagesTable: () => htmlChunkPagesTable,
  htmlChunkRevisionsTable: () => htmlChunkRevisionsTable,
  moodLogsTable: () => moodLogsTable,
  reviewsTable: () => reviewsTable,
  sessionReportsTable: () => sessionReportsTable,
  sessionTypeEnum: () => sessionTypeEnum,
  sessionsTable: () => sessionsTable,
  therapistProfileTable: () => therapistProfileTable,
  transactionsTable: () => transactionsTable
});

// ../../lib/db/src/schema/clients.ts
import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
var clientStatusEnum = pgEnum("client_status", ["active", "completed", "inactive", "high_priority", "new"]);
var clientsTable = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  status: clientStatusEnum("status").notNull().default("active"),
  primaryGoal: text("primary_goal").notNull(),
  presentingProblems: text("presenting_problems").array().notNull().default([]),
  identifiedConcerns: text("identified_concerns").array().notNull().default([]),
  therapyGoals: text("therapy_goals").array().notNull().default([]),
  preferredLanguage: text("preferred_language").notNull().default("English"),
  communicationPreference: text("communication_preference").notNull().default("Video"),
  therapyTimeline: text("therapy_timeline").notNull().default("3-6 months"),
  aiIntakeSummary: text("ai_intake_summary").notNull().default(""),
  progressPercent: integer("progress_percent").notNull().default(0),
  startDate: text("start_date").notNull(),
  lastSession: text("last_session"),
  nextSession: text("next_session"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/sessions.ts
import { pgTable as pgTable2, serial as serial2, integer as integer2, text as text2, timestamp as timestamp2, boolean as boolean2, pgEnum as pgEnum2 } from "drizzle-orm/pg-core";
var sessionTypeEnum = pgEnum2("session_type", ["CBT", "ACT", "EMDR", "Intake", "Couples Therapy", "Follow-up", "DBT", "Mindfulness"]);
var sessionsTable = pgTable2("sessions", {
  id: serial2("id").primaryKey(),
  clientId: integer2("client_id").notNull().references(() => clientsTable.id),
  sessionType: text2("session_type").notNull(),
  sessionSubtype: text2("session_subtype"),
  startTime: text2("start_time").notNull(),
  endTime: text2("end_time").notNull(),
  durationMinutes: integer2("duration_minutes").notNull(),
  sessionNumber: integer2("session_number").notNull().default(1),
  isNext: boolean2("is_next").notNull().default(false),
  reportSubmitted: boolean2("report_submitted").notNull().default(false),
  status: text2("status").notNull().default("upcoming"),
  // upcoming, completed, cancelled
  sessionDate: text2("session_date").notNull(),
  createdAt: timestamp2("created_at").defaultNow().notNull()
});
var sessionReportsTable = pgTable2("session_reports", {
  id: serial2("id").primaryKey(),
  sessionId: integer2("session_id").notNull().references(() => sessionsTable.id),
  durationMinutes: integer2("duration_minutes").notNull(),
  clientCooperation: text2("client_cooperation").notNull(),
  clientEngagementLevel: text2("client_engagement_level").notNull(),
  moodComparedToPrevious: text2("mood_compared_to_previous").notNull(),
  progressTowardsGoals: text2("progress_towards_goals").notNull(),
  techniquesUsed: text2("techniques_used").array().notNull().default([]),
  topicsDiscussed: text2("topics_discussed").array().notNull().default([]),
  riskFlags: text2("risk_flags"),
  clinicalSummary: text2("clinical_summary").notNull(),
  internalNotes: text2("internal_notes"),
  homeworkActivity: text2("homework_activity"),
  homeworkInstructions: text2("homework_instructions"),
  homeworkFrequency: text2("homework_frequency"),
  nextSessionRecommendation: text2("next_session_recommendation").notNull(),
  followUpMessage: text2("follow_up_message"),
  paymentEligible: boolean2("payment_eligible").notNull().default(true),
  submittedAt: timestamp2("submitted_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/assessments.ts
import { pgTable as pgTable3, serial as serial3, integer as integer3, text as text3, real, timestamp as timestamp3 } from "drizzle-orm/pg-core";
var assessmentsTable = pgTable3("assessments", {
  id: serial3("id").primaryKey(),
  clientId: integer3("client_id").notNull().references(() => clientsTable.id),
  type: text3("type").notNull(),
  // PHQ-9, GAD-7, PANAS, other
  name: text3("name").notNull(),
  currentScore: real("current_score").notNull(),
  maxScore: real("max_score").notNull(),
  previousScore: real("previous_score"),
  severity: text3("severity").notNull(),
  completedAt: text3("completed_at").notNull(),
  createdAt: timestamp3("created_at").defaultNow().notNull()
});
var assessmentTrendsTable = pgTable3("assessment_trends", {
  id: serial3("id").primaryKey(),
  assessmentId: integer3("assessment_id").notNull().references(() => assessmentsTable.id),
  date: text3("date").notNull(),
  score: real("score").notNull()
});
var moodLogsTable = pgTable3("mood_logs", {
  id: serial3("id").primaryKey(),
  clientId: integer3("client_id").notNull().references(() => clientsTable.id),
  date: text3("date").notNull(),
  mood: real("mood").notNull(),
  // 1-10
  note: text3("note")
});

// ../../lib/db/src/schema/homework.ts
import { pgTable as pgTable4, serial as serial4, integer as integer4, text as text4, timestamp as timestamp4 } from "drizzle-orm/pg-core";
var homeworkTable = pgTable4("homework", {
  id: serial4("id").primaryKey(),
  clientId: integer4("client_id").notNull().references(() => clientsTable.id),
  activity: text4("activity").notNull(),
  instructions: text4("instructions").notNull(),
  frequency: text4("frequency").notNull(),
  dueDate: text4("due_date").notNull(),
  status: text4("status").notNull().default("pending"),
  // completed, pending, missed
  completionPercent: integer4("completion_percent").notNull().default(0),
  streak: integer4("streak").notNull().default(0),
  clientReflection: text4("client_reflection"),
  createdAt: timestamp4("created_at").defaultNow().notNull()
});
var activityLogsTable = pgTable4("activity_logs", {
  id: serial4("id").primaryKey(),
  clientId: integer4("client_id").notNull().references(() => clientsTable.id),
  activityType: text4("activity_type").notNull(),
  // homework_completed, assessment_completed, mood_checkin, journal_shared, message_received
  description: text4("description").notNull(),
  timeAgo: text4("time_ago").notNull(),
  createdAt: timestamp4("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/calendar.ts
import { pgTable as pgTable5, serial as serial5, text as text5, boolean as boolean3, timestamp as timestamp5 } from "drizzle-orm/pg-core";
var calendarEventsTable = pgTable5("calendar_events", {
  id: serial5("id").primaryKey(),
  title: text5("title").notNull(),
  clientName: text5("client_name"),
  start: text5("start").notNull(),
  end: text5("end").notNull(),
  type: text5("type").notNull().default("session"),
  // session, blocked, holiday, available
  sessionType: text5("session_type"),
  isRecurring: boolean3("is_recurring").notNull().default(false),
  createdAt: timestamp5("created_at").defaultNow().notNull()
});
var availabilitySlotsTable = pgTable5("availability_slots", {
  id: serial5("id").primaryKey(),
  dayOfWeek: text5("day_of_week").notNull(),
  startTime: text5("start_time").notNull(),
  endTime: text5("end_time").notNull(),
  isRecurring: boolean3("is_recurring").notNull().default(true),
  createdAt: timestamp5("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/revenue.ts
import { pgTable as pgTable6, serial as serial6, text as text6, real as real3, timestamp as timestamp6 } from "drizzle-orm/pg-core";
var transactionsTable = pgTable6("transactions", {
  id: serial6("id").primaryKey(),
  date: text6("date").notNull(),
  clientName: text6("client_name").notNull(),
  amount: real3("amount").notNull(),
  status: text6("status").notNull().default("pending"),
  // paid, pending, overdue
  invoiceNumber: text6("invoice_number").notNull(),
  createdAt: timestamp6("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/reviews.ts
import { pgTable as pgTable7, serial as serial7, text as text7, integer as integer6, timestamp as timestamp7 } from "drizzle-orm/pg-core";
var reviewsTable = pgTable7("reviews", {
  id: serial7("id").primaryKey(),
  rating: integer6("rating").notNull(),
  reviewText: text7("review_text").notNull(),
  date: text7("date").notNull(),
  therapistReply: text7("therapist_reply"),
  createdAt: timestamp7("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/blog.ts
import { pgTable as pgTable8, serial as serial8, text as text8, timestamp as timestamp8 } from "drizzle-orm/pg-core";
var blogPostsTable = pgTable8("blog_posts", {
  id: serial8("id").primaryKey(),
  title: text8("title").notNull(),
  featuredImage: text8("featured_image"),
  category: text8("category").notNull(),
  tags: text8("tags").array().notNull().default([]),
  content: text8("content").notNull(),
  status: text8("status").notNull().default("submitted"),
  // draft, submitted, published
  createdAt: timestamp8("created_at").defaultNow().notNull()
});
var blogOutlinesTable = pgTable8("blog_outlines", {
  id: serial8("id").primaryKey(),
  proposedTitle: text8("proposed_title").notNull(),
  keyPoints: text8("key_points").array().notNull().default([]),
  targetAudience: text8("target_audience").notNull(),
  keywords: text8("keywords").array().notNull().default([]),
  notes: text8("notes"),
  status: text8("status").notNull().default("pending"),
  // pending, approved, rejected
  createdAt: timestamp8("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/profile.ts
import { pgTable as pgTable9, serial as serial9, text as text9, real as real4, integer as integer7, boolean as boolean4, timestamp as timestamp9 } from "drizzle-orm/pg-core";
var therapistProfileTable = pgTable9("therapist_profile", {
  id: serial9("id").primaryKey(),
  name: text9("name").notNull(),
  title: text9("title").notNull(),
  bio: text9("bio").notNull(),
  qualifications: text9("qualifications").array().notNull().default([]),
  experience: integer7("experience").notNull().default(0),
  languages: text9("languages").array().notNull().default([]),
  specializations: text9("specializations").array().notNull().default([]),
  verificationStatus: text9("verification_status").notNull().default("verified"),
  // verified, pending, unverified
  consultationFee: real4("consultation_fee").notNull().default(0),
  workingDays: text9("working_days").array().notNull().default([]),
  consultationHours: text9("consultation_hours").notNull().default("9 AM - 6 PM"),
  isAvailable: boolean4("is_available").notNull().default(true),
  photoUrl: text9("photo_url"),
  createdAt: timestamp9("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/htmlChunks.ts
import { pgTable as pgTable10, serial as serial10, text as text10, timestamp as timestamp10, integer as integer8, jsonb } from "drizzle-orm/pg-core";
var htmlChunkPagesTable = pgTable10("html_chunk_pages", {
  id: serial10("id").primaryKey(),
  title: text10("title").notNull(),
  identifierUrl: text10("identifier_url").notNull().unique(),
  // Slug
  status: text10("status").notNull().default("draft"),
  // draft, published, archived
  seoDetails: jsonb("seo_details").$type().notNull().default({}),
  chunks: jsonb("chunks").$type().notNull().default([]),
  createdBy: text10("created_by").notNull().default("Admin"),
  lastModifiedBy: text10("last_modified_by").notNull().default("Admin"),
  createdAt: timestamp10("created_at").defaultNow().notNull(),
  updatedAt: timestamp10("updated_at").defaultNow().notNull()
});
var htmlChunkRevisionsTable = pgTable10("html_chunk_revisions", {
  id: serial10("id").primaryKey(),
  pageId: integer8("page_id").notNull(),
  versionNumber: integer8("version_number").notNull(),
  snapshot: jsonb("snapshot").$type().notNull(),
  summaryOfChanges: text10("summary_of_changes").notNull().default("Updated page content"),
  updatedBy: text10("updated_by").notNull().default("Admin"),
  createdAt: timestamp10("created_at").defaultNow().notNull()
});

// ../../lib/db/src/schema/activities.ts
import { pgTable as pgTable11, serial as serial11, text as text11, timestamp as timestamp11 } from "drizzle-orm/pg-core";
var activitiesTable = pgTable11("activities", {
  id: serial11("id").primaryKey(),
  title: text11("title").notNull(),
  description: text11("description").notNull(),
  category: text11("category").notNull(),
  // MINDFULNESS, CBT, GRATITUDE, BREATHING, SLEEP, SOMATIC
  difficulty: text11("difficulty").notNull(),
  // Easy, Medium, Hard
  duration: text11("duration").notNull(),
  // e.g. "10 min"
  dueDate: text11("due_date").notNull(),
  // e.g. "Today"
  imageUrl: text11("image_url").notNull(),
  status: text11("status").notNull().default("pending"),
  // pending, completed
  instructions: text11("instructions"),
  // JSON or newline separated step instructions
  reflection: text11("reflection"),
  // Client reflection note upon completion
  completedAt: text11("completed_at"),
  createdAt: timestamp11("created_at").defaultNow().notNull()
});

// ../../lib/db/src/index.ts
var import_dotenv = __toESM(require_main(), 1);
import path from "path";
if (!process.env.DATABASE_URL) {
  import_dotenv.default.config({ path: path.resolve(__dirname, "../../../.env") });
  import_dotenv.default.config({ path: path.resolve(process.cwd(), ".env") });
  import_dotenv.default.config({ path: path.resolve(process.cwd(), "../../.env") });
}
var Pool = pg.Pool || pg.default?.Pool;
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn(
    "[WARNING] DATABASE_URL is not set. Database calls will fail until DATABASE_URL environment variable is provided."
  );
}
var isLocalhost = connectionString?.includes("localhost") || connectionString?.includes("127.0.0.1");
var pool = new Pool({
  connectionString: connectionString || "postgres://localhost:5432/placeholder",
  ssl: connectionString && !isLocalhost ? { rejectUnauthorized: false } : void 0
});
var db = drizzle(pool, { schema: schema_exports });

// src/routes/dashboard.ts
import { desc, eq, and } from "drizzle-orm";
var router3 = Router3();
var HARDCODED_STATS = {
  sessionsToday: 6,
  sessionsRemaining: 2,
  activeClients: 18,
  newClientsThisWeek: 3,
  pendingReports: 2,
  homeworkToReview: 5,
  homeworkDueToday: 5,
  therapyHoursThisWeek: 28,
  improvementAverage: 74.2,
  totalClientsCount: 24,
  therapistName: "Dr. Alex Harrison",
  therapistTitle: "Licensed Clinical Psychologist",
  isAvailable: true,
  therapyHoursToday: "5h 45m"
};
var HARDCODED_UPCOMING_SESSIONS = [
  {
    id: 1,
    clientName: "Sarah Jenkins",
    clientInitials: "SJ",
    sessionType: "CBT",
    sessionSubtype: "Cognitive Restructuring",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    durationMinutes: 60,
    countdownLabel: "in 12 min",
    sessionNumber: 12,
    isNext: true
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientInitials: "MC",
    sessionType: "ACT",
    sessionSubtype: "Values Clarification",
    startTime: "10:30 AM",
    endTime: "11:30 AM",
    durationMinutes: 60,
    countdownLabel: "in 1h 42m",
    sessionNumber: 8,
    isNext: false
  },
  {
    id: 3,
    clientName: "David Kim",
    clientInitials: "DK",
    sessionType: "CBT",
    sessionSubtype: "Exposure Hierarchy",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    durationMinutes: 60,
    countdownLabel: "in 4h 15m",
    sessionNumber: 2,
    isNext: false
  },
  {
    id: 4,
    clientName: "Emily Rodriguez",
    clientInitials: "ER",
    sessionType: "DBT",
    sessionSubtype: "Distress Tolerance",
    startTime: "04:30 PM",
    endTime: "05:30 PM",
    durationMinutes: 60,
    countdownLabel: "in 6h 45m",
    sessionNumber: 15,
    isNext: false
  }
];
var HARDCODED_PENDING_REPORTS = [
  {
    sessionId: 101,
    clientName: "Emily Rodriguez",
    clientInitials: "ER",
    sessionDate: "2026-07-22",
    sessionTime: "02:00 PM",
    sessionType: "DBT Skills",
    sessionNumber: 15
  },
  {
    sessionId: 102,
    clientName: "Michael Chen",
    clientInitials: "MC",
    sessionDate: "2026-07-21",
    sessionTime: "10:30 AM",
    sessionType: "ACT Protocol",
    sessionNumber: 7
  },
  {
    sessionId: 103,
    clientName: "Sarah Jenkins",
    clientInitials: "SJ",
    sessionDate: "2026-07-20",
    sessionTime: "09:00 AM",
    sessionType: "CBT Session",
    sessionNumber: 11
  }
];
var HARDCODED_WEEKLY_SCHEDULE = [
  { day: "Mon", booked: 4, completed: 4, available: 2 },
  { day: "Tue", booked: 6, completed: 3, available: 0 },
  { day: "Wed", booked: 5, completed: 5, available: 1 },
  { day: "Thu", booked: 7, completed: 7, available: 0 },
  { day: "Fri", booked: 4, completed: 4, available: 2 },
  { day: "Sat", booked: 2, completed: 2, available: 4 },
  { day: "Sun", booked: 0, completed: 0, available: 6 }
];
var HARDCODED_RECENT_ACTIVITY = [
  {
    id: 1,
    clientName: "Sarah Jenkins",
    clientInitials: "SJ",
    activityType: "homework_submission",
    description: "Submitted CBT Thought Record entries for anxiety tracking.",
    timeAgo: "25 min ago"
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientInitials: "MC",
    activityType: "mood_log",
    description: "Logged daily mood rating (7/10) with exercise notes.",
    timeAgo: "1 hour ago"
  },
  {
    id: 3,
    clientName: "Emily Rodriguez",
    clientInitials: "ER",
    activityType: "assessment_completed",
    description: "Completed weekly GAD-7 anxiety self-assessment.",
    timeAgo: "3 hours ago"
  },
  {
    id: 4,
    clientName: "David Kim",
    clientInitials: "DK",
    activityType: "appointment_booked",
    description: "Booked follow-up CBT consultation for Thursday.",
    timeAgo: "5 hours ago"
  }
];
var HARDCODED_CLIENT_IMPROVEMENT = {
  score: 74.2,
  changePercent: 12.4,
  changeDirection: "up",
  trend: [
    { month: "Jan", score: 58 },
    { month: "Feb", score: 62 },
    { month: "Mar", score: 65 },
    { month: "Apr", score: 68 },
    { month: "May", score: 71 },
    { month: "Jun", score: 74.2 }
  ]
};
router3.get("/dashboard/stats", async (_req, res) => {
  try {
    const clients = await db.select().from(clientsTable);
    const activeClients = clients.filter((c) => c.status === "active");
    const newClients = clients.filter((c) => c.status === "new");
    const pendingSessions = await db.select().from(sessionsTable).where(and(eq(sessionsTable.status, "completed"), eq(sessionsTable.reportSubmitted, false)));
    const homeworkPending = await db.select().from(homeworkTable).where(eq(homeworkTable.status, "pending"));
    res.json({
      sessionsToday: 6,
      sessionsRemaining: 2,
      activeClients: activeClients.length || HARDCODED_STATS.activeClients,
      newClientsThisWeek: newClients.length || HARDCODED_STATS.newClientsThisWeek,
      pendingReports: pendingSessions.length || HARDCODED_STATS.pendingReports,
      homeworkToReview: homeworkPending.length || HARDCODED_STATS.homeworkToReview,
      homeworkDueToday: 5,
      therapyHoursThisWeek: 28,
      improvementAverage: 74.2,
      totalClientsCount: clients.length || HARDCODED_STATS.totalClientsCount,
      therapistName: "Dr. Alex Harrison",
      therapistTitle: "Licensed Clinical Psychologist",
      isAvailable: true,
      therapyHoursToday: "5h 45m"
    });
  } catch (err) {
    console.error("Error fetching dashboard stats, returning fallback:", err);
    res.json(HARDCODED_STATS);
  }
});
router3.get("/dashboard/upcoming-sessions", async (_req, res) => {
  try {
    const sessions = await db.select({
      session: sessionsTable,
      client: clientsTable
    }).from(sessionsTable).innerJoin(clientsTable, eq(sessionsTable.clientId, clientsTable.id)).where(eq(sessionsTable.status, "upcoming")).limit(6);
    const result = sessions.map((row, i) => ({
      id: row.session.id,
      clientName: row.client.name,
      clientInitials: row.client.initials,
      sessionType: row.session.sessionType,
      sessionSubtype: row.session.sessionSubtype ?? void 0,
      startTime: row.session.startTime,
      endTime: row.session.endTime,
      durationMinutes: row.session.durationMinutes,
      countdownLabel: i === 0 ? "in 12 min" : i === 1 ? "in 1h 42m" : i === 2 ? "in 3h 57m" : "in 5h 42m",
      sessionNumber: row.session.sessionNumber,
      isNext: i === 0
    }));
    if (!result || result.length === 0) {
      res.json(HARDCODED_UPCOMING_SESSIONS);
      return;
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching upcoming sessions, returning fallback:", err);
    res.json(HARDCODED_UPCOMING_SESSIONS);
  }
});
router3.get("/dashboard/pending-reports", async (_req, res) => {
  try {
    const sessions = await db.select({
      session: sessionsTable,
      client: clientsTable
    }).from(sessionsTable).innerJoin(clientsTable, eq(sessionsTable.clientId, clientsTable.id)).where(and(eq(sessionsTable.status, "completed"), eq(sessionsTable.reportSubmitted, false))).limit(5);
    const result = sessions.map((row) => ({
      sessionId: row.session.id,
      clientName: row.client.name,
      clientInitials: row.client.initials,
      sessionDate: row.session.sessionDate,
      sessionTime: row.session.startTime,
      sessionType: row.session.sessionType,
      sessionNumber: row.session.sessionNumber
    }));
    if (!result || result.length === 0) {
      res.json(HARDCODED_PENDING_REPORTS);
      return;
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching pending reports, returning fallback:", err);
    res.json(HARDCODED_PENDING_REPORTS);
  }
});
router3.get("/dashboard/weekly-schedule", async (_req, res) => {
  try {
    res.json(HARDCODED_WEEKLY_SCHEDULE);
  } catch (err) {
    console.error("Error fetching weekly schedule, returning fallback:", err);
    res.json(HARDCODED_WEEKLY_SCHEDULE);
  }
});
router3.get("/dashboard/recent-activity", async (_req, res) => {
  try {
    const activities = await db.select({
      activity: activityLogsTable,
      client: clientsTable
    }).from(activityLogsTable).innerJoin(clientsTable, eq(activityLogsTable.clientId, clientsTable.id)).orderBy(desc(activityLogsTable.createdAt)).limit(10);
    const result = activities.map((row) => ({
      id: row.activity.id,
      clientName: row.client.name,
      clientInitials: row.client.initials,
      activityType: row.activity.activityType,
      description: row.activity.description,
      timeAgo: row.activity.timeAgo
    }));
    if (!result || result.length === 0) {
      res.json(HARDCODED_RECENT_ACTIVITY);
      return;
    }
    res.json(result);
  } catch (err) {
    console.error("Error fetching recent activity, returning fallback:", err);
    res.json(HARDCODED_RECENT_ACTIVITY);
  }
});
router3.get("/dashboard/client-improvement", async (_req, res) => {
  try {
    res.json(HARDCODED_CLIENT_IMPROVEMENT);
  } catch (err) {
    console.error("Error fetching client improvement, returning fallback:", err);
    res.json(HARDCODED_CLIENT_IMPROVEMENT);
  }
});
var dashboard_default = router3;

// src/routes/clients.ts
import { Router as Router4 } from "express";
import { eq as eq2, and as and2 } from "drizzle-orm";
var router4 = Router4();
var HARDCODED_CLIENTS_MAP = {
  1: {
    id: 1,
    name: "Sarah Jenkins",
    initials: "SJ",
    age: 29,
    gender: "Female",
    status: "active",
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
    sessionCount: 12
  },
  2: {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    age: 36,
    gender: "Male",
    status: "active",
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
    sessionCount: 8
  },
  3: {
    id: 3,
    name: "Emily Rodriguez",
    initials: "ER",
    age: 42,
    gender: "Female",
    status: "active",
    primaryGoal: "Process relationship dynamics and improve emotional regulation",
    presentingProblems: ["Emotional Dysregulation", "Work-Life Imbalance", "Chronic Stress"],
    identifiedConcerns: ["Difficulty setting boundaries with extended family", "Overworking under tight deadlines", "Tension headaches"],
    therapyGoals: ["Master DBT TIPP & STOP distress tolerance skills", "Set clear boundaries at work and home", "Engage in daily mindfulness practice"],
    preferredLanguage: "Spanish",
    communicationPreference: "Video",
    therapyTimeline: "6-12 months",
    aiIntakeSummary: "Client seeking support for burnout and interpersonal effectiveness. Highly engaged in DBT skill rehearsals.",
    progressPercent: 80,
    startDate: "2026-01-15",
    lastSession: "2026-07-22",
    nextSession: "2026-07-26",
    sessionCount: 15
  },
  4: {
    id: 4,
    name: "David Kim",
    initials: "DK",
    age: 31,
    gender: "Male",
    status: "new",
    primaryGoal: "Manage social anxiety in leadership role",
    presentingProblems: ["Social Anxiety Disorder", "Public Speaking Anxiety", "Performance Fear"],
    identifiedConcerns: ["Heart palpitations before executive briefings", "Avoidance of optional networking events", "Self-consciousness"],
    therapyGoals: ["Build 10-tier exposure hierarchy for public speaking", "Practice grounding techniques during meetings", "Reduce post-event rumination"],
    preferredLanguage: "English",
    communicationPreference: "In-Person",
    therapyTimeline: "3-6 months",
    aiIntakeSummary: "New client presenting with performance anxiety following recent promotion to VP of Engineering. Motivated for CBT exposure therapy.",
    progressPercent: 35,
    startDate: "2026-07-01",
    lastSession: "2026-07-17",
    nextSession: "2026-07-24",
    sessionCount: 2
  },
  5: {
    id: 5,
    name: "Jessica Taylor",
    initials: "JT",
    age: 25,
    gender: "Female",
    status: "completed",
    primaryGoal: "Address panic symptoms and return to comfortable social activities",
    presentingProblems: ["Panic Disorder", "Agoraphobia (Mild)"],
    identifiedConcerns: ["Avoidance of crowded subways", "Interoceptive panic triggers", "Fear of fainting"],
    therapyGoals: ["Completed interoceptive exposure exercises", "Traveled independently on subway", "Achieved full remission of panic attacks"],
    preferredLanguage: "English",
    communicationPreference: "Video",
    therapyTimeline: "3-6 months",
    aiIntakeSummary: "Client completed 16-session CBT panic protocol. Achieved full symptom remission and successfully graduated therapy.",
    progressPercent: 100,
    startDate: "2026-02-01",
    lastSession: "2026-07-12",
    nextSession: void 0,
    sessionCount: 16
  }
};
var HARDCODED_CLIENTS_LIST = Object.values(HARDCODED_CLIENTS_MAP);
router4.get("/clients", async (req, res) => {
  const { status, search } = req.query;
  try {
    let clients = await db.select().from(clientsTable);
    if (!clients || clients.length === 0) {
      clients = HARDCODED_CLIENTS_LIST;
    }
    if (status) {
      clients = clients.filter((c) => c.status === status);
    }
    if (search) {
      const term = search.toLowerCase();
      clients = clients.filter((c) => c.name.toLowerCase().includes(term));
    }
    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients list, returning hardcoded fallback:", err);
    let result = HARDCODED_CLIENTS_LIST;
    if (status) result = result.filter((c) => c.status === status);
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }
    res.json(result);
  }
});
router4.get("/clients/:id", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;
  const fallback = HARDCODED_CLIENTS_MAP[id] || HARDCODED_CLIENTS_MAP[1];
  try {
    const [client] = await db.select().from(clientsTable).where(eq2(clientsTable.id, id));
    const sessions = await db.select().from(sessionsTable).where(eq2(sessionsTable.clientId, id));
    res.json({
      ...fallback,
      ...client || {},
      sessionCount: sessions && sessions.length > 0 ? sessions.length : fallback.sessionCount
    });
  } catch (err) {
    console.error(`Error fetching client ${id}, returning fallback:`, err);
    res.json(fallback);
  }
});
router4.get("/clients/:id/assessments", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;
  try {
    const assessments = await db.select().from(assessmentsTable).where(eq2(assessmentsTable.clientId, id));
    const result = await Promise.all(
      assessments.map(async (a) => {
        const trends = await db.select().from(assessmentTrendsTable).where(eq2(assessmentTrendsTable.assessmentId, a.id));
        return { ...a, trend: trends.map((t) => ({ date: t.date, score: t.score })) };
      })
    );
    if (!result || result.length === 0) {
      res.json([
        {
          id: 101,
          clientId: id,
          type: "GAD-7",
          name: "Generalized Anxiety Disorder-7",
          currentScore: 6,
          maxScore: 21,
          previousScore: 14,
          severity: "Mild Anxiety",
          completedAt: "2026-07-18",
          trend: [
            { date: "2026-04-15", score: 18 },
            { date: "2026-05-15", score: 14 },
            { date: "2026-06-15", score: 9 },
            { date: "2026-07-18", score: 6 }
          ]
        },
        {
          id: 102,
          clientId: id,
          type: "PHQ-9",
          name: "Patient Health Questionnaire-9",
          currentScore: 4,
          maxScore: 27,
          previousScore: 9,
          severity: "Minimal Depression",
          completedAt: "2026-07-18",
          trend: [
            { date: "2026-04-15", score: 14 },
            { date: "2026-05-15", score: 10 },
            { date: "2026-06-15", score: 7 },
            { date: "2026-07-18", score: 4 }
          ]
        }
      ]);
      return;
    }
    res.json(result);
  } catch (err) {
    console.error(`Error fetching assessments for client ${id}, returning fallback:`, err);
    res.json([
      {
        id: 101,
        clientId: id,
        type: "GAD-7",
        name: "Generalized Anxiety Disorder-7",
        currentScore: 6,
        maxScore: 21,
        previousScore: 14,
        severity: "Mild Anxiety",
        completedAt: "2026-07-18",
        trend: [
          { date: "2026-04-15", score: 18 },
          { date: "2026-05-15", score: 14 },
          { date: "2026-06-15", score: 9 },
          { date: "2026-07-18", score: 6 }
        ]
      },
      {
        id: 102,
        clientId: id,
        type: "PHQ-9",
        name: "Patient Health Questionnaire-9",
        currentScore: 4,
        maxScore: 27,
        previousScore: 9,
        severity: "Minimal Depression",
        completedAt: "2026-07-18",
        trend: [
          { date: "2026-04-15", score: 14 },
          { date: "2026-05-15", score: 10 },
          { date: "2026-06-15", score: 7 },
          { date: "2026-07-18", score: 4 }
        ]
      }
    ]);
  }
});
router4.get("/clients/:id/mood", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;
  try {
    const logs = await db.select().from(moodLogsTable).where(eq2(moodLogsTable.clientId, id));
    if (!logs || logs.length === 0) {
      res.json({
        today: 8,
        weeklyTrend: [
          { date: "2026-07-17", mood: 6, note: "Slight anxiety regarding morning presentation." },
          { date: "2026-07-18", mood: 6.5, note: "Practiced box breathing, felt steady." },
          { date: "2026-07-19", mood: 7, note: "Weekend rest, enjoyable outdoor walk." },
          { date: "2026-07-20", mood: 7.5, note: "Good sleep, positive session discussion." },
          { date: "2026-07-21", mood: 7, note: "Productive workday." },
          { date: "2026-07-22", mood: 8, note: "Completed thought record log with ease." },
          { date: "2026-07-23", mood: 8.5, note: "Felt confident and calm all day." }
        ]
      });
      return;
    }
    const sorted = logs.sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    res.json({
      today: latest?.mood ?? 8,
      weeklyTrend: sorted.slice(-7).map((l) => ({
        date: l.date,
        mood: l.mood,
        note: l.note
      }))
    });
  } catch (err) {
    console.error(`Error fetching mood for client ${id}, returning fallback:`, err);
    res.json({
      today: 8,
      weeklyTrend: [
        { date: "2026-07-17", mood: 6, note: "Slight anxiety regarding morning presentation." },
        { date: "2026-07-18", mood: 6.5, note: "Practiced box breathing, felt steady." },
        { date: "2026-07-19", mood: 7, note: "Weekend rest, enjoyable outdoor walk." },
        { date: "2026-07-20", mood: 7.5, note: "Good sleep, positive session discussion." },
        { date: "2026-07-21", mood: 7, note: "Productive workday." },
        { date: "2026-07-22", mood: 8, note: "Completed thought record log with ease." },
        { date: "2026-07-23", mood: 8.5, note: "Felt confident and calm all day." }
      ]
    });
  }
});
router4.get("/clients/:id/homework", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;
  try {
    const hw = await db.select().from(homeworkTable).where(eq2(homeworkTable.clientId, id));
    if (!hw || hw.length === 0) {
      res.json([
        {
          id: 201,
          clientId: id,
          activity: "CBT Thought Record Log",
          instructions: "Complete daily thought record whenever stress level exceeds 5/10.",
          frequency: "Daily",
          dueDate: "2026-07-27",
          status: "completed",
          completionPercent: 90,
          streak: 5,
          clientReflection: "Recognized catastrophizing thoughts early and reframed effectively."
        },
        {
          id: 202,
          clientId: id,
          activity: "Box Breathing & Grounding",
          instructions: "Practice 5 minutes of 4-4-4-4 box breathing before work team meetings.",
          frequency: "Daily",
          dueDate: "2026-07-28",
          status: "pending",
          completionPercent: 80,
          streak: 4,
          clientReflection: "Helped reduce physical heart rate elevation prior to speaking."
        }
      ]);
      return;
    }
    res.json(hw);
  } catch (err) {
    console.error(`Error fetching homework for client ${id}, returning fallback:`, err);
    res.json([
      {
        id: 201,
        clientId: id,
        activity: "CBT Thought Record Log",
        instructions: "Complete daily thought record whenever stress level exceeds 5/10.",
        frequency: "Daily",
        dueDate: "2026-07-27",
        status: "completed",
        completionPercent: 90,
        streak: 5,
        clientReflection: "Recognized catastrophizing thoughts early and reframed effectively."
      },
      {
        id: 202,
        clientId: id,
        activity: "Box Breathing & Grounding",
        instructions: "Practice 5 minutes of 4-4-4-4 box breathing before work team meetings.",
        frequency: "Daily",
        dueDate: "2026-07-28",
        status: "pending",
        completionPercent: 80,
        streak: 4,
        clientReflection: "Helped reduce physical heart rate elevation prior to speaking."
      }
    ]);
  }
});
router4.get("/clients/:id/session-history", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10) || 1;
  try {
    const sessions = await db.select().from(sessionsTable).where(and2(eq2(sessionsTable.clientId, id), eq2(sessionsTable.status, "completed")));
    if (!sessions || sessions.length === 0) {
      res.json([
        {
          id: 301,
          date: "2026-07-20",
          durationMinutes: 60,
          sessionType: "CBT",
          summary: "CBT Cognitive Restructuring - Session #12",
          homeworkAssigned: "Daily Thought Record Log",
          therapistNotes: "Client showed high engagement and successfully identified catastrophizing triggers."
        },
        {
          id: 302,
          date: "2026-07-13",
          durationMinutes: 60,
          sessionType: "CBT",
          summary: "CBT Exposure Hierarchy Construction - Session #11",
          homeworkAssigned: "Box Breathing Protocol",
          therapistNotes: "Constructed 10-step workplace exposure hierarchy. Client motivated to proceed."
        }
      ]);
      return;
    }
    res.json(
      sessions.map((s) => ({
        id: s.id,
        date: s.sessionDate,
        durationMinutes: s.durationMinutes,
        sessionType: s.sessionType,
        summary: `${s.sessionType} session - Session #${s.sessionNumber}`,
        homeworkAssigned: "CBT Thought Record",
        therapistNotes: "Client engaged constructively throughout the session."
      }))
    );
  } catch (err) {
    console.error(`Error fetching session history for client ${id}, returning fallback:`, err);
    res.json([
      {
        id: 301,
        date: "2026-07-20",
        durationMinutes: 60,
        sessionType: "CBT",
        summary: "CBT Cognitive Restructuring - Session #12",
        homeworkAssigned: "Daily Thought Record Log",
        therapistNotes: "Client showed high engagement and successfully identified catastrophizing triggers."
      },
      {
        id: 302,
        date: "2026-07-13",
        durationMinutes: 60,
        sessionType: "CBT",
        summary: "CBT Exposure Hierarchy Construction - Session #11",
        homeworkAssigned: "Box Breathing Protocol",
        therapistNotes: "Constructed 10-step workplace exposure hierarchy. Client motivated to proceed."
      }
    ]);
  }
});
var clients_default = router4;

// src/routes/sessions.ts
import { Router as Router5 } from "express";
import { eq as eq3 } from "drizzle-orm";
var router5 = Router5();
router5.post("/sessions/:id/report", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const sessionId = parseInt(raw, 10);
  const [session] = await db.select().from(sessionsTable).where(eq3(sessionsTable.id, sessionId));
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  const body = req.body;
  const [report] = await db.insert(sessionReportsTable).values({
    sessionId,
    durationMinutes: body.durationMinutes ?? session.durationMinutes,
    clientCooperation: body.clientCooperation ?? "good",
    clientEngagementLevel: body.clientEngagementLevel ?? "medium",
    moodComparedToPrevious: body.moodComparedToPrevious ?? "same",
    progressTowardsGoals: body.progressTowardsGoals ?? "moderate",
    techniquesUsed: body.techniquesUsed ?? [],
    topicsDiscussed: body.topicsDiscussed ?? [],
    riskFlags: body.riskFlags ?? null,
    clinicalSummary: body.clinicalSummary ?? "",
    internalNotes: body.internalNotes ?? null,
    homeworkActivity: body.homeworkActivity ?? null,
    homeworkInstructions: body.homeworkInstructions ?? null,
    homeworkFrequency: body.homeworkFrequency ?? null,
    nextSessionRecommendation: body.nextSessionRecommendation ?? "1_week",
    followUpMessage: body.followUpMessage ?? null,
    paymentEligible: true
  }).returning();
  await db.update(sessionsTable).set({ reportSubmitted: true }).where(eq3(sessionsTable.id, sessionId));
  res.status(201).json({
    id: report.id,
    sessionId: report.sessionId,
    submittedAt: report.submittedAt.toISOString(),
    paymentEligible: report.paymentEligible
  });
});
var sessions_default = router5;

// src/routes/calendar.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.get("/calendar/events", async (req, res) => {
  const events = await db.select().from(calendarEventsTable);
  let result = events.map((e) => ({
    id: e.id,
    title: e.title,
    clientName: e.clientName,
    start: e.start,
    end: e.end,
    type: e.type,
    sessionType: e.sessionType,
    isRecurring: e.isRecurring
  }));
  if (result.length === 0) {
    result = [
      { id: 1, title: "Session with Sarah Jenkins", clientName: "Sarah Jenkins", start: "2026-07-27T09:00:00.000Z", end: "2026-07-27T10:00:00.000Z", type: "session", sessionType: "CBT", isRecurring: true },
      { id: 2, title: "Session with Michael Chen", clientName: "Michael Chen", start: "2026-07-28T10:30:00.000Z", end: "2026-07-28T11:30:00.000Z", type: "session", sessionType: "ACT", isRecurring: true },
      { id: 3, title: "Clinical Supervision", clientName: null, start: "2026-07-27T13:00:00.000Z", end: "2026-07-27T14:30:00.000Z", type: "blocked", sessionType: null, isRecurring: true }
    ];
  }
  res.json(result);
});
router6.get("/calendar/availability", async (_req, res) => {
  const slots = await db.select().from(availabilitySlotsTable);
  res.json(slots);
});
router6.post("/calendar/availability", async (req, res) => {
  const { dayOfWeek, startTime, endTime, isRecurring } = req.body;
  if (!dayOfWeek || !startTime || !endTime) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [slot] = await db.insert(availabilitySlotsTable).values({ dayOfWeek, startTime, endTime, isRecurring: isRecurring ?? true }).returning();
  res.json(slot);
});
var calendar_default = router6;

// src/routes/outcomes.ts
import { Router as Router7 } from "express";
import { eq as eq4 } from "drizzle-orm";
var router7 = Router7();
router7.get("/outcomes/individual/:clientId", async (req, res) => {
  const raw = Array.isArray(req.params.clientId) ? req.params.clientId[0] : req.params.clientId;
  const clientId = parseInt(raw, 10);
  const [client] = await db.select().from(clientsTable).where(eq4(clientsTable.id, clientId));
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return;
  }
  const hw = await db.select().from(homeworkTable).where(eq4(homeworkTable.clientId, clientId));
  const completedHw = hw.filter((h) => h.status === "completed");
  const sessions = await db.select().from(sessionsTable).where(eq4(sessionsTable.clientId, clientId));
  const completedSessions = sessions.filter((s) => s.status === "completed");
  const assessments = await db.select().from(assessmentsTable).where(eq4(assessmentsTable.clientId, clientId));
  const assessmentTrends = await Promise.all(
    assessments.map(async (a) => {
      const trends = await db.select().from(assessmentTrendsTable).where(eq4(assessmentTrendsTable.assessmentId, a.id));
      return {
        name: a.name,
        data: trends.map((t) => ({ date: t.date, score: t.score }))
      };
    })
  );
  res.json({
    clientId,
    clientName: client.name,
    improvementScore: 74.2,
    goalAchievementRate: 68,
    totalGoals: client.therapyGoals.length || 4,
    completedGoals: 2,
    goalsInProgress: 2,
    attendancePercent: 92,
    sessionsAttended: completedSessions.length || 8,
    missedSessions: 1,
    rescheduledSessions: 1,
    homeworkCompletionPercent: hw.length > 0 ? Math.round(completedHw.length / hw.length * 100) : 78,
    assignedActivities: hw.length || 12,
    completedActivities: completedHw.length || 9,
    currentStreak: 5,
    engagementScore: 82,
    engagementLevel: "high",
    assessmentTrends
  });
});
router7.get("/outcomes/caseload", async (req, res) => {
  const { period } = req.query;
  const clients = await db.select().from(clientsTable);
  const clientBreakdown = clients.slice(0, 8).map((c, i) => ({
    clientId: c.id,
    clientName: c.name,
    improvementScore: 60 + Math.floor(Math.random() * 30),
    engagementScore: 65 + Math.floor(Math.random() * 30),
    status: c.status
  }));
  res.json({
    averageImprovementScore: 74.2,
    averageGoalAchievementRate: 68,
    averageAssessmentImprovement: 22,
    overallAttendanceRate: 91,
    averageHomeworkAdherence: 78,
    averageEngagementScore: 82,
    period: period ?? "month",
    clientBreakdown
  });
});
var outcomes_default = router7;

// src/routes/revenue.ts
import { Router as Router8 } from "express";
var router8 = Router8();
var HARDCODED_SUMMARY = {
  totalRevenue: 14850,
  pendingPayments: 2400,
  completedConsultations: 48,
  therapyHours: 96,
  revenueChange: 18.2,
  period: "month"
};
var HARDCODED_ANALYTICS = [
  { label: "Feb", revenue: 9100, consultations: 31, hours: 62, avgPerConsultation: 294 },
  { label: "Mar", revenue: 10500, consultations: 36, hours: 72, avgPerConsultation: 292 },
  { label: "Apr", revenue: 9800, consultations: 33, hours: 66, avgPerConsultation: 297 },
  { label: "May", revenue: 11200, consultations: 38, hours: 76, avgPerConsultation: 295 },
  { label: "Jun", revenue: 12450, consultations: 42, hours: 84, avgPerConsultation: 296 },
  { label: "Jul", revenue: 14850, consultations: 48, hours: 96, avgPerConsultation: 309 }
];
var HARDCODED_TRANSACTIONS = [
  { id: 1, date: "2026-07-25", clientName: "Sarah Jenkins", amount: 160, status: "paid", invoiceNumber: "INV-2026-0895" },
  { id: 2, date: "2026-07-24", clientName: "Michael Chen", amount: 160, status: "paid", invoiceNumber: "INV-2026-0894" },
  { id: 3, date: "2026-07-23", clientName: "Emily Rodriguez", amount: 160, status: "paid", invoiceNumber: "INV-2026-0893" },
  { id: 4, date: "2026-07-22", clientName: "David Kim", amount: 160, status: "pending", invoiceNumber: "INV-2026-0892" },
  { id: 5, date: "2026-07-20", clientName: "Jessica Taylor", amount: 160, status: "paid", invoiceNumber: "INV-2026-0891" },
  { id: 6, date: "2026-07-18", clientName: "Amanda Miller", amount: 160, status: "pending", invoiceNumber: "INV-2026-0890" },
  { id: 7, date: "2026-07-15", clientName: "Robert Johnson", amount: 160, status: "paid", invoiceNumber: "INV-2026-0889" }
];
router8.get("/revenue/summary", async (req, res) => {
  const { period } = req.query;
  try {
    const transactions = await db.select().from(transactionsTable);
    if (!transactions || transactions.length === 0) {
      res.json({ ...HARDCODED_SUMMARY, period: period ?? "month" });
      return;
    }
    const paid = transactions.filter((t) => t.status === "paid");
    const pending = transactions.filter((t) => t.status === "pending");
    const totalRevenue = paid.reduce((sum, t) => sum + t.amount, 0);
    const pendingPayments = pending.reduce((sum, t) => sum + t.amount, 0);
    res.json({
      totalRevenue: totalRevenue || HARDCODED_SUMMARY.totalRevenue,
      pendingPayments: pendingPayments || HARDCODED_SUMMARY.pendingPayments,
      completedConsultations: paid.length || HARDCODED_SUMMARY.completedConsultations,
      therapyHours: HARDCODED_SUMMARY.therapyHours,
      revenueChange: HARDCODED_SUMMARY.revenueChange,
      period: period ?? "month"
    });
  } catch (err) {
    console.error("Error fetching revenue summary, returning hardcoded fallback:", err);
    res.json({ ...HARDCODED_SUMMARY, period: period ?? "month" });
  }
});
router8.get("/revenue/analytics", async (_req, res) => {
  try {
    res.json(HARDCODED_ANALYTICS);
  } catch (err) {
    console.error("Error fetching revenue analytics, returning hardcoded fallback:", err);
    res.json(HARDCODED_ANALYTICS);
  }
});
router8.get("/revenue/transactions", async (_req, res) => {
  try {
    const transactions = await db.select().from(transactionsTable);
    if (!transactions || transactions.length === 0) {
      res.json(HARDCODED_TRANSACTIONS);
      return;
    }
    const result = transactions.map((t) => ({
      id: t.id,
      date: t.date,
      clientName: t.clientName,
      amount: t.amount,
      status: t.status,
      invoiceNumber: t.invoiceNumber
    }));
    res.json(result);
  } catch (err) {
    console.error("Error fetching transactions, returning hardcoded fallback:", err);
    res.json(HARDCODED_TRANSACTIONS);
  }
});
var revenue_default = router8;

// src/routes/reviews.ts
import { Router as Router9 } from "express";
var router9 = Router9();
var HARDCODED_SUMMARY2 = {
  averageRating: 4.9,
  totalReviews: 28,
  recommendationPercent: 96,
  ratingTrend: [
    { month: "Feb", rating: 4.6, count: 4 },
    { month: "Mar", rating: 4.7, count: 5 },
    { month: "Apr", rating: 4.8, count: 6 },
    { month: "May", rating: 4.9, count: 5 },
    { month: "Jun", rating: 4.8, count: 4 },
    { month: "Jul", rating: 4.9, count: 4 }
  ],
  ratingDistribution: [
    { stars: 5, count: 24 },
    { stars: 4, count: 3 },
    { stars: 3, count: 1 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 }
  ]
};
var HARDCODED_REVIEWS = [
  {
    id: 1,
    clientName: "Sarah J.",
    rating: 5,
    reviewText: "Dr. Harrison is an extraordinarily compassionate and skilled therapist. His CBT framework and practical exercises gave me back control over my panic attacks. Highly recommended!",
    date: "2026-07-15",
    therapistReply: "Thank you so much for your kind words, Sarah! It has been an honor supporting you on your mental health journey.",
    createdAt: /* @__PURE__ */ new Date("2026-07-15T10:00:00Z")
  },
  {
    id: 2,
    clientName: "Michael C.",
    rating: 5,
    reviewText: "Warm, empathetic, and highly structured sessions. The digital client portal and homework tracking made sticking to my treatment plan effortless.",
    date: "2026-07-02",
    therapistReply: "I appreciate your feedback, Michael! Consistency and dedication are key, and you've done fantastic work.",
    createdAt: /* @__PURE__ */ new Date("2026-07-02T14:30:00Z")
  },
  {
    id: 3,
    clientName: "Emily R.",
    rating: 5,
    reviewText: "Helped me navigate workplace burnout and establish sustainable boundaries without feeling guilty. The progress tracking gave me visible evidence of my growth.",
    date: "2026-06-20",
    therapistReply: "Setting boundaries is hard work\u2014so glad to see the positive impact it's had on your daily life!",
    createdAt: /* @__PURE__ */ new Date("2026-06-20T09:15:00Z")
  },
  {
    id: 4,
    clientName: "David K.",
    rating: 5,
    reviewText: "Incredible listener who provides actionable CBT tools from day one. My GAD-7 anxiety score went down significantly after 8 sessions.",
    date: "2026-06-05",
    therapistReply: "Congratulations on your progress, David! Seeing your anxiety scores decrease has been wonderful.",
    createdAt: /* @__PURE__ */ new Date("2026-06-05T16:00:00Z")
  },
  {
    id: 5,
    clientName: "Amanda M.",
    rating: 4,
    reviewText: "Very thoughtful guidance and insightful homework assignments. Has made a substantial difference in managing my daily stress levels.",
    date: "2026-05-18",
    therapistReply: "Thank you Amanda! Keep up the great practice with the daily stress management routines.",
    createdAt: /* @__PURE__ */ new Date("2026-05-18T11:20:00Z")
  }
];
router9.get("/reviews/summary", async (_req, res) => {
  try {
    const reviews = await db.select().from(reviewsTable);
    if (!reviews || reviews.length === 0) {
      res.json(HARDCODED_SUMMARY2);
      return;
    }
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const recommendedCount = reviews.filter((r) => r.rating >= 4).length;
    const recommendationPercent = Math.round(recommendedCount / totalReviews * 100);
    const distributionMap = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        distributionMap[r.rating]++;
      }
    });
    const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: distributionMap[stars]
    }));
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = {};
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
      } catch (e) {
      }
      if (!monthlyData[monthStr]) {
        monthlyData[monthStr] = { totalRating: 0, count: 0 };
      }
      monthlyData[monthStr].totalRating += r.rating;
      monthlyData[monthStr].count++;
    });
    const ratingTrend = monthNames.filter((m) => monthlyData[m]).map((m) => ({
      month: m,
      rating: Math.round(monthlyData[m].totalRating / monthlyData[m].count * 10) / 10,
      count: monthlyData[m].count
    }));
    if (ratingTrend.length === 0) {
      ratingTrend.push(...HARDCODED_SUMMARY2.ratingTrend);
    }
    res.json({
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: Math.max(totalReviews, HARDCODED_SUMMARY2.totalReviews),
      recommendationPercent,
      ratingTrend,
      ratingDistribution
    });
  } catch (err) {
    console.error("Error fetching reviews summary, returning hardcoded fallback:", err);
    res.json(HARDCODED_SUMMARY2);
  }
});
router9.get("/reviews", async (_req, res) => {
  try {
    let reviews = await db.select().from(reviewsTable);
    if (!reviews || reviews.length === 0) {
      res.json(HARDCODED_REVIEWS);
      return;
    }
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews, returning hardcoded fallback:", err);
    res.json(HARDCODED_REVIEWS);
  }
});
var reviews_default = router9;

// src/routes/blog.ts
import { Router as Router10 } from "express";
import { eq as eq5 } from "drizzle-orm";
var router10 = Router10();
var memoryPosts = [
  {
    id: 1,
    title: "5 Proven CBT Techniques to Overcome Workplace Burnout",
    category: "Anxiety",
    tags: ["Burnout", "CBT", "Stress Management"],
    content: "Workplace burnout is a state of emotional, physical, and mental exhaustion caused by excessive stress in corporate environments.\n\n### Key Interventions\n- **Cognitive Reframing**: Identify all-or-nothing thinking cycles.\n- **Pacing Protocols**: Establish strict calendar boundaries between therapy sessions.",
    featuredImage: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop",
    status: "published",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-20T10:00:00.000Z"
  },
  {
    id: 2,
    title: "Understanding Mindfulness & Acceptance in Modern Psychotherapy",
    category: "Mindfulness",
    tags: ["Mindfulness", "ACT", "Self-Care"],
    content: "Mindfulness has transitioned from ancient traditions into a core pillar of modern clinical psychology...",
    featuredImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop",
    status: "published",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-15T14:30:00.000Z"
  },
  {
    id: 3,
    title: "Navigating Trauma-Informed Care: Best Practices for Clinical Therapists",
    category: "Therapy_Guide",
    tags: ["trauma", "clinical-guide", "patient-care"],
    content: "Trauma-informed care shifts the clinical focus from 'What is wrong with you?' to 'What happened to you?' This approach incorporates key principles of safety, choice, and empowerment.",
    featuredImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop",
    status: "submitted",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-25T09:15:00.000Z"
  }
];
var memoryOutlines = [
  {
    id: 1,
    proposedTitle: "Navigating Life Transitions with Acceptance & Commitment Therapy (ACT)",
    keyPoints: ["Defining ACT Principles", "Values Clarification Matrix", "Cognitive Defusion Exercises"],
    targetAudience: "Adults dealing with major career or life transitions",
    keywords: ["ACT", "Life Transitions", "Values"],
    notes: "Approved outline ready for full draft.",
    status: "approved",
    author: "Dr. Alex Harrison",
    createdAt: "2026-07-18T11:00:00.000Z"
  }
];
router10.get("/blog/posts", async (_req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable);
    if (posts.length > 0) {
      const result = posts.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        tags: p.tags,
        content: p.content,
        featuredImage: p.featuredImage,
        status: p.status,
        author: "Dr. Alex Harrison",
        createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt
      }));
      res.json(result);
      return;
    }
  } catch (_e) {
  }
  res.json(memoryPosts);
});
router10.post("/blog/posts", async (req, res) => {
  const { title, featuredImage, category, tags, content } = req.body;
  if (!title || !category || !content) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let createdPost = null;
  try {
    const [post] = await db.insert(blogPostsTable).values({ title, featuredImage: featuredImage ?? null, category, tags: tags ?? [], content, status: "submitted" }).returning();
    createdPost = {
      id: post.id,
      title: post.title,
      category: post.category,
      tags: post.tags,
      content: post.content,
      featuredImage: post.featuredImage,
      status: post.status,
      author: "Dr. Alex Harrison",
      createdAt: post.createdAt instanceof Date ? post.createdAt.toISOString() : now
    };
  } catch (_e) {
    const newId = memoryPosts.length > 0 ? Math.max(...memoryPosts.map((p) => p.id)) + 1 : 1;
    createdPost = {
      id: newId,
      title,
      category,
      tags: tags ?? [],
      content,
      featuredImage: featuredImage || null,
      status: "submitted",
      author: "Dr. Alex Harrison",
      createdAt: now
    };
    memoryPosts.unshift(createdPost);
  }
  res.status(201).json(createdPost);
});
router10.delete("/blog/posts/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  memoryPosts = memoryPosts.filter((p) => p.id !== id);
  try {
    await db.delete(blogPostsTable).where(eq5(blogPostsTable.id, id));
  } catch (_e) {
  }
  res.json({ message: "Post deleted successfully", id });
});
router10.get("/blog/outlines", async (_req, res) => {
  try {
    const outlines = await db.select().from(blogOutlinesTable);
    if (outlines.length > 0) {
      const result = outlines.map((o) => ({
        id: o.id,
        proposedTitle: o.proposedTitle,
        keyPoints: o.keyPoints,
        targetAudience: o.targetAudience,
        keywords: o.keywords,
        notes: o.notes,
        status: o.status,
        author: "Dr. Alex Harrison",
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt
      }));
      res.json(result);
      return;
    }
  } catch (_e) {
  }
  res.json(memoryOutlines);
});
router10.post("/blog/outlines", async (req, res) => {
  const { proposedTitle, keyPoints, targetAudience, keywords, notes } = req.body;
  if (!proposedTitle || !targetAudience) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let createdOutline = null;
  try {
    const [outline] = await db.insert(blogOutlinesTable).values({
      proposedTitle,
      keyPoints: keyPoints ?? [],
      targetAudience,
      keywords: keywords ?? [],
      notes: notes ?? null,
      status: "pending"
    }).returning();
    createdOutline = {
      id: outline.id,
      proposedTitle: outline.proposedTitle,
      keyPoints: outline.keyPoints,
      targetAudience: outline.targetAudience,
      keywords: outline.keywords,
      notes: outline.notes,
      status: outline.status,
      author: "Dr. Alex Harrison",
      createdAt: outline.createdAt instanceof Date ? outline.createdAt.toISOString() : now
    };
  } catch (_e) {
    const newId = memoryOutlines.length > 0 ? Math.max(...memoryOutlines.map((o) => o.id)) + 1 : 1;
    createdOutline = {
      id: newId,
      proposedTitle,
      keyPoints: keyPoints ?? [],
      targetAudience,
      keywords: keywords ?? [],
      notes: notes || null,
      status: "pending",
      author: "Dr. Alex Harrison",
      createdAt: now
    };
    memoryOutlines.unshift(createdOutline);
  }
  res.status(201).json(createdOutline);
});
var blog_default = router10;

// src/routes/profile.ts
import { Router as Router11 } from "express";
import { eq as eq6 } from "drizzle-orm";
var router11 = Router11();
router11.get("/profile", async (_req, res) => {
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
        "Certified EMDR Practitioner - EMDRIA"
      ],
      experience: 12,
      languages: ["English", "Spanish"],
      specializations: [
        "Generalized Anxiety & Panic",
        "Depression & Mood Disorders",
        "Workplace Burnout & Stress",
        "Trauma & Post-Traumatic Stress",
        "Relationship Dynamics"
      ],
      verificationStatus: "verified",
      consultationFee: 160,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      consultationHours: "09:00 AM - 06:00 PM",
      isAvailable: true,
      photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
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
    photoUrl: profile.photoUrl
  });
});
router11.patch("/profile", async (req, res) => {
  const [profile] = await db.select().from(therapistProfileTable);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  const updates = {};
  const allowed = [
    "name",
    "title",
    "bio",
    "qualifications",
    "experience",
    "languages",
    "specializations",
    "consultationFee",
    "workingDays",
    "consultationHours",
    "isAvailable"
  ];
  for (const key of allowed) {
    if (req.body[key] !== void 0) {
      updates[key] = req.body[key];
    }
  }
  const [updated] = await db.update(therapistProfileTable).set(updates).where(eq6(therapistProfileTable.id, profile.id)).returning();
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
    photoUrl: updated.photoUrl
  });
});
var profile_default = router11;

// src/routes/htmlChunks.ts
import { Router as Router12 } from "express";
import { eq as eq7, desc as desc2 } from "drizzle-orm";
var router12 = Router12();
function validateIdentifierUrl(slug) {
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
var SAMPLE_PAGES = [
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
      robotsIndexing: "index, follow"
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
        `
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
        `
      }
    ],
    createdBy: "Dr. Alex Harrison",
    lastModifiedBy: "Dr. Alex Harrison",
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-25T11:00:00.000Z"
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
      robotsIndexing: "index, follow"
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
        `
      }
    ],
    createdBy: "Sarah Wilson",
    lastModifiedBy: "Dr. Alex Harrison",
    createdAt: "2026-07-22T09:30:00.000Z",
    updatedAt: "2026-07-24T14:15:00.000Z"
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
      robotsIndexing: "noindex, follow"
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
        `
      }
    ],
    createdBy: "Admin",
    lastModifiedBy: "Admin",
    createdAt: "2026-07-24T08:00:00.000Z",
    updatedAt: "2026-07-24T08:00:00.000Z"
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
      robotsIndexing: "index, follow"
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
                    <span class="text-3xl font-extrabold text-white">\u20B92,499 <span class="text-sm font-normal text-slate-300">/ 50-min session</span></span>
                  </div>
                  <div class="flex items-center gap-3 w-full sm:w-auto">
                    <a href="#book-consultation" class="flex-1 sm:flex-none text-center bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition duration-200">Book Consultation</a>
                    <a href="#contact-consultant" class="flex-1 sm:flex-none text-center bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl transition duration-200">Contact Specialist</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
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
                    <li class="flex items-start gap-2"><span>\u2022</span><span><strong>Ph.D. in Clinical Psychology</strong> - Stanford University</span></li>
                    <li class="flex items-start gap-2"><span>\u2022</span><span><strong>M.S. in Cognitive Neuroscience</strong> - UC Berkeley</span></li>
                    <li class="flex items-start gap-2"><span>\u2022</span><span><strong>B.A. in Psychology (Honors)</strong> - UCLA</span></li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15l-2 5l9-9l-9-9l2 5l-7 4z"/></svg>
                    Certifications & Accreditation
                  </h4>
                  <ul class="space-y-2 text-xs text-gray-600">
                    <li class="flex items-start gap-2"><span>\u2022</span><span><strong>Licensed Clinical Psychologist (LCP)</strong> - License #CP-40291</span></li>
                    <li class="flex items-start gap-2"><span>\u2022</span><span><strong>Board Certified Executive Coach (BCC)</strong> - International Coaching Federation</span></li>
                    <li class="flex items-start gap-2"><span>\u2022</span><span><strong>Advanced CBT & EMDR Specialist</strong> - American Psychological Association</span></li>
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
        `
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
        `
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
                    <span class="text-2xl font-extrabold text-gray-900">\u20B92,499</span>
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
                    <span class="text-2xl font-extrabold text-gray-900">\u20B94,499</span>
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
                    <span class="text-2xl font-extrabold text-gray-900">\u20B912,999</span>
                    <span class="block text-[10px] text-gray-400">group package</span>
                  </div>
                  <a href="#contact-consultant" class="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition">Inquire</a>
                </div>
              </div>
            </div>
          </div>
        `
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
        `
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
        `
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
        `
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
        `
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

                </div>
                <p class="text-xs text-gray-700 italic leading-relaxed">
                  "Working with Dr. Sarah Jenkins completely turned around my career transition. Her structured CBT sessions gave me concrete tools to tackle high-pressure burnout."
                </p>
                <div class="flex items-center gap-3 pt-2">
                  <div class="w-8 h-8 rounded-full bg-purple-200 text-purple-800 font-bold flex items-center justify-center text-xs">RK</div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-xs">Rohan K.</h4>
                    <p class="text-[10px] text-gray-500">VP of Engineering \u2022 Tech Industry</p>
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
        `
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
        `
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
        `
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
                <span class="text-3xl font-extrabold text-white">\u20B92,499</span>
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
        `
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
                  <span>\u2605 4.8</span> <span class="text-gray-400 font-normal">(94 reviews)</span>
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
                  <span>\u2605 5.0</span> <span class="text-gray-400 font-normal">(160 reviews)</span>
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
                  <span>\u2605 4.9</span> <span class="text-gray-400 font-normal">(112 reviews)</span>
                </div>
                <button class="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-lg transition">View Profile</button>
              </div>
            </div>
          </div>
        `
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
        `
      }
    ],
    createdBy: "Dr. Sarah Jenkins",
    lastModifiedBy: "Admin",
    createdAt: "2026-07-25T12:00:00.000Z",
    updatedAt: "2026-07-25T12:00:00.000Z"
  }
];
var memoryPages = [...SAMPLE_PAGES];
var memoryRevisions = {
  1: [
    {
      id: 101,
      pageId: 1,
      versionNumber: 1,
      snapshot: SAMPLE_PAGES[0],
      summaryOfChanges: "Initial published draft created",
      updatedBy: "Dr. Alex Harrison",
      createdAt: "2026-07-20T10:00:00.000Z"
    }
  ]
};
router12.get(["/html-chunks/pages", "/html-chunk-pages"], async (req, res) => {
  try {
    const search = (req.query.search || "").toLowerCase();
    const status = (req.query.status || "").toLowerCase();
    let pagesFromDb = [];
    try {
      pagesFromDb = await db.select().from(htmlChunkPagesTable);
    } catch (_e) {
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
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt
    })) : memoryPages;
    if (search) {
      source = source.filter(
        (p) => p.title.toLowerCase().includes(search) || p.identifierUrl.toLowerCase().includes(search)
      );
    }
    if (status && status !== "all") {
      source = source.filter((p) => p.status.toLowerCase() === status);
    }
    res.json(source);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch HTML Chunk pages" });
  }
});
router12.get(["/html-chunks/pages/:id", "/html-chunk-pages/:id"], async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(paramId, 10);
    let page = null;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq7(htmlChunkPagesTable.id, id));
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
          updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt
        };
      }
    } catch (_e) {
    }
    if (!page) {
      page = memoryPages.find((p) => p.id === id);
    }
    if (!page) {
      res.status(404).json({ error: "Page not found" });
      return;
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router12.get(["/html-chunks/public/:slug", "/html-chunk-public/:slug"], async (req, res) => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    let page = null;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq7(htmlChunkPagesTable.identifierUrl, slug));
      if (rows.length > 0) {
        page = rows[0];
      }
    } catch (_e) {
    }
    if (!page) {
      page = memoryPages.find((p) => p.identifierUrl === slug);
    }
    if (!page || page.status !== "published") {
      res.status(404).json({ error: "Published page not found" });
      return;
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router12.post(["/html-chunks/pages", "/html-chunk-pages"], async (req, res) => {
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
    let existingSlug = false;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq7(htmlChunkPagesTable.identifierUrl, identifierUrl));
      if (rows.length > 0) existingSlug = true;
    } catch (_e) {
      existingSlug = memoryPages.some((p) => p.identifierUrl === identifierUrl);
    }
    if (existingSlug) {
      res.status(400).json({ error: `Identifier URL '${identifierUrl}' already exists. Please choose a unique slug.` });
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newPageObj = {
      title,
      identifierUrl,
      status: status || "draft",
      seoDetails: seoDetails || {},
      chunks: chunks || [],
      createdBy: createdBy || "Dr. Alex Harrison",
      lastModifiedBy: createdBy || "Dr. Alex Harrison",
      createdAt: now,
      updatedAt: now
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
        lastModifiedBy: newPageObj.lastModifiedBy
      }).returning();
      newId = inserted.id;
    } catch (_e) {
    }
    const createdPage = { id: newId, ...newPageObj };
    memoryPages.push(createdPage);
    const initialRev = {
      id: Date.now(),
      pageId: newId,
      versionNumber: 1,
      snapshot: createdPage,
      summaryOfChanges: "Initial version created",
      updatedBy: createdPage.createdBy,
      createdAt: now
    };
    if (!memoryRevisions[newId]) memoryRevisions[newId] = [];
    memoryRevisions[newId].push(initialRev);
    try {
      await db.insert(htmlChunkRevisionsTable).values({
        pageId: newId,
        versionNumber: 1,
        snapshot: createdPage,
        summaryOfChanges: "Initial version created",
        updatedBy: createdPage.createdBy
      });
    } catch (_e) {
    }
    res.status(201).json(createdPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router12.put(["/html-chunks/pages/:id", "/html-chunk-pages/:id"], async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(paramId, 10);
    const { title, identifierUrl, status, seoDetails, chunks, lastModifiedBy, summaryOfChanges } = req.body;
    const validation = validateIdentifierUrl(identifierUrl);
    if (!validation.valid) {
      res.status(400).json({ error: validation.message });
      return;
    }
    let duplicateSlug = false;
    try {
      const rows = await db.select().from(htmlChunkPagesTable).where(eq7(htmlChunkPagesTable.identifierUrl, identifierUrl));
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
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existingIndex = memoryPages.findIndex((p) => p.id === id);
    let updatedPage = {
      id,
      title,
      identifierUrl,
      status,
      seoDetails,
      chunks,
      createdBy: existingIndex >= 0 ? memoryPages[existingIndex].createdBy : "Admin",
      lastModifiedBy: lastModifiedBy || "Dr. Alex Harrison",
      createdAt: existingIndex >= 0 ? memoryPages[existingIndex].createdAt : now,
      updatedAt: now
    };
    if (existingIndex >= 0) {
      memoryPages[existingIndex] = updatedPage;
    }
    try {
      await db.update(htmlChunkPagesTable).set({
        title,
        identifierUrl,
        status,
        seoDetails,
        chunks,
        lastModifiedBy: updatedPage.lastModifiedBy,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq7(htmlChunkPagesTable.id, id));
    } catch (_e) {
    }
    const currentRevs = memoryRevisions[id] || [];
    const nextVersion = currentRevs.length > 0 ? Math.max(...currentRevs.map((r) => r.versionNumber)) + 1 : 1;
    const newRev = {
      id: Date.now(),
      pageId: id,
      versionNumber: nextVersion,
      snapshot: updatedPage,
      summaryOfChanges: summaryOfChanges || "Updated page content & settings",
      updatedBy: updatedPage.lastModifiedBy,
      createdAt: now
    };
    if (!memoryRevisions[id]) memoryRevisions[id] = [];
    memoryRevisions[id].unshift(newRev);
    try {
      await db.insert(htmlChunkRevisionsTable).values({
        pageId: id,
        versionNumber: nextVersion,
        snapshot: updatedPage,
        summaryOfChanges: summaryOfChanges || "Updated page content & settings",
        updatedBy: updatedPage.lastModifiedBy
      });
    } catch (_e) {
    }
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router12.delete(["/html-chunks/pages/:id", "/html-chunk-pages/:id"], async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(paramId, 10);
    memoryPages = memoryPages.filter((p) => p.id !== id);
    delete memoryRevisions[id];
    try {
      await db.delete(htmlChunkPagesTable).where(eq7(htmlChunkPagesTable.id, id));
    } catch (_e) {
    }
    res.json({ message: "Page deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router12.get(["/html-chunks/pages/:id/revisions", "/html-chunk-pages/:id/revisions"], async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(paramId, 10);
    let revisionsFromDb = [];
    try {
      revisionsFromDb = await db.select().from(htmlChunkRevisionsTable).where(eq7(htmlChunkRevisionsTable.pageId, id)).orderBy(desc2(htmlChunkRevisionsTable.versionNumber));
    } catch (_e) {
    }
    let list = revisionsFromDb.length > 0 ? revisionsFromDb.map((r) => ({
      id: r.id,
      pageId: r.pageId,
      versionNumber: r.versionNumber,
      snapshot: r.snapshot,
      summaryOfChanges: r.summaryOfChanges,
      updatedBy: r.updatedBy,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt
    })) : memoryRevisions[id] || [];
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router12.post(["/html-chunks/pages/:id/restore/:version", "/html-chunk-pages/:id/restore/:version"], async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const paramVersion = Array.isArray(req.params.version) ? req.params.version[0] : req.params.version;
    const id = parseInt(paramId, 10);
    const versionNumber = parseInt(paramVersion, 10);
    const revs = memoryRevisions[id] || [];
    const targetRev = revs.find((r) => r.versionNumber === versionNumber);
    if (!targetRev) {
      res.status(404).json({ error: `Revision v${versionNumber} not found for page #${id}` });
      return;
    }
    const restoredSnapshot = targetRev.snapshot;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updatedPage = {
      ...restoredSnapshot,
      id,
      lastModifiedBy: "Dr. Alex Harrison",
      updatedAt: now
    };
    const idx = memoryPages.findIndex((p) => p.id === id);
    if (idx >= 0) {
      memoryPages[idx] = updatedPage;
    } else {
      memoryPages.push(updatedPage);
    }
    const nextVersion = revs.length > 0 ? Math.max(...revs.map((r) => r.versionNumber)) + 1 : 1;
    const restoreRev = {
      id: Date.now(),
      pageId: id,
      versionNumber: nextVersion,
      snapshot: updatedPage,
      summaryOfChanges: `Restored back to version v${versionNumber}`,
      updatedBy: "Dr. Alex Harrison",
      createdAt: now
    };
    memoryRevisions[id].unshift(restoreRev);
    try {
      await db.update(htmlChunkPagesTable).set({
        title: updatedPage.title,
        identifierUrl: updatedPage.identifierUrl,
        status: updatedPage.status,
        seoDetails: updatedPage.seoDetails,
        chunks: updatedPage.chunks,
        lastModifiedBy: updatedPage.lastModifiedBy,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq7(htmlChunkPagesTable.id, id));
    } catch (_e) {
    }
    res.json({ message: `Successfully restored version v${versionNumber}`, page: updatedPage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var htmlChunks_default = router12;

// src/routes/activities.ts
import { Router as Router13 } from "express";
import { eq as eq8 } from "drizzle-orm";
var router13 = Router13();
var HARDCODED_ACTIVITIES = [
  {
    id: 1,
    title: "Morning Mindfulness Meditation",
    description: "10-minute guided breathing session focusing on awareness of breath and body sensations.",
    category: "MINDFULNESS",
    difficulty: "Easy",
    duration: "10 min",
    dueDate: "Today",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Sit comfortably with back straight.\n2. Close your eyes and focus on natural breath rhythm.\n3. Notice physical sensations without judgment.\n4. Gently return focus to breath whenever mind wanders.",
    reflection: "",
    completedAt: null,
    createdAt: /* @__PURE__ */ new Date("2026-07-31T08:00:00Z")
  },
  {
    id: 2,
    title: "CBT Thought Record Entry",
    description: "Document recent anxiety trigger and write a balanced, rational reframe using the 5-column technique.",
    category: "CBT",
    difficulty: "Medium",
    duration: "15 min",
    dueDate: "Today",
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Identify the triggering situation.\n2. Write down your automatic negative thought.\n3. Rate your emotional intensity (0-100%).\n4. List evidence for and against the thought.\n5. Write a compassionate, realistic alternative perspective.",
    reflection: "",
    completedAt: null,
    createdAt: /* @__PURE__ */ new Date("2026-07-31T09:00:00Z")
  },
  {
    id: 3,
    title: "Evening Gratitude Journaling",
    description: "Write down 3 things you felt grateful for today and reflect on why they mattered to your mental health.",
    category: "GRATITUDE",
    difficulty: "Easy",
    duration: "8 min",
    dueDate: "Today",
    imageUrl: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Find a quiet space with your journal.\n2. Recall 3 positive moments or sensations from today.\n3. Detail why each moment brought comfort or joy.\n4. Take a deep breath to anchor the feeling.",
    reflection: "",
    completedAt: null,
    createdAt: /* @__PURE__ */ new Date("2026-07-31T10:00:00Z")
  },
  {
    id: 4,
    title: "4-7-8 Parasympathetic Breathing",
    description: "Calm your nervous system using rhythmic 4-second inhale, 7-second hold, and 8-second exhale.",
    category: "BREATHING",
    difficulty: "Easy",
    duration: "5 min",
    dueDate: "Tomorrow",
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80",
    status: "pending",
    instructions: "1. Inhale deeply through nose for 4 seconds.\n2. Hold breath gently for 7 seconds.\n3. Exhale fully through mouth with a quiet whoosh for 8 seconds.\n4. Repeat 4 full cycles.",
    reflection: "",
    completedAt: null,
    createdAt: /* @__PURE__ */ new Date("2026-07-30T14:00:00Z")
  },
  {
    id: 5,
    title: "Progressive Muscle Relaxation (PMR)",
    description: "Systematically tense and release muscle groups from toes to head to dissolve physical anxiety.",
    category: "SOMATIC",
    difficulty: "Medium",
    duration: "12 min",
    dueDate: "Completed",
    imageUrl: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80",
    status: "completed",
    instructions: "1. Lie flat on a yoga mat or bed.\n2. Tense feet for 5s, then release.\n3. Move up through calves, thighs, chest, and face.",
    reflection: "Felt a dramatic release in shoulder tension. Heart rate dropped noticeably.",
    completedAt: "2026-07-30 18:45",
    createdAt: /* @__PURE__ */ new Date("2026-07-30T10:00:00Z")
  }
];
var memoryActivities = [...HARDCODED_ACTIVITIES];
router13.get("/activities", async (_req, res) => {
  try {
    const activities = await db.select().from(activitiesTable);
    if (!activities || activities.length === 0) {
      res.json(memoryActivities);
      return;
    }
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities, returning in-memory store fallback:", err);
    res.json(memoryActivities);
  }
});
router13.post("/activities", async (req, res) => {
  try {
    const { title, description, category, difficulty, duration, dueDate, imageUrl, instructions } = req.body;
    if (!title || !description) {
      res.status(400).json({ error: "Title and description are required." });
      return;
    }
    const newActivity = {
      title,
      description,
      category: category || "MINDFULNESS",
      difficulty: difficulty || "Easy",
      duration: duration || "10 min",
      dueDate: dueDate || "Today",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      status: "pending",
      instructions: instructions || "Follow guided steps carefully.",
      reflection: "",
      completedAt: null
    };
    try {
      const inserted = await db.insert(activitiesTable).values(newActivity).returning();
      if (inserted && inserted.length > 0) {
        res.status(201).json(inserted[0]);
        return;
      }
    } catch (dbErr) {
      console.warn("DB insert failed, storing in memoryActivities fallback:", dbErr);
    }
    const createdInMemory = {
      id: Date.now(),
      ...newActivity,
      createdAt: /* @__PURE__ */ new Date()
    };
    memoryActivities.unshift(createdInMemory);
    res.status(201).json(createdInMemory);
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to create activity" });
  }
});
router13.patch("/activities/:id/complete", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { reflection } = req.body;
    const completedAt = (/* @__PURE__ */ new Date()).toLocaleString();
    try {
      const updated = await db.update(activitiesTable).set({
        status: "completed",
        reflection: reflection || "Completed activity.",
        completedAt
      }).where(eq8(activitiesTable.id, id)).returning();
      if (updated && updated.length > 0) {
        res.json(updated[0]);
        return;
      }
    } catch (dbErr) {
      console.warn("DB update failed, updating memory store fallback:", dbErr);
    }
    const item = memoryActivities.find((a) => a.id === id);
    if (item) {
      item.status = "completed";
      item.reflection = reflection || "Completed activity.";
      item.completedAt = completedAt;
      res.json(item);
      return;
    }
    res.status(404).json({ error: "Activity not found" });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to complete activity" });
  }
});
router13.delete("/activities/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    try {
      await db.delete(activitiesTable).where(eq8(activitiesTable.id, id));
    } catch (dbErr) {
      console.warn("DB delete failed, modifying memory store fallback:", dbErr);
    }
    memoryActivities = memoryActivities.filter((a) => a.id !== id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to delete activity" });
  }
});
var activities_default = router13;

// src/routes/index.ts
var router14 = Router14();
router14.use(health_default);
router14.use(auth_default);
router14.use(dashboard_default);
router14.use(clients_default);
router14.use(sessions_default);
router14.use(calendar_default);
router14.use(outcomes_default);
router14.use(revenue_default);
router14.use(reviews_default);
router14.use(blog_default);
router14.use(profile_default);
router14.use(htmlChunks_default);
router14.use(activities_default);
var routes_default = router14;

// src/app.ts
import fs from "node:fs";
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes_default);
app.use(routes_default);
var publicPath = path2.resolve(globalThis.__dirname || process.cwd(), "public");
app.use(express.static(publicPath));
app.get("/{*splat}", (req, res) => {
  const indexPath = path2.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: `Route '${req.path}' not found.` });
  }
});
app.use((err, _req, res, _next) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});
var app_default = app;

// api/index.ts
function handler(req, res) {
  return app_default(req, res);
}
export {
  handler as default
};
//# sourceMappingURL=index.js.map
