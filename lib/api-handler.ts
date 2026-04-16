import { NextResponse } from 'next/server';
import { z } from 'zod';

export class APIError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'APIError';
  }
}

export function withErrorHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      const response = await handler(...args);
      return response;
    } catch (error: any) {
      console.error("API Error:", error);

      let statusCode = 500;
      let message = "Internal Server Error";
      let code = "INTERNAL_SERVER_ERROR";

      if (error instanceof z.ZodError) {
  statusCode = 400;
  // Uses .issues for better type safety and standardized access
  message = error.issues.map(issue => issue.message).join(', ');
  code = "VALIDATION_ERROR";
} else if (error instanceof APIError) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code;
      } else {
        // Fallback or specific unhandled database errors
        message = error.message || message;
      }

      return NextResponse.json(
        {
          error: {
            message,
            code,
          },
        },
        { status: statusCode }
      );
    }
  };
}
