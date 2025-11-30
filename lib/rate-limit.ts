/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    cleanupStore(now)
  }

  // Get or create entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + config.interval,
    }
  }

  const entry = store[key]

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: entry.resetTime,
    }
  }

  // Increment count
  entry.count++

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetTime,
  }
}

/**
 * Clean up expired entries from store
 */
function cleanupStore(now: number) {
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  AUTH_LOGIN: { interval: 60000, maxRequests: 5 }, // 5 requests per minute
  REGISTRATION: { interval: 3600000, maxRequests: 3 }, // 3 registrations per hour
  API_DEFAULT: { interval: 60000, maxRequests: 60 }, // 60 requests per minute
  API_STRICT: { interval: 60000, maxRequests: 10 }, // 10 requests per minute
} as const
