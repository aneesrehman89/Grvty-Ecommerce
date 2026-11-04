import "../app/globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Providers from "./providers";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "GRVTY | Athletic & Streetwear Built For The Grind",
    template: "%s | GRVTY",
  },
  description: "Performance streetwear engineered with premium materials for functional utility.",
  openGraph: {
    title: "GRVTY | Athletic & Streetwear",
    description: "Performance streetwear built for men who live between the gym and the streets.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <Providers>
          <Navbar />
          <main className="flex-grow w-full">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
