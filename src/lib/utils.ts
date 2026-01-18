import { type ClassValue, clsx } from 'clsx';
import { headers } from 'next/headers';
import { userAgentFromString } from 'next/server';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const isMobile = async (): Promise<boolean> => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const { device } = userAgentFromString(userAgent);

  return device.type === 'mobile';
};
