import { describe, expect, it, vi } from 'vitest';
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

  it('titles and canonicalises each section', async () => {
    await expect(generateMetadata(params(['work']))).resolves.toEqual({
      alternates: { canonical: '/work' },
      title: 'Work · Ben Edgar-Prosen',
    });
  });

  it('uses the site title for home', async () => {
    await expect(generateMetadata(params())).resolves.toEqual({
      alternates: { canonical: '/' },
      title: 'Ben Edgar-Prosen · Software Developer',
    });
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
