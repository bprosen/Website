import { NAME, SECTIONS } from '~/constants';
import { Button, Separator } from '~/ui';
import { SectionLink } from '../SectionLink';
import { ThemeToggle } from '../ThemeToggle';

export const SiteHeader = () => (
  <header className='sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 bg-paper/88 px-[max(clamp(20px,5vw,56px),calc((100%-1240px)/2+clamp(20px,5vw,56px)))] py-3 backdrop-blur-[10px]'>
    <SectionLink
      className='head-name inline-flex min-h-11 max-sm:hidden items-center font-serif text-[22px] font-semibold no-underline'
      section={null}
    >
      {NAME}
    </SectionLink>
    <div className='flex items-center gap-x-3 motion-safe:animate-intro-drop motion-safe:[animation-delay:520ms] max-sm:w-full max-sm:justify-between sm:gap-x-6'>
      <nav
        aria-label='Primary'
        className='flex flex-wrap gap-x-1 gap-y-1 sm:gap-x-7'
      >
        {SECTIONS.map(({ label, slug }) => (
          <Button asChild key={slug} size='nav' variant='ghost'>
            <SectionLink section={slug}>{label}</SectionLink>
          </Button>
        ))}
      </nav>
      <Separator
        className='hidden bg-foreground/20 data-[orientation=vertical]:h-6 sm:block'
        orientation='vertical'
      />
      <ThemeToggle />
    </div>
  </header>
);
