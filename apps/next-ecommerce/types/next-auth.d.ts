/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Custom types for NextAuth
import NextAuth from 'next-auth/next'; // *IMPORTANT* DO NOT remove this line, it's used implicitly by Next.js for auto import in options.ts

declare module 'next-auth' {
  interface User {
    id: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}
