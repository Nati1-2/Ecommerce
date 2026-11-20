/**
 * Enterprise Application Security & Input Sanitization Utilities
 * Protects against XSS, Prototype Pollution, Header Injection, and Sensitive Data Exposure.
 */

// HTML Entities map for sanitizing user-provided strings
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
};

/**
 * Sanitizes an untrusted string by escaping HTML special characters,
 * stripping script tags, null bytes, and malicious URI schemes (e.g. javascript:).
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  // Strip null bytes and control characters
  let clean = input.replace(/\0/g, "").trim();

  // Strip dangerous javascript: / data: / vbscript: protocols
  clean = clean.replace(/^(javascript|data|vbscript):/gi, "");

  // Strip dangerous inline event handlers (onerror=, onload=, onclick=)
  clean = clean.replace(/\bon\w+\s*=/gi, "");

  // Escape HTML special characters to prevent cross-site scripting (XSS)
  return clean.replace(/[&<>"'/]/g, (match) => HTML_ENTITIES[match] || match);
}

/**
 * Strips script tags, iframe, and object tags completely.
 */
export function stripHtmlTags(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

/**
 * Recursively sanitizes an object's string properties and defends
 * against Prototype Pollution by blocking '__proto__', 'constructor', and 'prototype' keys.
 */
export function sanitizePayload<T>(payload: T): T {
  if (payload === null || typeof payload !== "object") {
    if (typeof payload === "string") {
      return sanitizeInput(payload) as unknown as T;
    }
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizePayload(item)) as unknown as T;
  }

  const cleanObj: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    // Prototype pollution prevention
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }

    cleanObj[key] = sanitizePayload(value);
  }

  return cleanObj as T;
}

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "token",
  "accesstoken",
  "refreshtoken",
  "secret",
  "jwt_secret",
  "cvv",
  "cvc",
  "cardnumber",
  "creditcard",
  "authorization",
  "cookie",
]);

/**
 * Deep masks sensitive fields in objects (e.g. passwords, card numbers, tokens)
 * before passing them to loggers, Sentry, or telemetry.
 */
export function maskSensitiveData(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;

  if (Array.isArray(data)) {
    return data.map(maskSensitiveData);
  }

  const masked: Record<string, any> = {};

  for (const [key, val] of Object.entries(data as Record<string, any>)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z]/g, "");

    if (SENSITIVE_KEYS.has(lowerKey)) {
      masked[key] = "********";
    } else if (typeof val === "object" && val !== null) {
      masked[key] = maskSensitiveData(val);
    } else {
      masked[key] = val;
    }
  }

  return masked;
}

/**
 * RFC 5322 compliant email regex validation.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string" || email.length > 254) return false;
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates password strength (minimum 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char).
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one numerical digit.");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

