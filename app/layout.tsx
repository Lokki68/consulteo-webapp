import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import {ReactQueryProvider} from "@/lib/providers/react-query-provider.tsx";
import {Navigation} from "@/components/sections/navigation.tsx";
import {SonnerProvider} from "@/lib/providers/sonner-provider.tsx";
import {AuthProvider} from "@/lib/providers/auth-provider.tsx";

const inter = Inter({ subsets: ['latin']})

export const metadata: Metadata = {
  title: "Consulteo - Plateforme de consultations médicale",
  description: "Touvez et consultez des praticiens de santé",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
    >
      <body className={inter.className}>
      <AuthProvider>
        <ReactQueryProvider>
          <div className='flex flex-col min-h-screen' >
            <main className='flex-1'>
              {children}
            </main>
          </div>
          <SonnerProvider />
        </ReactQueryProvider>


      </AuthProvider>
      </body>
    </html>
  );
}
