import type { Metadata } from 'next';
import { Suspense } from 'react'; // Import Suspense
import { GeistSans } from 'geist/font/sans';
// Removed GeistMono import as it caused an error and may not be needed.
// import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Loading from './loading'; // Import the loading component
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'; // Import GA component

export const metadata: Metadata = {
  title: 'WebAstro AI',
  description: 'Your Personal AI Astrologer',
  icons: {
    icon: '/favicon.ico', // Example path, ensure favicon exists
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Removed dark class here, as dark is the default theme in globals.css
    <html lang="en">
      {/* Use GeistSans variable font. If GeistMono is needed and installed, add it back. */}
      <body className={`${GeistSans.variable} antialiased font-sans`}>
         {/* Add Google Analytics Component */}
         <Suspense> {/* GA component uses hooks, needs Suspense boundary */}
             <GoogleAnalytics />
         </Suspense>
        <main className="min-h-screen flex flex-col">
           {/* Wrap children with Suspense */}
           <Suspense fallback={<Loading />}>
             {children}
           </Suspense>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
