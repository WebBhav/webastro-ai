
'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if the Measurement ID is set, log a warning if not.
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics Measurement ID is not set. Add NEXT_PUBLIC_GA_MEASUREMENT_ID to your .env file.');
      return;
    }

    // Construct the full URL path including search parameters
    const url = pathname + (searchParams ? searchParams.toString() : ''); // Handle null searchParams

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Define the gtag function if it doesn't exist.
    // This ensures initialization happens only once.
    if (typeof window.gtag !== 'function') {
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;
        // Initial configuration and pageview for the first load
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
          page_path: url, // Send initial pageview
        });
         console.log(`GA Initialized with ID: ${GA_MEASUREMENT_ID}, page_path: ${url}`);
    } else {
        // If gtag already exists (e.g., on subsequent route changes), just send the pageview event.
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        });
        console.log(`GA Pageview Sent: ${url}`);
    }

  }, [pathname, searchParams]); // Rerun effect when path or search params change


  // Don't render scripts if the Measurement ID is missing.
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Load the Google Tag Manager script */}
      <Script
        strategy="afterInteractive" // Load after the page becomes interactive
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* The inline script for initialization is now handled within the useEffect hook */}
    </>
  );
}

