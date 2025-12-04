import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Providers from "@/app/providers";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

export const metadata: Metadata = {
	title: "Секции МАИ",
	description: "Сайт спортивных секцй МАИ",
	icons: [{ rel: "icon", url: "/Logo.jpg" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`}>
			<body>
                <Providers>
                {children}
                <ReactQueryDevtools initialIsOpen={false}/>
                </Providers>
            </body>
		</html>
	);
}
