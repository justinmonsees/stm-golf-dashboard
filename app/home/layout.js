import { Roboto } from "next/font/google";
import "../globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

import Header from "@/components/home/Header";
import { CartContextProvider } from "@/lib/context/cartContext";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <CartContextProvider>
          <Header />
          {children}
        </CartContextProvider>
      </body>
    </html>
  );
}
