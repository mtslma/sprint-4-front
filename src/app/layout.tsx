import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const roboto = Roboto({
    weight: ["400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Autorail Monitor",
    description: "Acompanhe o funcionamento das linhas diamante e esmeralda em tempo real",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head suppressHydrationWarning>
                {/* Adicionando Font Awesome via CDN */}
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            </head>
            <body className={`${roboto.className} antialiased`}>
                {/* Bloco de estrutura de páginas */}
                <div className="min-h-screen flex flex-col max-w-screen bg-slate-50 dark:bg-black text-gray-950 dark:text-gray-300">
                    {/* Componente de cabeçalho */}
                    <Header></Header>
                    {/* Conteúdo que aparece nas páginas */}
                    <div className="min-h-screen">{children}</div>
                    {/* Componente de rodapé */}
                    <Footer></Footer>
                </div>
            </body>
        </html>
    );
}
