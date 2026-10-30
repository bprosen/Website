import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OG_DESCRIPTION, OG_IMAGE, SECTIONS } from '~/constants';
import { Home } from '~/routes';
import { sectionFromParams, sectionPath, sectionTitle } from '~/utils';

type PageProps = {
  params: Promise<{ section?: string[] }>;
};

export const dynamicParams = false;

export const generateStaticParams = () => [
  { section: [] },
  ...SECTIONS.map(({ slug }) => ({ section: [slug] })),
];

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const section = sectionFromParams((await params).section);
  const path = sectionPath(section ?? null);
  const title = sectionTitle(section ?? null);

  return {
    alternates: { canonical: sectionPath(null) },
    openGraph: {
      description: OG_DESCRIPTION,
      images: [OG_IMAGE],
      title,
      type: 'website',
      url: path,
    },
    title,
    twitter: { card: 'summary_large_image' },
  };
};

const Page = async ({ params }: PageProps) => {
  const section = sectionFromParams((await params).section);

  if (section === undefined) {
    notFound();
  }

  return <Home section={section} />;
};

export default Page;
