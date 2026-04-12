import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Attempt to get the global ScrollSmoother instance
    const smoother = ScrollSmoother.get();

    if (hash) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      
      if (element) {
        // Increased delay to ensure all components (especially GSAP ones) are initialized
        const timer = setTimeout(() => {
          const activeSmoother = ScrollSmoother.get();
          
          if (activeSmoother) {
            // Refresh ScrollTrigger to recalculate heights after dynamic content/pinning
            ScrollTrigger.refresh();
            
            // Get scroll-margin-top or default to a value that accounts for the navbar (64px) + some breathing room
            const style = window.getComputedStyle(element);
            const scrollMarginTop = parseInt(style.scrollMarginTop) || 80; 
            
            activeSmoother.scrollTo(element, true, `top ${scrollMarginTop}px`);
          } else {
            // Fallback to native scroll if no smoother is found
            const offset = 80; // Standard offset for navbar
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: 'smooth'
            });
          }
        }, 300); // 300ms is safer for page transitions and data fetching
        return () => clearTimeout(timer);
      }
    } else {
      if (smoother) {
        smoother.scrollTo(0, true);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
