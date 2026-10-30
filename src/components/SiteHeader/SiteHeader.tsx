import { PRIMARY_NAV_LABEL, SECTIONS, SITE_HEADER_ID, WORK } from '~/constants';
import { cn } from '~/lib/ui';
import { Button, Separator } from '~/ui';
import { HeaderHome } from '../HeaderHome';
import { SectionLink } from '../SectionLink';
import { ThemeToggle } from '../ThemeToggle';
import { WorkProgress } from '../WorkProgress';

const WORK_ENTRY_IDS = WORK.map(({ id }) => id);

const INTRO_DROP_CLASS =
  'motion-safe:animate-intro-drop motion-safe:[animation-delay:520ms]';
const CENTERED_PHONE_GRID_CLASS =
  'max-sm:min-narrow:grid max-sm:min-narrow:grid-cols-[1fr_auto_1fr] max-sm:min-narrow:gap-x-0.5';

export const SiteHeader = () => (
  <header
    className={cn(
      'bg-paper/88 min-roomy:gap-x-8 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-[max(var(--page-gutter),calc((100%-var(--page-max-width))/2+var(--page-gutter)))] py-3 backdrop-blur-[10px] max-sm:flex-nowrap max-sm:gap-x-2',
      CENTERED_PHONE_GRID_CLASS,
    )}
    id={SITE_HEADER_ID}
  >
    <HeaderHome className='max-narrow:hidden justify-self-start' />
    <div className='max-sm:min-narrow:contents min-roomy:gap-x-6 flex items-center gap-x-3 max-sm:flex-1 max-sm:justify-between sm:gap-x-4'>
      <nav
        aria-label={PRIMARY_NAV_LABEL}
        className={cn(
          'min-roomy:gap-x-7 flex flex-wrap gap-x-0.5 gap-y-1 sm:gap-x-3',
          INTRO_DROP_CLASS,
        )}
      >
        {SECTIONS.map(({ label, slug }) => (
          <Button
            asChild
            className='max-sm:px-2'
            key={slug}
            size='nav'
            variant='ghost'
          >
            <SectionLink section={slug}>{label}</SectionLink>
          </Button>
        ))}
      </nav>
      <Separator
        className={cn(
          'bg-foreground/20 hidden data-[orientation=vertical]:h-6 sm:block',
          INTRO_DROP_CLASS,
        )}
        orientation='vertical'
      />
      <ThemeToggle className={cn('justify-self-end', INTRO_DROP_CLASS)} />
    </div>
    <WorkProgress
      className='absolute inset-x-(--page-gutter) bottom-1 lg:hidden'
      entryIds={WORK_ENTRY_IDS}
    />
  </header>
);
