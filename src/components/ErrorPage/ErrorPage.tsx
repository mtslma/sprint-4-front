import PageLink from "../LinkPagina/LinkPagina";

export default function ErrorPage(props: { error: string }) {
    const { error } = props;
    return (
        <div className="w-screen h-screen flex flex-col items-center justify-start gap-4 mt-16 p-8">
            <i className="fa-triangle-exclamation fa-solid text-6xl md:text-8xl"></i>
            <h1 className="text-lg md:text-2xl text-center">Erro ao carregar a página:</h1>
            <p className="text-lg md:text-2xl text-red-700 font-bold"> {error}</p>
            <PageLink href={"/"}>Voltar para página inicial</PageLink>
        </div>
    );
}
