import { useCallback, useEffect, useRef, useState } from 'react';
import { COPY_RESET_MS } from '~/constants';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return false;
    }

    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), COPY_RESET_MS);
    return true;
  }, []);

  return { copied, copy };
};
