"use client";

import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import ListaMensagensContato from "@/components/Listas/ListaMensagensContato/ListaMensagensContato";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import SearchBar from "@/components/SearchBar/SearchBar";
import { API_BASE, API_KEY } from "@/services/config";
import { msContatoBody } from "@/types/props";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

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

export default function MensagensContato() {
    // Lista de mensagens de contato carregadas
    const [contatos, setContatos] = useState<msContatoBody[]>([]);

    // Estado de carregamento principal, para a carga inicial da página
    const [loading, setLoading] = useState(true);
    // Erros do sistema
    const [erro, setErro] = useState<string | null>(null);

    // Informações úteis para paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(12);
    const [totalItens, setTotalItens] = useState(0);
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    // Informações usadas para exibição do pop-up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Filtros de busca aplicados
    const [filtros, setFiltros] = useState<Record<string, string>>({});

    // Referência para controlar se é a primeira vez que o useEffect é executado
    const isInitialMount = useRef(true);

    // Avança para a próxima página
    const avancarPagina = () => {
        if (paginaAtual < totalPaginas) {
            setPaginaAtual(paginaAtual + 1);
        }
    };

    // Função para exibir pop-ups
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000); // Fecha automaticamente após 4 segundos
    };

    // Volta para a página anterior
    const voltarPagina = () => {
        if (paginaAtual > 1) {
            setPaginaAtual(paginaAtual - 1);
        }
    };

    // Efeito para buscar os contatos toda vez que a página ou filtros mudarem
    useEffect(() => {
        async function validarTokenAndFetchMessages() {
            const token = typeof window !== "undefined" ? localStorage.getItem("session-token") : null;

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            }

            // Ativa o loading apenas na montagem inicial do componente
            if (isInitialMount.current) {
                setLoading(true);
            }

            const buscarMensagensContato = async () => {
                const filtrosApi = {
                    page: paginaAtual,
                    name: filtros.name || "",
                    text: filtros.text || "",
                    email: filtros.email || "",
                    direction: "asc",
                };

                const url = montarUrlComFiltros(`${API_BASE}/mensagem/search`, filtrosApi);

                try {
                    const res = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": API_KEY,
                        },
                    });

                    if (res.status === 204) {
                        // Nenhuma mensagem encontrada
                        setContatos([]);
                        setTotalItens(0);
                    } else if (res.ok) {
                        const dados = await res.json();
                        setContatos(dados.data);
                        setItensPorPagina(dados.pageSize);
                        setTotalItens(dados.totalItems);
                    } else {
                        const erroTexto = await res.text();
                        setErro(erroTexto);
                    }
                } catch {
                    setErro("Erro de conexão com a API.");
                } finally {
                    // Desativa o loading APENAS após a primeira carga
                    if (isInitialMount.current) {
                        setLoading(false);
                        isInitialMount.current = false; // Garante que não será mais a montagem inicial
                    }
                }
            };

            buscarMensagensContato();
        }

        // Chamando a função
        validarTokenAndFetchMessages();
    }, [paginaAtual, filtros]); // Reexecuta sempre que a página ou filtros mudam

    // Exibe página de carregamento inicial enquanto os dados estão sendo buscados
    if (loading) return <LoadingPage />;

    // Exibe página de erro, caso ocorra alguma falha
    if (erro) return <ErrorPage error={erro} />;

    // Opções de filtro disponíveis
    const opcoesFiltro = [
        { label: "Nome", valor: "name" },
        { label: "Email", valor: "email" },
        { label: "Mensagem", valor: "text" },
    ];

    const FiltrarInput = (filtro: string, valor: string) => {
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            [filtro]: valor,
        }));
        setPaginaAtual(1); // Resetar para a primeira página
    };

    // Função para "arquivar" (remover da lista visivelmente)
    async function onExcluir(id: string) {
        try {
            // Envia uma requisição DELETE para a API passando o ID da mensagem que será deletada
            const res = await fetch(`${API_BASE}/mensagem/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Validando resposta do método
            if (res.ok) {
                // Atualiza o estado removendo a mensagem da lista local
                setContatos((prev) => prev.filter((mensagemContato) => mensagemContato.id !== id));
                setTotalItens((prevTotal) => prevTotal - 1); // Atualiza o total de itens
                showPopup("Mensagem excluída com sucesso.", "success");
            } else {
                const erroTexto = await res.text();
                showPopup(erroTexto || "Erro ao excluir mensagem", "error");
            }
        } catch (error) {
            // Trata qualquer erro que possa ocorrer durante o processo
            showPopup("Erro ao excluir mensagem.", "error");
            console.error(error); // Log de erro adicional
        }
    }

    // Renderiza os controles de paginação
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
            {/* Pop-up que fica escondido */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            {/* Título da página */}
            <PageTitle iconName="envelope">Mensagens de contato</PageTitle>
            <Link className="hover:underline text-xl" href={"/area-colaborador"}>
                <i className="fa-solid fa-arrow-left" /> Voltar para a área do colaborador
            </Link>
            {/* Barra de busca com filtros */}
            <SearchBar filtros={opcoesFiltro} onFiltrar={FiltrarInput} />

            {/* Lista de mensagens ou mensagem de "nenhuma encontrada" */}
            {totalItens > 0 ? (
                <ListaMensagensContato contatos={contatos} totalItens={totalItens} onExcluir={onExcluir} renderPagination={renderPagination}></ListaMensagensContato>
            ) : (
                <p className="text-gray-600 text-center w-full">
                    <i className="fa-solid fa-circle-exclamation"></i> Nenhuma mensagem de contato encontrada
                </p>
            )}
        </main>
    );
}
