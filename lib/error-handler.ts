/**
 * Centralized error handling utilities
 */

import { NextResponse } from 'next/server'
import { logger } from './logger'

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR')
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 403, 'AUTHORIZATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED')
    if (retryAfter) {
      this.message = `Rate limit exceeded. Retry after ${retryAfter}ms`
    }
  }
}

/**
 * Handle errors and return appropriate NextResponse
 */
export function handleError(error: unknown): NextResponse {
  // Log the error
  if (error instanceof Error) {
    logger.error('Application error', error, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    })
  } else {
    logger.error('Unknown error', undefined, { error })
  }

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  // Handle validation errors from libraries
  if (error instanceof Error && error.name === 'ValidationError') {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    )
  }

  // Handle Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as { code: string; message: string }
    return NextResponse.json(
      {
        success: false,
        error: 'Database error',
        code: dbError.code,
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined,
      },
      { status: 500 }
    )
  }

  // Default error response
  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : undefined,
    },
    { status: 500 }
  )
}

/**
 * Async error handler wrapper for route handlers
 */
export function asyncHandler<T>(
  handler: (req: Request, context?: unknown) => Promise<T>
) {
  return async (req: Request, context?: unknown) => {
    try {
      return await handler(req, context)
    } catch (error) {
      return handleError(error)
    }
  }
}

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, unknown>,
  fields: string[]
): void {
  const missing = fields.filter(field => !data[field])

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required fields: ${missing.join(', ')}`
    )
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}
