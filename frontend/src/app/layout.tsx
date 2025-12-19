import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationProvider } from "@/components/NotificationProvider";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "1000 Hills Solicitors - Building Bridges to Justice | Rwanda's Leading Law Firm",
    template: "%s | 1000 Hills Solicitors"
  },
  description: "Expert legal services in Rwanda. Specializing in corporate law, litigation, mediation, property law, family law, and legal consultancy. Trusted legal partner since 2010.",
  keywords: ["law firm Rwanda", "legal services Kigali", "corporate law Rwanda", "litigation Rwanda", "property law", "family law", "legal consultancy", "1000 Hills Solicitors"],
  authors: [{ name: "1000 Hills Solicitors" }],
  creator: "1000 Hills Solicitors",
  publisher: "1000 Hills Solicitors",
  openGraph: {
    type: "website",
    locale: "en_RW",
    url: "https://1000hills.rw",
    siteName: "1000 Hills Solicitors",
    title: "1000 Hills Solicitors - Building Bridges to Justice",
    description: "Rwanda's trusted legal partner providing expert services in corporate law, litigation, mediation, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "1000 Hills Solicitors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "1000 Hills Solicitors - Building Bridges to Justice",
    description: "Expert legal services in Rwanda since 2010",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
