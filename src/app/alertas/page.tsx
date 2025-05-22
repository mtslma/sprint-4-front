"use client";
import { CaixaAlerta } from "@/components/CaixaAlerta/CaixaAlerta";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import SearchBar from "@/components/SearchBar/SearchBar";
import { API_BASE, API_KEY } from "@/services/config"; // Aqui está sua API_KEY
import { alertaBody } from "@/types/props";
import { useEffect, useState } from "react";

// Função que monta a URL da API com base nos filtros aplicados
function montarUrlComFiltros(baseUrl: string, filtros: Record<string, string | number | undefined>): string {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== "") {
            params.append(chave, valor.toString());
        }
    });

    // Retorna a URL que será utilizada para busca
    return `${baseUrl}?${params.toString()}`;
}

export default function ListaAlertas() {
    // Informações dos alertas que serão buscadas da API
    const [alertas, setAlertas] = useState<alertaBody[]>([]); // Lista de alertas carregados

    // Estado de carregamento
    const [loading, setLoading] = useState(true); // Indicador de carregamento
    // Erros do sistema
    const [erro, setErro] = useState<string | null>(null);

    // Informações úteis para páginação
    const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
    const [itensPorPagina, setItensPorPagina] = useState(12); // Quantidade de itens por página
    const [totalItens, setTotalItens] = useState(0); // Total de itens encontrados

    // Filtros aplicados
    const [filtros, setFiltros] = useState<Record<string, string>>({}); // Filtros de busca (ex: nome, descrição)

    // Cálculo do total de páginas
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    // Função para avançar a página na paginação
    const avancarPagina = () => {
        if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
    };

    // Função para voltar uma página na paginação
    const voltarPagina = () => {
        if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
    };

    // Efeito para buscar os alertas toda vez que os filtros ou a página mudarem
    useEffect(() => {
        const buscarAlertas = async () => {
            const filtrosApi = {
                page: paginaAtual,
                nome: filtros.nome || "",
                descricao: filtros.descricao || "",
                nivel: filtros.nivel || "",
                direction: "asc", // Ordenação fixa
            };

            // Monta a URL com os filtros aplicados
            const url = montarUrlComFiltros(`${API_BASE}/alerta/search`, filtrosApi);

            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });

                if (res.status === 204) {
                    // Nenhum resultado encontrado
                    setAlertas([]);
                    setTotalItens(0);
                } else if (res.ok) {
                    // Convertendo os dados buscados para json
                    const dados = await res.json();

                    // Salva os dados retornados da API nos states
                    setAlertas(dados.data);
                    setItensPorPagina(dados.pageSize);
                    setTotalItens(dados.totalItems);
                } else {
                    const erroTexto = await res.text();
                    setErro(erroTexto);
                }
            } catch (error) {
                console.log(error);
                setErro("Erro de conexão com a API");
            } finally {
                setLoading(false);
            }
        };

        buscarAlertas();
    }, [paginaAtual, filtros]); // Executa quando filtros ou página mudam

    // Exibe página de carregamento enquanto os dados são buscados
    if (loading) return <LoadingPage />;

    // Exibe página de erro, caso algo tenha dado errado
    if (erro) return <ErrorPage error={erro} />;

    // Opções disponíveis para filtrar os alertas
    const opcoesFiltro = [
        { label: "Nome", valor: "nome" },
        { label: "Descrição", valor: "descricao" },
        { label: "Nível", valor: "nivel" },
    ];

    // Função chamada ao aplicar um filtro na SearchBar
    const FiltrarInput = (filtro: string, valor: string) => {
        setFiltros({ [filtro]: valor }); // Aplica apenas o filtro atual
        setPaginaAtual(1); // Sempre volta para a primeira página
    };

    // Renderiza os botões de paginação
    const renderPagination = () => {
        if (totalItens === 0) return null;

        return (
            <div className="flex gap-4 mt-6 items-center justify-center">
                <button onClick={voltarPagina} disabled={paginaAtual === 1} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">
                    Anterior
                </button>
                <span className="self-center font-semibold">
                    Página {paginaAtual} de {totalPaginas}
                </span>
                <button onClick={avancarPagina} disabled={paginaAtual === totalPaginas} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">
                    Próxima
                </button>
            </div>
        );
    };

    return (
        <main className="flex flex-col items-center mt-4 w-full h-full mb-4">
            {/* Título da página */}
            <PageTitle iconName="triangle-exclamation">Alertas</PageTitle>

            {/* Barra de busca com filtros */}
            <SearchBar filtros={opcoesFiltro} onFiltrar={FiltrarInput} />

            {/* Renderiza os alertas ou mensagem de "nenhum encontrado" */}
            {totalItens > 0 ? (
                <>
                    {/* Grid responsivo de cards de alertas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl px-4 place-items-center">
                        {alertas.map((alerta) => (
                            <CaixaAlerta key={alerta.id} {...alerta} />
                        ))}
                    </div>

                    {/* Navegação entre páginas */}
                    {renderPagination()}
                </>
            ) : (
                <p className="text-gray-600 text-center w-full">
                    <i className="fa-solid fa-circle-exclamation"></i> Nenhum alerta encontrado
                </p>
            )}
        </main>
    );
}
