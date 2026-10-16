import { useEffect } from 'react';

/**
 * High-performance IntersectionObserver hook that adds 'revealed' class
 * to elements with '.scroll-reveal' or '.scroll-reveal-scale' when they enter viewport.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, unobserve to free memory
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -60px 0px', // trigger slightly before bottom of viewport
      threshold: 0.1,
    });

    const targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale');
    targets.forEach((el) => observer.observe(el));

    // Also observe any dynamic elements added later
    const mutationObserver = new MutationObserver(() => {
      const newTargets = document.querySelectorAll('.scroll-reveal:not(.revealed), .scroll-reveal-scale:not(.revealed)');
      newTargets.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
