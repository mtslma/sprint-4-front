"use client";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import { CaixaEditarAlerta } from "@/components/CaixarEditarAlerta/CaixaEditarAlerta"; // Mantido pois foi o que você enviou
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage"; // Pode ser removido se não for usado em nenhum lugar
import PageTitle from "@/components/PageTitle/PageTitle";
import SearchBar from "@/components/SearchBar/SearchBar";
import { API_BASE, API_KEY } from "@/services/config";
import { alertaBody } from "@/types/props";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react"; // Adicionado useCallback e useRef

// Função para montar a URL com os filtros
function montarUrlComFiltros(baseUrl: string, filtros: Record<string, string | number | undefined>): string {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor !== undefined && valor !== "") {
            params.append(chave, valor.toString());
        }
    });
    return `${baseUrl}?${params.toString()}`;
}

export default function ListaAlertas() {
    // Alertas buscados
    const [alertas, setAlertas] = useState<alertaBody[]>([]);

    // Estado de carregamento interno (não exibe loading visual na tela)
    const [loadingInternal, setLoadingInternal] = useState(true);
    // Erros da página
    const [erro, setErro] = useState<string | null>(null);

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(12);
    const [totalItens, setTotalItens] = useState(0);
    // Filtros de busca
    const [filtros, setFiltros] = useState<Record<string, string>>({});

    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    // Pop-up de alerta
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<"success" | "error" | "info">("info");
    const [showAlert, setShowAlert] = useState(false);

    // Ref para controlar a primeira renderização do useEffect
    const isFirstRender = useRef(true);

    // Exibe o pop-up com a mensagem e tipo de status
    const showAlertMessage = useCallback((message: string, type: "success" | "error" | "info") => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
    }, []);

    // Avança para a próxima página
    const avancarPagina = useCallback(() => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual((prevPagina) => prevPagina + 1);
        }
    }, [paginaAtual, totalPaginas]);

    // Volta para a página anterior
    const voltarPagina = useCallback(() => {
        if (paginaAtual > 1) {
            setPaginaAtual((prevPagina) => prevPagina - 1);
        }
    }, [paginaAtual]);

    // Função para buscar os alertas na API
    const buscarAlertas = useCallback(async () => {
        // Ativa o loading interno para desabilitar botões enquanto busca
        setLoadingInternal(true);
        // Limpa erros anteriores
        setErro(null);

        const filtrosApi = {
            page: paginaAtual,
            nome: filtros.nome || "",
            descricao: filtros.descricao || "",
            nivel: filtros.nivel || "",
            direction: "asc",
        };

        // Montando a url com filtros para busca
        const url = montarUrlComFiltros(`${API_BASE}/alerta/search`, filtrosApi);

        try {
            // fazendo a requisição para api
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Analisando respostas
            if (res.status === 204) {
                setAlertas([]);
                setTotalItens(0);
            } else if (res.ok) {
                const dados = await res.json();
                setAlertas(dados.data);
                setItensPorPagina(dados.pageSize);
                setTotalItens(dados.totalItems);
            } else {
                const erroTexto = await res.text();
                throw new Error(erroTexto || `Erro ao buscar alertas: ${res.status}`);
            }
        } catch (err) {
            console.error("Erro na conexão ou API:", err);
            setErro(err instanceof Error ? err.message : "Erro desconhecido ao buscar alertas.");
            setAlertas([]);
            setTotalItens(0);
        } finally {
            // Desativa o loading interno
            setLoadingInternal(false);
        }
    }, [paginaAtual, filtros]);

    // Dispara a busca sempre que a página ou os filtros mudam
    useEffect(() => {
        // Ativa o loading completo APENAS na primeira renderização da página
        if (isFirstRender.current) {
            setLoadingInternal(true); // Controla o loading para a carga inicial
            isFirstRender.current = false;
        }
        buscarAlertas();
    }, [buscarAlertas, paginaAtual, filtros]);

    // Aplica o filtro recebido da SearchBar
    const handleFiltrarInput = useCallback(
        (filtro: string, valor: string) => {
            setFiltros((prevFiltros) => {
                // Se o valor do filtro não mudou, não atualiza o estado
                if (prevFiltros[filtro] === valor) {
                    return prevFiltros;
                }
                return {
                    ...prevFiltros,
                    [filtro]: valor,
                };
            });

            // Reseta para a primeira página se não estiver nela
            if (paginaAtual !== 1) {
                setPaginaAtual(1);
            }
        },
        [paginaAtual]
    );

    // Função para excluir um alerta
    const excluirAlerta = useCallback(
        async (id: string) => {
            setLoadingInternal(true); // Ativa o loading interno para a ação de exclusão
            try {
                const response = await fetch(`${API_BASE}/alerta/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });

                if (response.ok) {
                    // Se a exclusão for bem-sucedida
                    setAlertas((prevAlertas) => prevAlertas.filter((a) => a.id !== id));
                    setTotalItens((prevTotal) => prevTotal - 1);
                    showAlertMessage("Alerta excluído com sucesso!", "success");
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText || "Falha ao excluir alerta");
                }
            } catch (error) {
                console.error("Erro ao excluir alerta:", error);
                showAlertMessage(`Erro ao excluir alerta: ${error instanceof Error ? error.message : "Erro desconhecido"}`, "error");
            } finally {
                setLoadingInternal(false); // Desativa o loading interno
            }
        },
        [showAlertMessage]
    );

    // Renderiza a paginação
    const renderPagination = useCallback(() => {
        if (totalItens === 0) return null;

        return (
            <div className="flex gap-4 mt-6 items-center justify-center">
                <button onClick={voltarPagina} disabled={paginaAtual === 1 || loadingInternal} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">
                    Anterior
                </button>
                <span className="self-center font-semibold">
                    Página {paginaAtual} de {totalPaginas}
                </span>
                <button onClick={avancarPagina} disabled={paginaAtual === totalPaginas || loadingInternal} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50">
                    Próxima
                </button>
            </div>
        );
    }, [paginaAtual, totalPaginas, avancarPagina, voltarPagina, totalItens, loadingInternal]);

    // Exibe a página de carregamento apenas na carga inicial completa
    if (loadingInternal && isFirstRender.current) return <LoadingPage />;
    // Exibe mensagem de erro se existir
    if (erro) return <ErrorPage error={erro} />;

    // Opções de filtro para a SearchBar
    const opcoesFiltro = [
        { label: "Nome", valor: "nome" },
        { label: "Descrição", valor: "descricao" },
        { label: "Nível", valor: "nivel" },
    ];

    return (
        <main className="flex flex-col items-center h-full p-4">
            {/* Exibe o alertPopup se houver uma mensagem */}
            <AlertPopup message={alertMessage} type={alertType} isVisible={showAlert} onClose={() => setShowAlert(false)} />

            <PageTitle iconName="eraser">Gerenciar alertas</PageTitle>
            <Link className="hover:underline text-xl" href={"/area-colaborador"}>
                <i className="fa-solid fa-arrow-left" /> Voltar para a área do colaborador
            </Link>

            {/* Barra de pesquisa com filtros */}
            <SearchBar filtros={opcoesFiltro} onFiltrar={handleFiltrarInput} />

            {totalItens > 0 ? (
                <>
                    {/* Renderiza os alertas em forma de cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl px-4 place-items-center">
                        {alertas.map((alerta) => (
                            <CaixaEditarAlerta key={alerta.id} {...alerta} excluirAlerta={excluirAlerta} />
                        ))}
                    </div>
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
