import "./globals.css";

export const metadata = {
  title: "AI Security & Dev Suite",
  description: "5-in-1 AI powered security and development toolkit powered by Groq",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
