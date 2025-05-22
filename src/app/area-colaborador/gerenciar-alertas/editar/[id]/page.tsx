"use client";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import EditarAlertaForm from "@/components/Formularios/EditarAlertaForm.tsx/EditarAlertaForm";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { alertaBody, estacaoBody, linhaBody, registrarAlertaBody } from "@/types/props";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function Alerta() {
    // ID que vem da URL
    const { id } = useParams();

    // Informações que serão buscadas da API
    const [alerta, setAlerta] = useState<alertaBody | null>(null);
    const [estacoes, setEstacoes] = useState<estacaoBody[]>([]);
    const [linhas, setLinhas] = useState<linhaBody[]>([]);

    // Informações úteis para exibição do pop-up
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
        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                // Função para buscar estações
                const fetchEstacoes = async () => {
                    setLoading(true);
                    try {
                        const res = await fetch(`${API_BASE}/estacao/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        if (res.ok) {
                            const data = await res.json();
                            setEstacoes(data.data);
                        } else {
                            setError(await res.text());
                        }
                    } catch {
                        setError("Erro de conexão com a API");
                    } finally {
                        setLoading(false);
                    }
                };
                // Função para buscar linhas
                const fetchLinhas = async () => {
                    try {
                        const res = await fetch(`${API_BASE}/linha/search`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        // Analisando a resposta
                        if (res.ok) {
                            const data = await res.json();
                            setLinhas(data.data);
                        } else {
                            setError(await res.text());
                        }
                    } catch {
                        setError("Erro de conexão com a API");
                    } finally {
                        setLoading(false);
                    }
                };

                fetchEstacoes();
                fetchLinhas();
            }
        }

        // Chamando a função
        validarToken();
    }, []);

    // Função que recebe cliques no formulário
    const onSubmit: SubmitHandler<registrarAlertaBody> = async (data) => {
        const corpojson = {
            nomeAlerta: data.nomeAlerta,
            descricaoAlerta: data.descricaoAlerta,
            nivelGravidade: data.nivelAlerta,
            idLinha: data.idLinha,
            idEstacao: data.idEstacao,
        };

        try {
            setLoading(true);
            // Enviando requisição para a API
            const res = await fetch(`${API_BASE}/alerta/${alerta?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpojson),
            });

            // Analisando a resposta
            if (res.ok) {
                showPopup("Alerta atualizado com sucesso!", "success");
                const updated = await fetch(`${API_BASE}/alerta/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });
                const updatedAlerta = await updated.json();
                setAlerta(updatedAlerta);
            } else {
                showPopup(`Erro ao atualizar alerta: ${res.status}`, "error");
            }
        } catch {
            showPopup("Erro de conexão com a API.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar alerta por ID
    useEffect(() => {
        async function buscarAlertaPorId() {
            setLoading(true);
            try {
                // Fazendo a requisição para a API
                const res = await fetch(`${API_BASE}/alerta/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });
                const data: alertaBody = await res.json();
                setAlerta(data);
            } catch {
                showPopup("Erro ao buscar o alerta para edição.", "error");
            } finally {
                setLoading(false);
            }
        }

        if (id) buscarAlertaPorId();
    }, [id]);

    // Exibe loading enquanto os dados são carregados
    if (loading) return <LoadingPage></LoadingPage>;

    // Exibe mensagem de erro se existir
    if (error) return <ErrorPage error={error}></ErrorPage>;

    return (
        <main className="page-layout px-4">
            {/* Pop-up que fica escondido até ser chamado */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
            {/* Título da página */}
            <PageTitle iconName="pen">{`Editando alerta #${alerta?.id}`}</PageTitle>
            <Link className="hover:underline text-xl" href={"/area-colaborador/gerenciar-alertas"}>
                <i className="fa-solid fa-arrow-left" /> Voltar gerenciar alertas
            </Link>

            {/* Formulário de edição */}

            <EditarAlertaForm alerta={alerta} estacoes={estacoes} linhas={linhas} onSubmit={onSubmit} />
        </main>
    );
}
