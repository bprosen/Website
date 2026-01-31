import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from '@tabler/icons-react';
import { EMAIL, GITHUB, LINKED_IN } from '~/constants';

export const Header = () => {
  return (
    <div className='flex justify-between w-full px-6 py-4'>
      <div className='flex gap-4'>
        <a href={GITHUB} target='_blank'>
          <IconBrandGithub color='#FFFFFF' size={40} stroke={1.2} />
        </a>
        <a href={LINKED_IN} target='_blank'>
          <IconBrandLinkedin color='#FFFFFF' size={40} stroke={1.2} />
        </a>
        <a href={EMAIL} target='_blank'>
          <IconMail color='#FFFFFF' size={40} stroke={1.2} />
        </a>
      </div>
    </div>
  );
};
