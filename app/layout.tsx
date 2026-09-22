import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Simulador Fase Suiza — Worlds 2026',
  description: 'Simulador analítico del Campeonato Mundial de League of Legends',
  icons: {
    icon: '/assets/G2_Esport.jpg',
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
