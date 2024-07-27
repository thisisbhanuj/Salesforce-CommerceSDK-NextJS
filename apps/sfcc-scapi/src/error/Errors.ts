"use server";

export class SetUserSessionError extends Error {
  code?: string;
  status?: number;
  data?: any;

  constructor(
    message: string,
    options?: { code?: string; status?: number; data?: any },
  ) {
    super(message);
    this.name = "SetUserSessionError";
    this.code = options?.code;
    this.status = options?.status;
    this.data = options?.data;
  }
}
