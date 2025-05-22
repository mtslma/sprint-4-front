"use client";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import RegistrarAlertaForm from "@/components/Formularios/RegistrarAlertaForm/RegistrarAlertaForm";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { estacaoBody, linhaBody, registrarAlertaBody } from "@/types/props";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function RegistrarAlerta() {
    const [estacoes, setEstacoes] = useState<estacaoBody[]>([]);
    const [linhas, setLinhas] = useState<linhaBody[]>([]);

    // Estados para o AlertPopup
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estado de carregamento
    const [loading, setLoading] = useState(false); // Indicador de carregamento
    // Erros do sistema
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                // Buscando por estações para inserir no select
                const fetchEstacoes = async () => {
                    try {
                        const res = await fetch(`${API_BASE}/estacao/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        // Salvando as estações
                        if (res.ok) {
                            const data = await res.json();
                            setEstacoes(data.data);
                        } else {
                            setErro(await res.text());
                        }
                    } catch {
                        setErro("Erro de conexão com a API");
                    } finally {
                        setLoading(false);
                    }
                };

                // Buscando por linhas para inserir no select
                const fetchLinhas = async () => {
                    try {
                        const res = await fetch(`${API_BASE}/linha/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });
                        // Salvando as linhas
                        const data = await res.json();
                        setLinhas(data.data);
                    } catch {}
                };

                fetchEstacoes();
                fetchLinhas();
            }
        }

        validarToken();
    }, []);

    // Função para mostrar o AlertPopup com mensagem e tipo
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000); // Fecha após 4 segundos
    };

    // Função que recebe cliques
    const onSubmit: SubmitHandler<registrarAlertaBody> = async (data) => {
        const corpojson = {
            nomeAlerta: data.nomeAlerta,
            descricaoAlerta: data.descricaoAlerta,
            nivelGravidade: data.nivelAlerta,
            idLinha: data.idLinha,
            idEstacao: data.idEstacao,
        };

        try {
            // Fazendo requisição para a API
            const res = await fetch(`${API_BASE}/alerta`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpojson),
            });

            // Analisando a resposta
            if (!res.ok) {
                const erro = await res.text();
                showPopup(`Erro ao registrar alerta: ${res.status} - ${erro}`, "error");
                return;
            }

            showPopup("Alerta registrado com sucesso.", "success");
        } catch {
            showPopup("Erro de conexão com a API.", "error");
        }
    };

    // Exibe página de carregamento enquanto os dados são buscados
    if (loading) return <LoadingPage />;

    // Exibe página de erro, caso algo tenha dado errado
    if (erro) return <ErrorPage error={erro} />;

    return (
        <main className="flex flex-col items-center h-full p-4">
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            <PageTitle iconName="plus">Registrar Alerta</PageTitle>
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/">
                <i className="fa-solid fa-arrow-left" /> Voltar para área do colaborador
            </Link>

            {/* Chamando o formulário de registrar alertas */}
            <RegistrarAlertaForm linhas={linhas} estacoes={estacoes} onSubmit={onSubmit}></RegistrarAlertaForm>
        </main>
    );
}
