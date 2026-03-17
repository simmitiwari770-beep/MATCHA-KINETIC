import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Matcha Kinetic Experience | Bold Fusion Iced Matcha",
  description:
    "A premium scrollytelling journey through the explosive collision of ceremonial matcha and dark-roasted espresso. Watch crystalline ice and vibrant liquid shots orbit in a zero-gravity void.",
  keywords: ["matcha", "espresso", "kinetic", "scrollytelling", "iced matcha", "fusion"],
  openGraph: {
    title: "The Matcha Kinetic Experience",
    description: "Bold Fusion. Kinetic Chill. Liquid Energy. Uncompromised.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
