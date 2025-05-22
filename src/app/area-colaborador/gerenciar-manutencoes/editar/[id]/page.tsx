"use client";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import EditarManutencaoForm from "@/components/Formularios/EditarManutencaoForm/EditarManutencaoForm";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { estacaoBody, linhaBody, manutencaoBody } from "@/types/props";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function EditarManutencao() {
    // ID que será passado pela URL da página
    const { id } = useParams();

    // Informações que serão buscadas da API
    const [manutencao, setManutencao] = useState<manutencaoBody | null>(null);
    const [estacoes, setEstacoes] = useState<estacaoBody[]>([]);
    const [linhas, setLinhas] = useState<linhaBody[]>([]);

    // Informações úteis para o pop-up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estado de carregamento da página
    const [loading, setLoading] = useState<boolean>(false);
    // Estado de erro da página
    const [error, setError] = useState<string | null>(null);

    // Função para exibição do pop-up
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                // Função para buscar informações de manutneção, estações e linhas
                const fetchDados = async () => {
                    setLoading(true);
                    setError(null);

                    try {
                        // Buscar manutenção
                        const resManutencao = await fetch(`${API_BASE}/manutencao/${id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        // Analisando a resposta de manutenção
                        if (resManutencao.ok) {
                            const dataManutencao = await resManutencao.json();
                            setManutencao(dataManutencao);
                        } else {
                            setError(await resManutencao.text());
                        }

                        // Buscar estações
                        const resEstacoes = await fetch(`${API_BASE}/estacao/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        // Analisando a resposta de estações
                        if (resEstacoes.ok) {
                            const dataEstacoes = await resEstacoes.json();
                            setEstacoes(dataEstacoes.data);
                        } else {
                            setError(await resEstacoes.text());
                        }

                        // Buscar linhas
                        const resLinhas = await fetch(`${API_BASE}/linha/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        // Analisando a resposta de linhas
                        if (resLinhas.ok) {
                            const dataLinhas = await resLinhas.json();
                            setLinhas(dataLinhas.data);
                        } else {
                            setError(await resLinhas.text());
                        }
                    } catch (err) {
                        const msg = err instanceof Error ? err.message : "Erro desconhecido ao carregar dados";
                        setError(msg);
                        showPopup(msg, "error");
                    } finally {
                        setLoading(false);
                    }
                };

                // Chamando a função
                if (id) fetchDados();
            }
        }
        validarToken();
    }, [id]);

    // Função que recebe cliques no formulários
    const onSubmit: SubmitHandler<manutencaoBody> = async (data) => {
        try {
            setLoading(true);
            // Fazendo requisição para a API atualizar
            const res = await fetch(`${API_BASE}/manutencao/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(data),
            });

            // Analisando a resposta da API
            if (res.ok) {
                showPopup("Manutenção atualizada com sucesso.", "success");

                // Recarrega manutenção atualizada
                const updated = await fetch(`${API_BASE}/manutencao/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });

                if (res.ok) {
                    const updatedManutencao = await updated.json();
                    setManutencao(updatedManutencao);
                } else {
                    showPopup(`Erro recarregar lista de manutenções: ${res.status}`, "error");
                }
            } else {
                showPopup(`Erro ao atualizar manutenção: ${res.status}`, "error");
            }
        } catch {
            setError("Erro de conexão com a API.");
        } finally {
            setLoading(false);
        }
    };

    // Exibe loading enquanto os dados são carregados
    if (loading) return <LoadingPage></LoadingPage>;

    // Exibe mensagem de erro se existir
    if (error) return <ErrorPage error={error}></ErrorPage>;

    return (
        <main className="page-layout px-4">
            {/* Pop-up que fica escondido até ser chamado */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
            {/* Título da página */}
            <PageTitle iconName="wrench">{`Editando manutenção #${manutencao?.id}`}</PageTitle>
            {/* Link para voltar ao gerenciamento de estações */}
            <Link className="hover:underline text-xl mb-2 block" href="/area-colaborador/gerenciar-manutencoes">
                <i className="fa-solid fa-arrow-left" /> Voltar para gerenciamento
            </Link>

            {/* Formulário para edição de informações de estações*/}
            <EditarManutencaoForm manutencao={manutencao} estacoes={estacoes} linhas={linhas} onSubmit={onSubmit} />
        </main>
    );
}
