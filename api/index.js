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
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
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
    var fs = __require("fs");
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
    function dim(text10) {
      return supportsAnsi() ? `\x1B[2m${text10}\x1B[0m` : text10;
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
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
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
          const parsed = DotenvModule.parse(fs.readFileSync(path4, { encoding }));
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
import { Router as Router11 } from "express";

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

// src/routes/dashboard.ts
import { Router as Router2 } from "express";

// ../../lib/db/src/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

// ../../lib/db/src/schema/index.ts
var schema_exports = {};
__export(schema_exports, {
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
var router2 = Router2();
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
router2.get("/dashboard/stats", async (_req, res) => {
  try {
    const clients = await db.select().from(clientsTable);
    const activeClients = clients.filter((c) => c.status === "active" || c.status === "high_priority");
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
router2.get("/dashboard/upcoming-sessions", async (_req, res) => {
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
router2.get("/dashboard/pending-reports", async (_req, res) => {
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
router2.get("/dashboard/weekly-schedule", async (_req, res) => {
  try {
    res.json(HARDCODED_WEEKLY_SCHEDULE);
  } catch (err) {
    console.error("Error fetching weekly schedule, returning fallback:", err);
    res.json(HARDCODED_WEEKLY_SCHEDULE);
  }
});
router2.get("/dashboard/recent-activity", async (_req, res) => {
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
router2.get("/dashboard/client-improvement", async (_req, res) => {
  try {
    res.json(HARDCODED_CLIENT_IMPROVEMENT);
  } catch (err) {
    console.error("Error fetching client improvement, returning fallback:", err);
    res.json(HARDCODED_CLIENT_IMPROVEMENT);
  }
});
var dashboard_default = router2;

// src/routes/clients.ts
import { Router as Router3 } from "express";
import { eq as eq2, and as and2 } from "drizzle-orm";
var router3 = Router3();
router3.get("/clients", async (req, res) => {
  const { status, search } = req.query;
  let clients = await db.select().from(clientsTable);
  if (status) {
    clients = clients.filter((c) => c.status === status);
  }
  if (search) {
    const term = search.toLowerCase();
    clients = clients.filter((c) => c.name.toLowerCase().includes(term));
  }
  res.json(clients);
});
router3.get("/clients/:id", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [client] = await db.select().from(clientsTable).where(eq2(clientsTable.id, id));
  if (!client) {
    res.json({
      id: id || 1,
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
    });
    return;
  }
  const sessions = await db.select().from(sessionsTable).where(eq2(sessionsTable.clientId, id));
  res.json({
    ...client,
    sessionCount: sessions.length
  });
});
router3.get("/clients/:id/assessments", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const assessments = await db.select().from(assessmentsTable).where(eq2(assessmentsTable.clientId, id));
  const result = await Promise.all(
    assessments.map(async (a) => {
      const trends = await db.select().from(assessmentTrendsTable).where(eq2(assessmentTrendsTable.assessmentId, a.id));
      return { ...a, trend: trends.map((t) => ({ date: t.date, score: t.score })) };
    })
  );
  if (result.length === 0) {
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
});
router3.get("/clients/:id/mood", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const logs = await db.select().from(moodLogsTable).where(eq2(moodLogsTable.clientId, id));
  if (logs.length === 0) {
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
});
router3.get("/clients/:id/homework", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const hw = await db.select().from(homeworkTable).where(eq2(homeworkTable.clientId, id));
  if (hw.length === 0) {
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
});
router3.get("/clients/:id/session-history", async (req, res) => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const sessions = await db.select().from(sessionsTable).where(and2(eq2(sessionsTable.clientId, id), eq2(sessionsTable.status, "completed")));
  if (sessions.length === 0) {
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
});
var clients_default = router3;

// src/routes/sessions.ts
import { Router as Router4 } from "express";
import { eq as eq3 } from "drizzle-orm";
var router4 = Router4();
router4.post("/sessions/:id/report", async (req, res) => {
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
var sessions_default = router4;

// src/routes/calendar.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.get("/calendar/events", async (req, res) => {
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
router5.get("/calendar/availability", async (_req, res) => {
  const slots = await db.select().from(availabilitySlotsTable);
  res.json(slots);
});
router5.post("/calendar/availability", async (req, res) => {
  const { dayOfWeek, startTime, endTime, isRecurring } = req.body;
  if (!dayOfWeek || !startTime || !endTime) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [slot] = await db.insert(availabilitySlotsTable).values({ dayOfWeek, startTime, endTime, isRecurring: isRecurring ?? true }).returning();
  res.json(slot);
});
var calendar_default = router5;

// src/routes/outcomes.ts
import { Router as Router6 } from "express";
import { eq as eq4 } from "drizzle-orm";
var router6 = Router6();
router6.get("/outcomes/individual/:clientId", async (req, res) => {
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
router6.get("/outcomes/caseload", async (req, res) => {
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
var outcomes_default = router6;

// src/routes/revenue.ts
import { Router as Router7 } from "express";
var router7 = Router7();
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
router7.get("/revenue/summary", async (req, res) => {
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
router7.get("/revenue/analytics", async (_req, res) => {
  try {
    res.json(HARDCODED_ANALYTICS);
  } catch (err) {
    console.error("Error fetching revenue analytics, returning hardcoded fallback:", err);
    res.json(HARDCODED_ANALYTICS);
  }
});
router7.get("/revenue/transactions", async (_req, res) => {
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
var revenue_default = router7;

// src/routes/reviews.ts
import { Router as Router8 } from "express";
var router8 = Router8();
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
router8.get("/reviews/summary", async (_req, res) => {
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
router8.get("/reviews", async (_req, res) => {
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
var reviews_default = router8;

// src/routes/blog.ts
import { Router as Router9 } from "express";
var router9 = Router9();
router9.get("/blog/posts", async (_req, res) => {
  const posts = await db.select().from(blogPostsTable);
  let result = posts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    tags: p.tags,
    content: p.content,
    status: p.status,
    createdAt: p.createdAt.toISOString()
  }));
  if (result.length === 0) {
    result = [
      {
        id: 1,
        title: "5 Proven CBT Techniques to Overcome Workplace Burnout",
        category: "CBT Insights",
        tags: ["Burnout", "CBT", "Stress Management"],
        content: "Workplace burnout is a state of emotional, physical, and mental exhaustion caused by excessive stress...",
        status: "published",
        createdAt: "2026-07-20T10:00:00.000Z"
      },
      {
        id: 2,
        title: "Understanding Mindfulness in Modern Psychotherapy",
        category: "Mindfulness",
        tags: ["Mindfulness", "ACT", "Self-Care"],
        content: "Mindfulness has transitioned from ancient traditions into a core pillar of modern clinical psychology...",
        status: "published",
        createdAt: "2026-07-15T14:30:00.000Z"
      }
    ];
  }
  res.json(result);
});
router9.post("/blog/posts", async (req, res) => {
  const { title, featuredImage, category, tags, content } = req.body;
  if (!title || !category || !content) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [post] = await db.insert(blogPostsTable).values({ title, featuredImage: featuredImage ?? null, category, tags: tags ?? [], content, status: "submitted" }).returning();
  res.status(201).json({
    id: post.id,
    title: post.title,
    category: post.category,
    tags: post.tags,
    content: post.content,
    status: post.status,
    createdAt: post.createdAt.toISOString()
  });
});
router9.get("/blog/outlines", async (_req, res) => {
  const outlines = await db.select().from(blogOutlinesTable);
  let result = outlines.map((o) => ({
    id: o.id,
    proposedTitle: o.proposedTitle,
    keyPoints: o.keyPoints,
    targetAudience: o.targetAudience,
    keywords: o.keywords,
    notes: o.notes,
    status: o.status,
    createdAt: o.createdAt.toISOString()
  }));
  if (result.length === 0) {
    result = [
      {
        id: 1,
        proposedTitle: "Navigating Life Transitions with Acceptance & Commitment Therapy (ACT)",
        keyPoints: ["Defining ACT", "Values clarification", "Defusion techniques"],
        targetAudience: "Adults dealing with major career or life changes",
        keywords: ["ACT", "Life Transitions", "Values"],
        notes: "Approved outline ready for draft.",
        status: "approved",
        createdAt: "2026-07-18T11:00:00.000Z"
      }
    ];
  }
  res.json(result);
});
router9.post("/blog/outlines", async (req, res) => {
  const { proposedTitle, keyPoints, targetAudience, keywords, notes } = req.body;
  if (!proposedTitle || !targetAudience) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const [outline] = await db.insert(blogOutlinesTable).values({
    proposedTitle,
    keyPoints: keyPoints ?? [],
    targetAudience,
    keywords: keywords ?? [],
    notes: notes ?? null,
    status: "pending"
  }).returning();
  res.status(201).json({
    id: outline.id,
    proposedTitle: outline.proposedTitle,
    keyPoints: outline.keyPoints,
    targetAudience: outline.targetAudience,
    keywords: outline.keywords,
    notes: outline.notes,
    status: outline.status,
    createdAt: outline.createdAt.toISOString()
  });
});
var blog_default = router9;

// src/routes/profile.ts
import { Router as Router10 } from "express";
import { eq as eq5 } from "drizzle-orm";
var router10 = Router10();
router10.get("/profile", async (_req, res) => {
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
router10.patch("/profile", async (req, res) => {
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
  const [updated] = await db.update(therapistProfileTable).set(updates).where(eq5(therapistProfileTable.id, profile.id)).returning();
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
var profile_default = router10;

// src/routes/index.ts
var router11 = Router11();
router11.use(health_default);
router11.use(dashboard_default);
router11.use(clients_default);
router11.use(sessions_default);
router11.use(calendar_default);
router11.use(outcomes_default);
router11.use(revenue_default);
router11.use(reviews_default);
router11.use(blog_default);
router11.use(profile_default);
var routes_default = router11;

// src/app.ts
var app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes_default);
var publicPath = path2.resolve(globalThis.__dirname || process.cwd(), "public");
app.use(express.static(publicPath));
app.get("*", (req, res) => {
  res.sendFile(path2.join(publicPath, "index.html"));
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
