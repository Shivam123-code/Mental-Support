// Standardized API Response Utilities
import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    } as ApiResponse<T>,
    { status }
  );
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    } as ApiResponse,
    { status }
  );
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401);
}

export function notFoundResponse(message = 'Resource not found') {
  return errorResponse(message, 404);
}

export function serverErrorResponse(message = 'Internal server error') {
  return errorResponse(message, 500);
}

export function validationErrorResponse(message: string) {
  return errorResponse(message, 422);
}
