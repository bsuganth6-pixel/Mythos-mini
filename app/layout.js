import "./globals.css";

export const metadata = {
  title: "MYTHOS — AI Security Suite",
  description: "9-in-1 AI powered security and developer toolkit. Free, fast, powered by Groq LLaMA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
