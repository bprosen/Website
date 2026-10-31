import { NEW_TAB_HINT } from '~/constants';

type NewTabHintProps = {
  hint?: string;
};

export const NewTabHint = ({ hint = NEW_TAB_HINT }: NewTabHintProps) => (
  <>
    {' '}
    <span className='sr-only'>{hint}</span>
  </>
);
