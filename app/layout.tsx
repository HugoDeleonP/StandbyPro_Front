import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'StandbyPro — Gestão de Manutenção de Motores WEG',
  description:
    'Plataforma de gestão de manutenção de motores WEG: motores, ordens de serviço, manutenções preventivas, corretivas e preditivas, e indicadores em tempo real.',
  icons: {
    icon: 'icon.svg'
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#10151f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
