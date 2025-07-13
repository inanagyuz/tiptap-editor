import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { QueryProvider } from '@/components/tanstack-query';

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
});

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
});

export const metadata: Metadata = {
   title: 'Tiptap Editor',
   description: 'A simple Tiptap editor with Next.js and Tailwind CSS',
   authors: [
      {
         name: 'İnan Ağyüz',
         url: 'https://inanayguz.com.tr',
      },
   ],
   keywords: ['Tiptap', 'Next.js', 'Tailwind CSS', 'Editor Example'],
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <QueryProvider>
               <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
               >
                  <Toaster />
                  {children}
               </ThemeProvider>
            </QueryProvider>
         </body>
      </html>
   );
}
