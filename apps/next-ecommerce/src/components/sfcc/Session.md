### SFCC-NextJS Session Management

To ensure that the access token is fetched and available across different pages (like PDP, PLP, etc.), you can leverage a combination of React context, a global state management solution, or even Next.js middleware for server-side management. Here’s a high-level overview of different approaches you might take:

## Custom Hook for Session Management (Lightweight & Simple Approach)

Create a custom hook that handles token retrieval and management. This hook can be used across different pages to ensure that the session data is fetched if it's not already present. In each page where you need the session data, fetch it directly if it’s not already available. This approach avoids having to rely on a global session manager.

## React Context with Client-Side State Management

1. Create a Context for Session Data

// src/context/SessionContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { shopperGuestAccessToken } from '@/sfcc/orchestration/SCAPIShopper';

type SFCCSessionData = {
accessToken: string;
sessionId: string;
refreshToken: string;
usid: string;
};

type SessionContextType = {
sessionData: SFCCSessionData | null;
loading: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [sessionData, setSessionData] = useState<SFCCSessionData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchSessionData = async () => {
let data: SFCCSessionData | null = JSON.parse(localStorage.getItem('sfccSessionData') || 'null');
if (!data) {
data = await shopperGuestAccessToken();
localStorage.setItem('sfccSessionData', JSON.stringify(data));
}
setSessionData(data);
setLoading(false);
};

    fetchSessionData();

}, []);

return (
<SessionContext.Provider value={{ sessionData, loading }}>
{children}
</SessionContext.Provider>
);
};

export const useSession = (): SessionContextType => {
const context = useContext(SessionContext);
if (!context) {
throw new Error('useSession must be used within a SessionProvider');
}
return context;
};

2. Wrap Your Application with the Provider

// src/pages/\_app.tsx
import { SessionProvider } from '@/context/SessionContext';

function MyApp({ Component, pageProps }) {
return (
<SessionProvider>
<Component {...pageProps} />
</SessionProvider>
);
}

export default MyApp;

3. Use the Context in Your Components

// Example in any component/page
import React from 'react';
import { useSession } from '@/context/SessionContext';

const SomeComponent: React.FC = () => {
const { sessionData, loading } = useSession();

if (loading) return <div>Loading...</div>;

return <div>Session Token: {sessionData?.accessToken}</div>;
};

export default SomeComponent;

## ------------------------------------------------------------------------------

## Global State Management (e.g., Redux, Zustand)

If you’re already using a state management library like Redux or Zustand, you can manage session data in a global store and access it from any component.

Example with Zustand:

1. Set Up Zustand Store

// src/store/sessionStore.ts
import create from 'zustand';
import { shopperGuestAccessToken } from '@/sfcc/orchestration/SCAPIShopper';

type SFCCSessionData = {
accessToken: string;
sessionId: string;
refreshToken: string;
usid: string;
};

interface SessionStore {
sessionData: SFCCSessionData | null;
fetchSessionData: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>((set) => ({
sessionData: null,
fetchSessionData: async () => {
let data = JSON.parse(localStorage.getItem('sfccSessionData') || 'null');
if (!data) {
data = await shopperGuestAccessToken();
localStorage.setItem('sfccSessionData', JSON.stringify(data));
}
set({ sessionData: data });
},
}));

2. Fetch and Use the Data in Your Components

// Example in a component/page
import React, { useEffect } from 'react';
import { useSessionStore } from '@/store/sessionStore';

const SomeComponent: React.FC = () => {
const { sessionData, fetchSessionData } = useSessionStore();

useEffect(() => {
fetchSessionData();
}, [fetchSessionData]);

return <div>Session Token: {sessionData?.accessToken}</div>;
};

export default SomeComponent;

## --------------------------------------------------------------------

## Server-Side Session Handling with Next.js Middleware (Only for EDGE)

If you want to ensure the token is available and validated on every page load, you can use Next.js middleware to check and fetch session data server-side before rendering the page.

Example:

1. Create Middleware for Token Handling

// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { shopperGuestAccessToken } from '@/sfcc/orchestration/SCAPIShopper';

export async function middleware(req: NextRequest) {
const token = req.cookies.get('sfccSessionData');

if (!token) {
const sessionData = await shopperGuestAccessToken();
const response = NextResponse.next();
response.cookies.set('sfccSessionData', JSON.stringify(sessionData), {
path: '/',
});
return response;
}

return NextResponse.next();
}

export const config = {
matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

2. Use Middleware in Your Next.js Application

Make sure the middleware is properly configured to run on every request or specific routes as needed.

## Implications with Middleware Approach:

Middleware will not work because SCAPI endpoints are used via /api/\* REVERSE-PROXY manner. Next.JS Middlware runs on EDGE and does not support NODE runtime.

## -----------------------------------------------------------------------
