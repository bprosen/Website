import { describe, expect, it, vi } from 'vitest';
import {
  FULL_NAME,
  OG_DESCRIPTION,
  OG_IMAGE,
  SITE_TITLE,
  TITLE_SEPARATOR,
} from '~/constants';
import Page, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from './page';

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({ notFound }));

const params = (section?: string[]) => ({
  params: Promise.resolve({ section }),
});

describe('section page', () => {
  it('pre-renders home and every section, and nothing else', () => {
    expect(generateStaticParams()).toEqual([
      { section: [] },
      { section: ['work'] },
      { section: ['about'] },
      { section: ['contact'] },
    ]);
    expect(dynamicParams).toBe(false);
  });

  it('titles and previews each section, pointing search engines at home', async () => {
    await expect(generateMetadata(params(['work']))).resolves.toEqual({
      alternates: { canonical: '/' },
      openGraph: {
        description: OG_DESCRIPTION,
        images: [OG_IMAGE],
        title: `Work${TITLE_SEPARATOR}${FULL_NAME}`,
        type: 'website',
        url: '/work',
      },
      title: `Work${TITLE_SEPARATOR}${FULL_NAME}`,
      twitter: { card: 'summary_large_image' },
    });
  });

  it('uses the site title and root URL for home', async () => {
    const metadata = await generateMetadata(params());

    expect(metadata.title).toBe(SITE_TITLE);
    expect(metadata.alternates).toEqual({ canonical: '/' });
    expect(metadata.openGraph).toMatchObject({ url: '/' });
  });

  it('renders the page for the section', async () => {
    const element = await Page(params(['contact']));

    expect(element.props).toEqual({ section: 'contact' });
  });

  it('404s unknown paths', async () => {
    await expect(Page(params(['blog']))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
