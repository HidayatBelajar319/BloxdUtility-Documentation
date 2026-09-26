import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bloxd Utility Documentation',
  description: 'Complete documentation for Bloxd.io Utility - API reference, guides, and developer tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}