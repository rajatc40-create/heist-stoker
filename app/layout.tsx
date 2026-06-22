import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreHydrator } from "@/components/providers/store-hydrator";
import { ThemeHydrator } from "@/components/providers/theme-hydrator";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEIST STOKER | Decode Smart Money",
  description:
    "A professional paper trading platform for liquidity, psychology, and wave theory workflows."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var s=localStorage.getItem('heist-stoker-platform-settings');var t=s?JSON.parse(s).theme:'emerald-light';if(t==='Dark Gold'||t==='Midnight'||t==='Terminal'||!t)t='emerald-light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='dark-gold'?'dark':'light';}catch(e){document.documentElement.dataset.theme='emerald-light';document.documentElement.style.colorScheme='light';}"
          }}
        />
        <ThemeHydrator />
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
