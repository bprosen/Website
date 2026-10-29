import { useEffect, useState } from 'react';

export const useScrolledPast = (targetId: string, coverId: string) => {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    const coverHeight = document.getElementById(coverId)?.offsetHeight ?? 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolledPast(
          !entry.isIntersecting && entry.boundingClientRect.top < coverHeight,
        );
      },
      { rootMargin: `-${coverHeight}px 0px 0px 0px` },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [targetId, coverId]);

  return scrolledPast;
};
