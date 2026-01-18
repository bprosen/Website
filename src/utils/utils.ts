import { headers } from 'next/headers';
import { userAgentFromString } from 'next/server';

export const isMobile = async (): Promise<boolean> => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const agent = userAgentFromString(userAgent);

  return agent?.device?.type === 'mobile';
};
