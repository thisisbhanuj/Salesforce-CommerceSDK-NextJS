import { Metadata, ResolvingMetadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { fetchCategoryForSEO } from '@/actions/browse.actions';
import { PrimaryCategory } from '@/Category';

type Props = {
  params: { slug: [] };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];

  const category = (params.slug as string[])[0] ?? 'men';
  const productType = (params.slug as string[])[1] ?? 'all';

  const response = await fetchCategoryForSEO(category);
  let data = {} as PrimaryCategory;

  if (response?.success) {
    data = JSON.parse(response?.categoryModelforSEO?.toString());
  }

  return {
    title:
      category.toUpperCase() + ' | ' + productType.toUpperCase() + ' | BHANUJ',
    description: data?.description,
    category: data?.name,
    keywords: data?.subCategories,
    openGraph: {
      title: 'Next.js',
      description: 'The React Framework for the Web',
      url: 'https://nextjs.org',
      siteName: 'BHANUJ',
      images: [
        {
          url: 'https://nextjs.org/og.png', // Must be an ab  solute URL
          width: 800,
          height: 600,
        },
        {
          url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
          width: 1800,
          height: 1600,
          alt: 'My custom alt',
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
      {children}
    </section>
  );
}
