import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Sora } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { InventoryProvider } from "@/context/InventoryContext";
import { PolicyProvider } from "@/context/PolicyContext";
import { RoleProvider } from "@/context/RoleContext";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Colony · Mars Ledger",
  description:
    "Gear you take, resources you bring back. Week board, policy, and storeroom.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable}`}
    >
      <body className="font-body antialiased">
        <RoleProvider>
          <PolicyProvider>
            <InventoryProvider>
              <AppShell>{children}</AppShell>
            </InventoryProvider>
          </PolicyProvider>
        </RoleProvider>
      </body>
    </html>
  );
};

export default RootLayout;
