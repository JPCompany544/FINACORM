import { PostgrestError } from "@supabase/supabase-js";

export interface AppError {
  message: string;
  code?: string;
  originalError?: any;
}

/**
 * Parses and returns a clean, human-friendly AppError from Supabase exceptions.
 */
export function parseSupabaseError(error: PostgrestError | Error | any): AppError {
  if (!error) return { message: "An unknown error occurred" };

  // Postgrest Error
  if (error.code && typeof error.code === "string") {
    let message = error.message || "A database operation failed.";
    if (message === "{}") {
      message = "A database operation failed.";
    }

    switch (error.code) {
      case "23505":
        message = "This record already exists.";
        break;
      case "23503":
        message = "This operation references a record that does not exist.";
        break;
      case "23502":
        message = "A required field was missing or invalid.";
        break;
      case "42P01":
        message = "Table schema could not be loaded.";
        break;
      case "P0001":
        message = error.message || "Database validation failed.";
        if (message === "{}") message = "Database validation failed.";
        break;
    }

    return {
      message,
      code: error.code,
      originalError: error.message || String(error),
    };
  }

  // Standard or Auth Error
  let message = error.message || "An unexpected error occurred.";
  if (message === "{}" || !message) {
    if (error.status === 500 || error.statusCode === 500) {
      message = "Internal server error (500). This usually indicates a Supabase configuration issue, email rate limit, or email sending failure.";
    } else {
      message = "An unexpected server or network error occurred.";
    }
  }

  return {
    message,
    originalError: error.message || String(error),
  };
}
