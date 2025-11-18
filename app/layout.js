import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "AI Interview Mocker - Practice with AI-Powered Feedback",
  description:
    "An interactive platform for users to practice mock interviews and receive AI-generated feedback to enhance their skills.",
  keywords:
    "AI, Mock Interview, Feedback, Practice, Interview Skills, Resume, ATS, Job Preparation",
  author: "Sudharsan A",
  robots: "index, follow",
  charset: "UTF-8",

  // Open Graph & Twitter meta tags
  openGraph: {
    title: "AI Mock Interview - Practice with AI-Powered Feedback",
    description:
      "An interactive platform for users to practice mock interviews and receive AI-generated feedback to enhance their skills.",
    image: "/ai-mock-interview.jpg",
    url: "https://quest-ai-eight.vercel.app/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Mock Interview - Practice with AI-Powered Feedback",
    description:
      "An interactive platform for users to practice mock interviews and receive AI-generated feedback to enhance their skills.",
    image: "/ai-mock-interview.jpg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const themeColor = "#ffffff";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* favicon */}
          <link rel="icon" type="image/png" href="/logo.svg" />

          {/* Meta tags */}
          <meta
            name="description"
            content="An interactive AI-powered mock interview platform."
          />
          <meta
            name="keywords"
            content="AI, Mock Interview, Feedback, Practice"
          />
          <meta name="author" content="Sudharsan A" />

          {/* Open Graph */}
          <meta property="og:title" content={metadata.openGraph.title} />
          <meta
            property="og:description"
            content={metadata.openGraph.description}
          />
          <meta property="og:image" content={metadata.openGraph.image} />
          <meta property="og:url" content={metadata.openGraph.url} />
          <meta property="og:type" content={metadata.openGraph.type} />

          {/* Twitter */}
          <meta name="twitter:card" content={metadata.twitter.card} />
          <meta name="twitter:title" content={metadata.twitter.title} />
          <meta
            name="twitter:description"
            content={metadata.twitter.description}
          />
          <meta name="twitter:image" content={metadata.twitter.image} />

          {/* Mobile Web App Tags */}
          <meta name="theme-color" content={themeColor} />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
