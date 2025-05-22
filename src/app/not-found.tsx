import PageLink from "@/components/LinkPagina/LinkPagina";

export default function NotFound() {
    return (
        <main className="page-layout text-center justify-center gap-16">
            <div>
                <h1 className="custom-gradient font-bold text-8xl md:text-9xl tracking-wider">404</h1>
                <p className="font-bold text-2xl md:text-4xl">Página não encontrada</p>
            </div>

            <PageLink href={"/"}>Voltar ao início</PageLink>
        </main>
    );
}
