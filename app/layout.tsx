import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://simulador-world-2026.vercel.app'),
  title: 'Simulador Worlds 2026 — Fase Suiza & Playoffs',
  description: 'Simulador analítico e interactivo del Campeonato Mundial de League of Legends 2026. Predice la Fase Suiza y el cuadro de eliminación directa.',
  icons: {
    icon: '/assets/Worlds.jpg?v=2',
    shortcut: '/assets/Worlds.jpg?v=2',
    apple: '/assets/Worlds.jpg?v=2',
  },
  openGraph: {
    title: 'Simulador Worlds 2026 — Fase Suiza & Playoffs',
    description: 'Simulador analítico e interactivo del Campeonato Mundial de League of Legends 2026. Predice la Fase Suiza y el cuadro de eliminación directa.',
    url: 'https://simulador-world-2026.vercel.app',
    siteName: 'Simulador Worlds 2026',
    images: [
      {
        url: '/assets/Worlds.jpg?v=2',
        width: 1200,
        height: 630,
        alt: 'Simulador Worlds 2026',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulador Worlds 2026 — Fase Suiza & Playoffs',
    description: 'Simulador analítico e interactivo del Campeonato Mundial de League of Legends 2026. Predice la Fase Suiza y el cuadro de eliminación directa.',
    images: ['/assets/Worlds.jpg?v=2'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`dark ${inter.variable}`}>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 font-sans min-h-screen flex flex-col antialiased selection:bg-zinc-800 selection:text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
