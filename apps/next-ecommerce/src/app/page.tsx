import SFCCSessionComponent from '@/components/sfcc/SFCCSessionComponent';

// Allow any cache option to be passed to fetch but
// if no option is provided then set the cache option to 'force-cache'.
// This means that even fetch requests after dynamic functions are considered static.
export const fetchCache = 'default-cache';

export default async function Home() {
  return (
    <>
      <SFCCSessionComponent />
    </>
  );
}
