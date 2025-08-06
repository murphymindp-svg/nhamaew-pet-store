"use client";

import { useState, useEffect, useRef } from 'react';

interface UseScrollHeaderOptions {
    threshold?: number; // Minimum scroll distance to trigger hide/show
    enabled?: boolean; // Whether the scroll behavior is enabled
}

export function useScrollHeader(options: UseScrollHeaderOptions = {}) {
    const { threshold = 10, enabled = true } = options;

    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        if (!enabled) {
            setIsVisible(true);
            return;
        }

        const updateScrollState = () => {
            const scrollY = window.scrollY;

            // Set scrolled state for styling (shadow, background, etc.)
            setIsScrolled(scrollY > 10);

            // Only hide/show header if scroll distance exceeds threshold
            if (Math.abs(scrollY - lastScrollY.current) < threshold) {
                ticking.current = false;
                return;
            }

            // Show header when at top of page
            if (scrollY <= 0) {
                setIsVisible(true);
            }
            // Hide header when scrolling down, show when scrolling up
            else if (scrollY > lastScrollY.current && scrollY > 80) {
                // Scrolling down & past 80px
                setIsVisible(false);
            } else if (scrollY < lastScrollY.current) {
                // Scrolling up - always show
                setIsVisible(true);
            }

            lastScrollY.current = scrollY;
            ticking.current = false;
        };

        const handleScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(updateScrollState);
                ticking.current = true;
            }
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold, enabled]);

    return {
        isVisible,
        isScrolled,
    };
}

export default useScrollHeader; 