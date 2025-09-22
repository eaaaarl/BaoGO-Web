import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider as ReduxProvider } from 'react-redux'
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/lib/redux/store";
import { Toaster } from "@/components/ui/sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BaoGO",
  description: "BaoGO: a localized hailing app",
};

const persistor = persistStore(store);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <Toaster />
            {children}
          </PersistGate>
        </ReduxProvider>
      </body>
    </html>
  );
}
