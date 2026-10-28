import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NAME, SECTIONS, SITE_TITLE } from '~/constants';
import { Home } from '~/routes';
import { sectionFromParams, sectionPath } from '~/utils';

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
  const match = SECTIONS.find(({ slug }) => slug === section);

  return {
    alternates: { canonical: sectionPath(section ?? null) },
    title: match ? `${match.label} · ${NAME}` : SITE_TITLE,
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
