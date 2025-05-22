"use client";
import LinhaStatusForm from "@/components/Formularios/AtualizarStatusLinhaForm/AtualizarStatusLinhaForm";
import PageTitle from "@/components/PageTitle/PageTitle";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import { atualizarStatusBody, estacaoBody, linhaBody } from "@/types/props";
import { useEffect, useState } from "react";
import Link from "next/link";
import EstacaoStatusForm from "@/components/Formularios/AtualizarStatusEstacaoForm/AtualizarStatusEstacaoForm";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import { API_BASE, API_KEY } from "@/services/config";

export default function FormularioLinhaStatus() {
    // Guarda as linhas buscadas
    const [linhas, setLinhas] = useState<linhaBody[]>([]);
    // Guarda as estações buscadas
    const [estacoes, setEstacoes] = useState<estacaoBody[]>([]);

    // Dados utilizados para o pop-up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estado de carregamento da página
    const [loading, setLoading] = useState(true);
    // Erros da página
    const [error, setError] = useState<string | null>(null);

    // Função usada para exibir o pop-up após as atualizações
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    // Buscando os dados que serão utilizados nos selects
    useEffect(() => {
        setLoading(true);
        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                const fetchData = async () => {
                    try {
                        // Fazendo a busca na API para a rota linha e estação
                        const [linhasRes, estacoesRes] = await Promise.all([
                            // Buscando linhas
                            fetch(`${API_BASE}/linha/search`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "x-api-key": API_KEY,
                                },
                            }),

                            // Buscando estações
                            fetch(`${API_BASE}/estacao/search`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "x-api-key": API_KEY,
                                },
                            }),
                        ]);

                        // Salvando os dados
                        const linhasData = await linhasRes.json();
                        const estacoesData = await estacoesRes.json();
                        setLinhas(linhasData.data);
                        setEstacoes(estacoesData.data);
                    } catch {
                        // Guardando erros
                        setError("Erro ao carregar dados das linhas e estações");
                    } finally {
                        setLoading(false);
                    }
                };
                fetchData();
            }
        }

        validarToken();
    }, []);

    // Função que gerencia cliques no formulário de linhas
    const handleSubmitLinha = async (linha: atualizarStatusBody) => {
        try {
            // Preparando o corpo que será enviado
            const corpoJson = {
                statusLinha: linha.status,
            };

            // Enviando a soliticação de atuaolização para a API a partir do método PUT
            const res = await fetch(`${API_BASE}/linha/status/${linha.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpoJson),
            });

            // Exibindo mensagens de confirmação ou erros
            if (res.ok) {
                showPopup("Status da linha atualizado com sucesso", "success");
            } else {
                const erroTexto = await res.text();
                console.error("Erro da API:", erroTexto);
                showPopup(erroTexto || "Erro ao atualizar o status da linha", "error");
            }
        } catch {
            showPopup("Erro na conexão com a API", "error");
        }
    };

    // Função que gerencia cliques no formulário de estações
    const handleSubmitEstacao = async (estacao: atualizarStatusBody) => {
        try {
            // Preparando o corpo que será enviado
            const corpoJson = {
                statusEstacao: estacao.status,
            };

            // Enviando a soliticação de atuaolização para a API a partir do método PUT
            const res = await fetch(`${API_BASE}/estacao/status/${estacao.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpoJson),
            });

            // Exibindo mensagens de confirmação ou erros
            if (res.ok) {
                showPopup("Status da estação atualizado com sucesso", "success");
            } else {
                const erroTexto = await res.text();
                showPopup(erroTexto || "Erro ao atualizar o status da estação", "error");
            }
        } catch {
            showPopup("Erro na conexão com a API", "error");
        }
    };

    // Exibindo tela de carregamento
    if (loading) return <LoadingPage></LoadingPage>;
    // Exibindo tela de erro
    if (error) return <ErrorPage error={error}></ErrorPage>;

    return (
        <main className="flex flex-col items-center mt-4 w-full h-full mb-4">
            {/* Alerta pop-up que fica escondido até ter o state alterado */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            {/* Título da página */}
            <PageTitle iconName="pen">Atualizar status</PageTitle>

            {/* Link para voltar para área de colaborador */}
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/">
                <i className="fa-solid fa-arrow-left" /> Voltar para área do colaborador
            </Link>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Chamando o formulário de linhas */}
                <LinhaStatusForm linhas={linhas} onSubmit={handleSubmitLinha} />
                {/* Chamando o formulário de estações */}
                <EstacaoStatusForm estacoes={estacoes} onSubmit={handleSubmitEstacao} />
            </div>
        </main>
    );
}
