import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ModalProvider } from '@/context/ModalContext';
import { IntroLoader } from '@/components/IntroLoader';
import { Header } from '@/components/Header';
import { MenuOverlay } from '@/components/MenuOverlay';
import { ContactModal } from '@/components/ContactModal';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/data/config';
import { profile } from '@/data/profile';

export const viewport: Viewport = {
  themeColor: '#141313',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  authors: [{ name: profile.name, url: siteConfig.url }],
  creator: profile.name,
  keywords: [
    'Samprath Shanbhag',
    'Data Analyst',
    'Microsoft Fabric',
    'Power BI',
    'SQL',
    'Python',
    'PySpark',
    'DP-600',
    'Dimensional Modeling',
    'Medallion Architecture',
    'Bengaluru',
  ],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: profile.name,
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Portrait of Samprath Shanbhag',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.jpg`],
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: 'Data Analyst & Fabric Analytics Engineer',
    url: siteConfig.url,
    image: `${siteConfig.url}/portrait.jpg`,
    email: `mailto:${profile.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      addressCountry: 'India',
    },
    sameAs: [profile.linkedin, profile.github],
    knowsAbout: [
      'Microsoft Fabric',
      'Power BI',
      'SQL',
      'Python',
      'PySpark',
      'Data Modeling',
      'DAX',
      'Tableau',
      'Medallion Architecture',
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-content-primary antialiased selection:bg-accent/30 selection:text-content-primary">
        {/* Accessible Skip to content link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-[#141313] focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Skip to content
        </a>

        <ModalProvider>
          {/* Welcome Screen / Intro Loader (Session-based, skippable) */}
          <IntroLoader />

          {/* Persistent Header */}
          <Header />

          {/* Full-screen Menu Overlay */}
          <MenuOverlay />

          {/* Global Contact Modal */}
          <ContactModal />

          {/* Page Content */}
          <main id="main-content" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}
