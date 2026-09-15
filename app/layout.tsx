import {loadContent} from "../lib/load-content";
import {pageMetadata} from "../lib/seo";
import "./globals.css";

export async function generateMetadata(){
 return {...pageMetadata(await loadContent()),icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head><link rel="preload" href="/fonts/sarang-text-core.woff" as="font" type="font/woff" crossOrigin="anonymous"/><link rel="preload" href="/fonts/sarang-brush-core.woff" as="font" type="font/woff" crossOrigin="anonymous"/></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
