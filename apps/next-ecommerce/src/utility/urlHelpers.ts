import { useState, useEffect } from 'react';

function getBaseUrl() {
  // Prioritize public environment variables for Next.js
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  } else if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_URL_DEV;
  } else {
    return process.env.NEXT_PUBLIC_URL_PROD;
  }
}

function useBaseUrl() {
  const [baseUrl, setBaseUrl] = useState(getBaseUrl());

  useEffect(() => {
    // Re-evaluate base URL if environment variables change dynamically
    const handleEnvChange = () => setBaseUrl(getBaseUrl());
    window.addEventListener('storage', handleEnvChange);

    return () => window.removeEventListener('storage', handleEnvChange); // Cleanup
  }, []);

  const generateUrl = (path: string) => {
    const pathLowerCase = path.toLowerCase();
    return `${baseUrl}${pathLowerCase}`;
  };

  return { baseUrl, generateUrl };
}

export default useBaseUrl;
