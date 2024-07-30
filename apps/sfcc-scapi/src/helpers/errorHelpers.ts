"use server";

import { SetUserSessionError } from "../error/Errors";
import { SET_USER_SESSION_ERROR_CODES } from "@repo/constants-config/constants";

type ErrorHandlerMappingType = {
  [key: string]: (error: Error) => Promise<void>;
};

const ErrorHandlerMapping: ErrorHandlerMappingType = {
  userSession: userSessionErrorHandler,
};

/**
 * Handle the API error.
 * @param error - The error.
 * @param origin - The origin of the error.
 * @returns The error handler.
 * @throws An error if the operation fails.
 * */
export async function handleApiError(error: Error, origin: string) {
  if (error instanceof Error) {
    const handler = `${origin}ErrorHandler`;
    if (ErrorHandlerMapping[handler]) {
      ErrorHandlerMapping[handler](error);
    } else {
      console.error("Unexpected error:", error);
    }
    console.error(`Error: ${error.message}`);
  } else {
    console.error("Unexpected error:", error);
  }
}

/**
 * Handle the SetUserSessionError.
 * @param error - The error.
 */
export async function userSessionErrorHandler(error: SetUserSessionError) {
  if (error) {
    const apiError = error;
    switch (apiError.code) {
      case SET_USER_SESSION_ERROR_CODES.AUTH_FAILED:
        // Handle authentication error
        console.error("Authentication failed:", apiError);
        // Perform actions like redirecting to login
        break;
      case SET_USER_SESSION_ERROR_CODES.DATA_NOT_FOUND:
        // Handle data not found error
        console.error("Data not found:", apiError);
        // Display an appropriate error message
        break;
      case SET_USER_SESSION_ERROR_CODES.INTERNAL_SERVER_ERROR:
        // Handle internal server error
        console.error("Internal server error:", apiError);
        // Log the error and display a generic message
        break;
      default:
        console.error("Unexpected error:", apiError);
      // Handle unexpected errors
    }
  } else {
    console.error("Unexpected error:", error);
  }
}
