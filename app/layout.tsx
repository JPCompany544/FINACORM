import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/supabase";
import Script from "next/script";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "FINACORM Bank - Premium Digital Banking without Borders",
    template: "%s | FINACORM Bank"
  },
  description: "Experience premium digital banking with enterprise-grade security, global instant transfers, investment accounts, and 24/7 client concierge support.",
  metadataBase: new URL("https://finacorm.bank"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://finacorm.bank",
    siteName: "FINACORM Bank",
    title: "FINACORM Bank - Premium Digital Banking without Borders",
    description: "Experience premium digital banking with enterprise-grade security, global instant transfers, investment accounts, and 24/7 client concierge support.",
    images: [
      {
        url: "/Logo-main.png",
        width: 1200,
        height: 630,
        alt: "FINACORM Bank Logo",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FINACORM Bank - Premium Digital Banking without Borders",
    description: "Experience premium digital banking with enterprise-grade security, global instant transfers, investment accounts, and 24/7 client concierge support.",
    images: ["/Logo-main.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans bg-background text-foreground"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        
        {/* Tawk.to Live Chat Widget */}
        <Script id="tawk-widget" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6a76077a941ab01d456d7ac1/1jvegqe2o';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
