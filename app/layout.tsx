import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { PostHogProvider } from '@/components/providers/PostHogProvider'
import './globals.css'

const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('theme'),m=(s==='light'||s==='dark'||s==='auto')?s:'auto',d=window.matchMedia('(prefers-color-scheme: dark)').matches,r=m==='auto'?(d?'dark':'light'):m,el=document.documentElement;el.classList.remove('light','dark');el.classList.add(r);m==='auto'?el.removeAttribute('data-theme'):el.setAttribute('data-theme',m);el.style.colorScheme=r;}catch(e){}})();`

export const metadata: Metadata = {
  title: 'DocMarket — Document Marketplace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PostHogProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
