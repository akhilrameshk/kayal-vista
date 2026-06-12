// app/layout.tsx
import { Metadata } from 'next';
import AppThemeProvider from '@/components/AppThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'Kayal Vista | Premium Kerala Houseboat Bookings',
    template: '%s | Kayal Vista'
  },
  description: 'Book luxury houseboats and discover the scenic backwaters of Alappuzha, Kumarakom, and Kerala. Best prices guaranteed online.',
  keywords: [
    'Kerala houseboats', 
    'Alappuzha boat cruise', 
    'Kumarakom backwater tourism', 
    'Kayal Vista boat bookings',
    'Kerala holiday packages'
  ],
  authors: [{ name: 'Kayal Vista Team' }],
  metadataBase: new URL('https://kayalvista.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kayal Vista | Premium Kerala Houseboat Bookings',
    description: 'Discover the ultimate backwater experience in Kerala with luxury houseboats.',
    url: 'https://kayalvista.com',
    siteName: 'Kayal Vista',
    images: [
      {
        url: '/images/og-backwaters.jpg',
        width: 1200,
        height: 630,
        alt: 'Kayal Vista Luxury Houseboats Kerala',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" async />
      </head>
      <body>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}