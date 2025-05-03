
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
    if (!GA_MEASUREMENT_ID) {
      console.warn('Google Analytics Measurement ID is not set.');
      return;
    }

    const url = pathname + searchParams.toString();

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    // Initialize gtag function if it doesn't exist
    if (typeof window.gtag !== 'function') {
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
    } else {
        // If gtag already exists, just send the pageview event
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        });
    }

  }, [pathname, searchParams]);


  if (!GA_MEASUREMENT_ID) {
    return null; // Don't render scripts if ID is missing
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      {/* Inline script removed as initialization is handled in useEffect */}
    </>
  );
}
