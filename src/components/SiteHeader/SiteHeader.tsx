import { SECTIONS, SITE_HEADER_ID } from '~/constants';
import { Button, Separator } from '~/ui';
import { HeaderHome } from '../HeaderHome';
import { SectionLink } from '../SectionLink';
import { ThemeToggle } from '../ThemeToggle';
import { WorkProgress } from '../WorkProgress';

const INTRO_DROP =
  'motion-safe:animate-intro-drop motion-safe:[animation-delay:520ms]';
const CENTERED_PHONE_GRID =
  'max-sm:min-[360px]:grid max-sm:min-[360px]:grid-cols-[1fr_auto_1fr] max-sm:min-[360px]:gap-x-0.5';

export const SiteHeader = () => (
  <header
    className={`sticky top-0 z-50 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 bg-paper/88 px-[max(clamp(20px,5vw,56px),calc((100%-1240px)/2+clamp(20px,5vw,56px)))] py-3 backdrop-blur-[10px] max-sm:flex-nowrap max-sm:gap-x-2 ${CENTERED_PHONE_GRID}`}
    id={SITE_HEADER_ID}
  >
    <HeaderHome className='justify-self-start max-[359px]:hidden' />
    <div className='flex items-center gap-x-3 max-sm:flex-1 max-sm:justify-between max-sm:min-[360px]:contents sm:gap-x-6'>
      <nav
        aria-label='Primary'
        className={`flex flex-wrap gap-x-0.5 gap-y-1 sm:gap-x-7 ${INTRO_DROP}`}
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
        className={`hidden bg-foreground/20 data-[orientation=vertical]:h-6 sm:block ${INTRO_DROP}`}
        orientation='vertical'
      />
      <ThemeToggle className={`justify-self-end ${INTRO_DROP}`} />
    </div>
    <WorkProgress className='absolute inset-x-[clamp(20px,5vw,56px)] bottom-1 min-[762px]:hidden' />
  </header>
);
