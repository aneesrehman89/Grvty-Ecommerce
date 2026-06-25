import "../app/globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";

export const metadata = {
  title: "GRVTY | Athletic & Streetwear Built For The Grind",
  description: "Performance streetwear engineered with premium materials for functional utility.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}