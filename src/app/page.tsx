import PageLink from "@/components/LinkPagina/LinkPagina";
import Image from "next/image";
export default function Home() {
    return (
        <main className="page-layout items-center justify-start bg-gradient-to-b md:bg-gradient-to-r from-slate-50 dark:from-black from-10% via-gray-200 dark:via-gray-950 via-45% to-gray-300 dark:to-red-950 to-100% md:to-90% bg-white text-gray-950 dark:bg-black dark:text-gray-200 min-h-screen">
            {/* Introdução */}
            <div className="flex flex-col items-center justify-center md:grid md:grid-cols-2 max-w-6xl mx-auto gap-8 p-2 border-white md:mt-16">
                <div className="max-w-4xl">
                    {/* 1° parágrafo*/}
                    <h1 className="text-xl text-center md:text-2xl lg:text-4xl font-bold">Seu transporte em tempo real</h1>
                    <p className="my-2 sm:my-4 md:text-lg text-center md:text-justify">
                        Com o <span className="custom-gradient font-bold">Autorail Monitor</span> você acompanha tudo que acontece nas Linhas 8 Diamante e 9 Esmeralda.
                    </p>
                    {/* 2° parágrafo */}
                    <p className="my-2 sm:my-4 md:text-lg text-center md:text-justify">Acompanhe alertas, confira status de linhas e obtenha suporte para dificuldades relacionadas ao transporte metropolitano.</p>

                    {/* 3° parágrafo */}
                    <p className="my-2 sm:my-4 md:text-lg text-center md:text-justify">Acesse de qualquer dispositivo, a qualquer momento. Planeje viagens mais seguras, uma rotina mais tranquila.</p>
                </div>

                {/* imagem */}
                <Image className="rounded-2xl w-96 md:w-full drop-shadow-xl/75 drop-shadow-gray-600 dark:drop-shadow-rose-800" src={"/images/cellphone.jpg"} alt="Homem mexendo no celular dentro do trem" width={400} height={400} />
            </div>

            {/* Link que redireciona para a página de alertas */}
            <div className="mt-16">
                <PageLink href={"/alertas"}>Comece a explorar!</PageLink>
            </div>
        </main>
    );
}
