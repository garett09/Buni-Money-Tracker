// Security middleware for Next.js API routes

import { NextRequest, NextResponse } from 'next/server';
import { securityConfig } from './security';

// CORS middleware
export const withCORS = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    const origin = request.headers.get('origin');
    const isAllowedOrigin = securityConfig.cors.origin.includes(origin || '');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin! : securityConfig.cors.origin[0],
          'Access-Control-Allow-Methods': securityConfig.cors.methods.join(', '),
          'Access-Control-Allow-Headers': securityConfig.cors.allowedHeaders.join(', '),
          'Access-Control-Allow-Credentials': securityConfig.cors.credentials.toString(),
          'Access-Control-Max-Age': securityConfig.cors.maxAge.toString(),
        },
      });
    }

    // Handle actual requests
    const response = await handler(request, ...args);
    
    // Add CORS headers
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin!);
    } else {
      response.headers.set('Access-Control-Allow-Origin', securityConfig.cors.origin[0]);
    }
    
    response.headers.set('Access-Control-Allow-Credentials', securityConfig.cors.credentials.toString());
    
    return response;
  };
};

// Security headers middleware
export const withSecurityHeaders = (handler: Function) => {
  return async (request: NextRequest, ...args: any[]) => {
    const response = await handler(request, ...args);
    
    // Add security headers
    Object.entries(securityConfig.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
};

// Combined security middleware
export const withSecurity = (handler: Function) => {
  return withSecurityHeaders(withCORS(handler));
};

// Input validation middleware
export const withInputValidation = (handler: Function, validationSchema?: any) => {
  return async (request: NextRequest, ...args: any[]) => {
    try {
      // Basic input validation
      if (request.method === 'POST' || request.method === 'PUT') {
        const body = await request.json();
        
        // Validate required fields
        if (!body || typeof body !== 'object') {
          return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
          );
        }
        
        // Additional validation can be added here
        if (validationSchema) {
          // Implement schema validation if needed
        }
      }
      
      return await handler(request, ...args);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
  };
};

// Content Security Policy builder
export const buildCSP = (options: {
  allowInline?: boolean;
  allowEval?: boolean;
  allowExternal?: boolean;
} = {}) => {
  const { allowInline = false, allowEval = false, allowExternal = false } = options;
  
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'https:'],
    'connect-src': ["'self'", 'https:'],
    'frame-ancestors': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': []
  };
  
  if (allowInline) {
    directives['script-src'].push("'unsafe-inline'");
    directives['style-src'].push("'unsafe-inline'");
  }
  
  if (allowEval) {
    directives['script-src'].push("'unsafe-eval'");
  }
  
  if (allowExternal) {
    directives['script-src'].push('https:');
    directives['style-src'].push('https:');
  }
  
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

// Security utilities for API routes
export const securityUtils = {
  // Sanitize user input
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check if request is from trusted origin
  isTrustedOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    if (!origin) return false;
    
    return securityConfig.cors.origin.includes(origin);
  },

  // Get client IP address
  getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown';
  }
};
