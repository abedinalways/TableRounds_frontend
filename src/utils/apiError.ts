import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

interface ApiErrorData {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getMessageFromData(data: unknown): string | null {
  if (!isObject(data)) return null;

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }

  return null;
}

/**
 * Extracts a user-friendly message from:
 * - RTK Query FetchBaseQueryError
 * - RTK SerializedError
 * - Native Error
 * - Custom API error objects
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  // Native Error
  if (error instanceof Error && error.message) {
    return error.message;
  }

  // RTK Query / custom API error
  if (isObject(error)) {
    // FetchBaseQueryError -> { data: { message: '...' } }
    if ('data' in error) {
      const message = getMessageFromData(error.data);

      if (message) {
        return message;
      }

      // Sometimes API returns a string directly
      if (typeof error.data === 'string' && error.data.trim()) {
        return error.data;
      }
    }

    // Direct custom error:
    // { message: 'Something went wrong' }
    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }

    // HTTP status fallback
    if ('status' in error) {
      if (typeof error.status === 'number') {
        return `Request failed with status ${error.status}`;
      }
    }
  }

  // SerializedError
  const serializedError = error as SerializedError;

  if (serializedError?.message) {
    return serializedError.message;
  }

  return fallback;
}
