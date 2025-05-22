"use client";

import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import RegistrarEstacaoForm from "@/components/Formularios/RegistrarEstacaoForm/RegistrarEstacaoForm";
import ListaEstacoes from "@/components/Listas/ListaEstacoes/ListaEstacoes";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { estacaoBody, linhaBody } from "@/types/props";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function GerenciarEstacoes() {
    // Armazenando estações e linhas
    const [estacoes, setEstacoes] = useState<estacaoBody[]>([]);
    const [linhas, setLinhas] = useState<linhaBody[]>([]);

    // Armazenando informações da mensagem pop up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Armazenando informações do estado da página
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para exibir pop up
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    // Função para buscar estações
    const fetchEstacoes = useCallback(async () => {
        setLoading(true); // Página carregando
        try {
            // Enviando uma requisição para a API para buscar linhas
            const res = await fetch(`${API_BASE}/estacao/search`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setEstacoes(data.data); // Guarda as informações encontradas no state de estações
            } else {
                setError(await res.text()); // Pega o erro da API e salva
            }
        } catch {
            showPopup("Erro ao carregar estações", "error");
        } finally {
            setLoading(false); // Fim do loading
        }
    }, []);

    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                const fetchLinhas = async () => {
                    try {
                        const res = await fetch(`${API_BASE}/linha/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });
                        const data = await res.json();
                        if (res.ok) {
                            setLinhas(data.data); // Guarda as informações encontradas no state de linhas
                        } else {
                            setError(await res.text()); // Pega o erro da API e salva
                        }
                    } catch {
                        showPopup("Erro ao carregar linhas", "error");
                    } finally {
                        setLoading(false); // Fim do loading
                    }
                };

                // Chamando as funções
                fetchLinhas();
                fetchEstacoes();
            }
        }
        validarToken();
    }, [fetchEstacoes]);

    // Função que faz a chamada para a exclusão da estação
    const excluirEstacao = async (id: string) => {
        try {
            // Buscando a estação por ID no método DELETED para a exlusão
            const res = await fetch(`${API_BASE}/estacao/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Analisando a resposta
            if (res.ok) {
                showPopup("Estação excluída com sucesso.", "success");
                fetchEstacoes(); // Atualiza a lista de estações
            } else {
                setError(await res.text());
            }
        } catch {
            showPopup("Erro ao excluir estação", "error");
        }
    };

    // Função que recebe cliques nos formulários
    const onSubmit: SubmitHandler<estacaoBody> = async (data) => {
        // Corpo que será enviado para a API
        const corpojson = {
            idLinha: data.idLinha,
            nomeEstacao: data.nomeEstacao,
            statusEstacao: data.statusEstacao,
            inicioOperacao: data.inicioOperacao,
            fimOperacao: data.fimOperacao,
        };

        try {
            // Fazendo o POST para a API passando o corpo que foi criado com os dados pegos do formulários
            const res = await fetch(`${API_BASE}/estacao`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpojson),
            });

            // Analisando a resposta
            if (res.ok) {
                showPopup("Estação registrada com sucesso.", "success");
                fetchEstacoes(); // Atualizando a lista de estações para exibir a estação que foi adicionada
            } else {
                const erroTexto = await res.text();
                showPopup(erroTexto || "Erro ao registrar estação", "error");
            }
        } catch {
            showPopup("Erro de conexão com a API.", "error");
        }
    };

    // Exibe a tela de carregamento
    if (loading) return <LoadingPage />;
    // Exibe a tela de erro
    if (error) return <ErrorPage error={error} />;

    return (
        <div className="flex flex-col items-center mt-4 w-full h-full mb-4">
            {/* Elemento de popup que fica escondido aqui até precisar aparecer */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
            {/* Título da página */}
            <PageTitle iconName="house">Gerenciar Estações</PageTitle>

            {/* Link para voltar para a área do colaborador */}
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/">
                <i className="fa-solid fa-arrow-left" /> Voltar para área do colaborador
            </Link>

            <div className="flex flex-col md:flex-row items-start md:justify-center gap-8 mt-8 w-full px-4">
                {/* Chamando a lista de estações */}
                <ListaEstacoes estacoes={estacoes} onExcluir={excluirEstacao}></ListaEstacoes>

                {/* Chamando o formulário re registrar linhas */}
                <RegistrarEstacaoForm linhas={linhas} onSubmit={onSubmit}></RegistrarEstacaoForm>
            </div>
        </div>
    );
}
