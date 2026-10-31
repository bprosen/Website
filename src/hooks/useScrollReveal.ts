import { useEffect } from 'react';
import {
  REVEAL_READY_CLASS,
  REVEAL_ROOT_MARGIN,
  REVEAL_SELECTOR,
  REVEALED_ATTRIBUTE,
} from '~/constants';

const reveal = (element: Element) =>
  element.setAttribute(REVEALED_ATTRIBUTE, '');

const startsInViewport = (element: Element) =>
  element.getBoundingClientRect().top < window.innerHeight;

export const useScrollReveal = () => {
  useEffect(() => {
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: REVEAL_ROOT_MARGIN },
    );

    for (const element of document.querySelectorAll(REVEAL_SELECTOR)) {
      if (startsInViewport(element)) {
        reveal(element);
      } else {
        observer.observe(element);
      }
    }
    root.classList.add(REVEAL_READY_CLASS);

    return () => {
      observer.disconnect();
      root.classList.remove(REVEAL_READY_CLASS);
    };
  }, []);
};
