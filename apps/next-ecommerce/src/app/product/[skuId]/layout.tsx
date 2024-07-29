import { Metadata, ResolvingMetadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { fetchProductForSEO } from '@/actions/browse.actions';
import { PDPStoreProvider } from '@/zustand/context/usePDPStore';

type Props = {
  params: { skuId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const response = await fetchProductForSEO(params.skuId);

  const product = response?.productModelforSEO;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.skuId,
    description: product?.description,
    openGraph: {
      title: product?.skuId,
      description: product?.description,
      url: 'https://bhanuj.app/',
      siteName: 'Bhanuj',
      images: [
        {
          url: 'https://nextjs.org/og.png', // Must be an absolute URL
          width: 800,
          height: 600,
        },
        {
          url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
          width: 1800,
          height: 1600,
          alt: 'alt',
        },
        ...previousImages,
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <SpeedInsights />
      <PDPStoreProvider>{children}</PDPStoreProvider>
    </section>
  );
}
