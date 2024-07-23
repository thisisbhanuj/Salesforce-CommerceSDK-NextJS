import React from 'react';
import PageLayoutForm from '@/components/backoffice/layout-designer/PageLayoutUpdateForm';

export default function Builder({
  params,
  searchParams,
}: Readonly<{
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}>) {
  const { slug } = params;
  const { page } = searchParams;

  return (
    <div className="redesign-container">
      <PageLayoutForm pageName={slug} />
    </div>
  );
}
