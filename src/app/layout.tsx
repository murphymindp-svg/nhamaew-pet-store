import type { Metadata } from "next";
import "./globals.css";
import { dmSans, notoSansThai } from "@/assets/fonts";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-options";
import Layouts from "@/layouts/layout";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const metadata: Metadata = {
  title: "Nhamaew Pet Store",
  description: "สินค้าสัตว์เลี้ยงโดยทีมสัตวแพทย์",
  viewport: "width=device-width, initial-scale=1",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${notoSansThai.variable} ${dmSans.variable} font-sans`}>

      <body suppressHydrationWarning>
        <div id="portal"></div>
        <Providers session={session}>
          <Layouts>{children}</Layouts>
        </Providers>
      </body>
    </html>
  );
}
