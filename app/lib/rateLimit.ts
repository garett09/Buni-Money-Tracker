// Rate limiting utility for API endpoints

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  public config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cleanup();
  }

  // Clean up expired entries every 5 minutes
  private cleanup() {
    setInterval(() => {
      const now = Date.now();
      Object.keys(this.store).forEach(key => {
        if (this.store[key].resetTime < now) {
          delete this.store[key];
        }
      });
    }, 5 * 60 * 1000);
  }

  // Check if request is allowed
  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    
    if (!this.store[key] || this.store[key].resetTime < now) {
      // Reset or create new entry
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs
      };
      return {
        allowed: true,
        remaining: this.config.max - 1,
        resetTime: this.store[key].resetTime
      };
    }

    if (this.store[key].count >= this.config.max) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: this.store[key].resetTime
      };
    }

    // Increment counter
    this.store[key].count++;
    
    return {
      allowed: true,
      remaining: this.config.max - this.store[key].count,
      resetTime: this.store[key].resetTime
    };
  }

  // Get rate limit headers
  getHeaders(identifier: string): Record<string, string> {
    const result = this.isAllowed(identifier);
    const resetTime = new Date(result.resetTime).toUTCString();
    
    return {
      'X-RateLimit-Limit': this.config.max.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': resetTime,
      'Retry-After': Math.ceil(this.config.windowMs / 1000).toString()
    };
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // Strict rate limiting for authentication endpoints
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true
  }),

  // General API rate limiting
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: 'Too many requests, please try again later.',
    skipSuccessfulRequests: false
  }),

  // Strict rate limiting for sensitive operations
  sensitive: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per 15 minutes
    message: 'Too many sensitive operations, please try again later.',
    skipSuccessfulRequests: false
  })
};

// Rate limiting middleware for Next.js API routes
export const withRateLimit = (
  handler: Function,
  limiter: RateLimiter = rateLimiters.api,
  identifierFn?: (request: Request) => string
) => {
  return async (request: Request, ...args: any[]) => {
    // Get identifier (IP address or user ID)
    const identifier = identifierFn 
      ? identifierFn(request)
      : request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        'unknown';

    // Check rate limit
    const result = limiter.isAllowed(identifier);
    
    if (!result.allowed) {
      const headers = limiter.getHeaders(identifier);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          message: limiter.config.message,
          retryAfter: Math.ceil(limiter.config.windowMs / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request, ...args);
    const rateLimitHeaders = limiter.getHeaders(identifier);
    
    // Merge headers
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  };
};

// Utility function to get client IP
export const getClientIP = (request: Request): string => {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
};

// Utility function to check if request should be rate limited
export const shouldRateLimit = (request: Request): boolean => {
  // Don't rate limit health checks
  if (request.url.includes('/api/data/health')) {
    return false;
  }
  
  // Don't rate limit public endpoints
  if (request.url.includes('/api/hello')) {
    return false;
  }
  
  return true;
};
