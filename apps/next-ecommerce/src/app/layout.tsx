import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { Instrument_Sans } from 'next/font/google';
import '@/styles/styles.scss';

import ClientSessionProvider from '@/components/standalone/SessionProvider';
import GlobalProvider from './GlobalProvider';
import ModalCart from '@/components/modal/ModalCart';
import ModalWishlist from '@/components/modal/ModalWishlist';
import ModalSearch from '@/components/modal/ModalSearch';
import ModalQuickview from '@/components/modal/ModalQuickview';
import ModalCompare from '@/components/modal/ModalCompare';
import CountdownTimeType from '../../types/CountdownType';
import { countdownTime } from '@/utility/countdownTime';

const serverTimeLeft: CountdownTimeType = countdownTime();

const instrument = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'BHANUJ',
  description: 'Bhanuj - Stay in the moment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalProvider>
      <html lang="en">
        <body className={instrument.className}>
          <ClientSessionProvider>
            <SpeedInsights />
            {children}
            <Analytics />
            <ModalCart serverTimeLeft={serverTimeLeft} />
            <ModalWishlist />
            <ModalSearch />
            <ModalQuickview />
            <ModalCompare />
          </ClientSessionProvider>
        </body>
      </html>
    </GlobalProvider>
  );
}
