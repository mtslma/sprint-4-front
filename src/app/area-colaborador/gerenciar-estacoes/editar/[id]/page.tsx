"use client";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import EditarEstacaoForm from "@/components/Formularios/EditarEstacaoForm/EditarEstacaoForm";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { estacaoBody, linhaBody } from "@/types/props";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function EditarEstacao() {
    const { id } = useParams(); // Obtém o id da estação da URL

    // Informações que serão buscadas da API
    const [linhas, setLinhas] = useState<linhaBody[]>([]);
    const [estacao, setEstacao] = useState<estacaoBody | null>(null); // Estado para armazenar a estação

    // Informações úteis para o pop-up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estado de carregamento da página
    const [loading, setLoading] = useState<boolean>(false);
    // Estado de erro da página
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                // Função para buscar os dados da estação
                const fetchEstacao = async () => {
                    setLoading(true); // Começar o loading
                    try {
                        const response = await fetch(`${API_BASE}/estacao/${id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });
                        if (!response.ok) {
                            throw new Error("Erro ao carregar os dados da estação");
                        }
                        const data = await response.json();
                        setEstacao(data);
                    } catch (error) {
                        setError(error instanceof Error ? error.message : "Erro desconhecido");
                    } finally {
                        setLoading(false); // Fim do loading
                    }
                };

                // Função para carregar as estações
                const fetchLinhas = async () => {
                    setLoading(true); // Começar o loading
                    try {
                        const res = await fetch(`${API_BASE}/linha/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });
                        if (!res.ok) {
                            throw new Error("Erro ao buscar linhas");
                        }
                        const data = await res.json();
                        setLinhas(data.data);
                    } catch {
                        setError("Erro ao conectar com a API");
                    } finally {
                        setLoading(false); // Fim do loading
                    }
                };

                // Chamando as funções
                fetchEstacao();
                fetchLinhas();
            }
        }
        validarToken();
    }, [id]);

    // Função para exibição do pop-up
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    const onSubmit: SubmitHandler<estacaoBody> = async (data) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/estacao/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                showPopup("Estação atualizada com sucesso.", "success");

                // Recarrega os dados atualizados
                const updated = await fetch(`${API_BASE}/estacao/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });
                const updatedEstacao = await updated.json();
                setEstacao(updatedEstacao);
            } else {
                showPopup("Erro ao atualizar estação.", "error");
            }
        } catch {
            showPopup("Erro de conexão com a API.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Exibe loading enquanto os dados são carregados
    if (loading) return <LoadingPage></LoadingPage>;

    // Exibe mensagem de erro se existir
    if (error) return <ErrorPage error={error}></ErrorPage>;

    return (
        <main className="flex flex-col items-center h-full p-4">
            {/* Pop-up que fica escondido até ser chamado */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
            {/* Título da página */}
            <PageTitle iconName="pen">{`Editar Estação #${id}`}</PageTitle>
            {/* Link para voltar ao gerenciamento de estações */}
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/gerenciar-estacoes">
                <i className="fa-solid fa-arrow-left" /> Voltar para tela de gerenciamento
            </Link>

            {/* Formulário para edição de informações de estações*/}
            <EditarEstacaoForm estacao={estacao} linhas={linhas} onSubmit={onSubmit}></EditarEstacaoForm>
        </main>
    );
}
