import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Sidebar from '@/components/layout/Sidebar'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
})

export const metadata: Metadata = {
  title: 'Lumio',
  description: 'Tu asistente académico inteligente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${sora.variable} font-sora antialiased bg-[#0A0F0D]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="lg:ml-64 flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}