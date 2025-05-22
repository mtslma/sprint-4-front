"use client";

import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import RegistrarManutencaoForm from "@/components/Formularios/RegistrarManutencaoForm/RegistrarManutencaoForm";
import ListaManutencoes from "@/components/Listas/ListaManutencoes/ListaManutencoes";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { manutencaoBody, estacaoBody, linhaBody } from "@/types/props";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function GerenciarManutencao() {
    // Armazenando manutenções, estações e linhas
    const [manutencoes, setManutencoes] = useState<manutencaoBody[]>([]);
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

    // Função que faz a chamada para a manutenção
    const fetchManutencoes = useCallback(async () => {
        setLoading(true); // Página carregando
        try {
            const res = await fetch(`${API_BASE}/manutencao/search`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setManutencoes(data.data); // Guarda as informações encontradas no state de manutenções
            } else {
                setError(await res.text()); // Pega o erro da API e salva
            }
        } catch {
            showPopup("Erro ao carregar manutenções", "error");
        } finally {
            setLoading(false); // Fim do loading
        }
    }, []);

    // useEffect para carregar as manutenções
    useEffect(() => {
        fetchManutencoes();
    }, [fetchManutencoes]);

    // useEffect para carregar as estações
    useEffect(() => {
        setLoading(true); // Página carregando
        const fetchEstacoes = async () => {
            try {
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
        };

        fetchEstacoes();
    }, []);

    // useEffect para carregar as linhas
    useEffect(() => {
        setLoading(true); // Página carregando
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

        fetchLinhas();
    }, []);

    // Função que faz a chamada para a exclusão da manutenção
    const excluirManutencao = async (id: string) => {
        try {
            // Buscando a manutenção por ID no método DELETED para a exclusão
            const res = await fetch(`${API_BASE}/manutencao/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Analisando a resposta
            if (res.ok) {
                showPopup("Manutenção excluída com sucesso.", "success");
                fetchManutencoes(); // Atualiza a lista de manutenções
            } else {
                setError(await res.text());
            }
        } catch {
            showPopup("Erro ao excluir manutenção", "error");
        }
    };

    // Função que recebe cliques nos formulários
    const onSubmit: SubmitHandler<manutencaoBody> = async (data) => {
        // Corpo que será enviado para a API
        const corpojson = {
            id: data.id,
            nomeManutencao: data.nomeManutencao,
            descricaoManutencao: data.descricaoManutencao,
            nivelPrioridade: data.nivelPrioridade,
            idLinha: data.idLinha,
            idEstacao: data.idEstacao,
        };

        try {
            // Fazendo o POST para a API passando o corpo que foi criado com os dados pegos do formulários
            const res = await fetch(`${API_BASE}/manutencao`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpojson),
            });

            if (res.ok) {
                showPopup("Manutenção registrada com sucesso.", "success");
                fetchManutencoes(); // Atualizando a lista de manutenções para exibir a manutenção que foi adicionada
            } else {
                showPopup(`Erro ao registrar manutenção: ${res.status}`, "error");
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
            <PageTitle iconName="wrench">Gerenciar Manutenções</PageTitle>

            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/">
                <i className="fa-solid fa-arrow-left" /> Voltar para área do colaborador
            </Link>

            <div className="flex flex-col md:flex-row items-start md:justify-center gap-8 mt-8 w-full px-4">
                {/* Chamando o componente de lista de manunteções */}
                <ListaManutencoes manutencoes={manutencoes} onExcluir={excluirManutencao}></ListaManutencoes>

                {/* Formulário de Registro */}
                <RegistrarManutencaoForm linhas={linhas} estacoes={estacoes} onSubmit={onSubmit}></RegistrarManutencaoForm>
            </div>
        </div>
    );
}
