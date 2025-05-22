"use client";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import EditarLinhaForm from "@/components/Formularios/EditarLinhaForm/EditarLinhaForm";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { linhaBody } from "@/types/props";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function EditarLinha() {
    // Informações que vem da URL
    const { id } = useParams();
    // Informações da linha que será buscada
    const [linha, setLinha] = useState<linhaBody | null>(null);
    // Informações úteis para o pop-up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    // Estado de carregameno da página
    const [loading, setLoading] = useState<boolean>(false);
    // Erros da página
    const [error, setError] = useState<string | null>(null);

    // Ao carregar a página bsuca as informações da linha que serão usadas como default no formulário
    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                const fetchLinha = async () => {
                    setLoading(true);
                    try {
                        // Fazendo a busca na API
                        const res = await fetch(`${API_BASE}/linha/${id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        // Analisando a resposta da API
                        if (!res.ok) throw new Error("Erro ao carregar os dados da linha.");
                        const data = await res.json();
                        setLinha(data);
                    } catch (err) {
                        setError(err instanceof Error ? err.message : "Erro desconhecido.");
                    } finally {
                        setLoading(false);
                    }
                };

                // Chamando a função
                fetchLinha();
            }
        }
        validarToken();
    }, [id]);

    // Função de exibição do pop-up
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    const onSubmit: SubmitHandler<linhaBody> = async (data) => {
        try {
            setLoading(true);
            // Enviando a requisição de atualização para a API
            const res = await fetch(`${API_BASE}/linha/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                showPopup("Linha atualizada com sucesso.", "success");
                // Atualiza o estado local assim ele também atualiza os dados no formulário de atualização
                setLinha(data);
            } else {
                const erroTexto = await res.json();
                setError(erroTexto);
            }
        } catch {
            showPopup("Erro de conexão com a API.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Enquanto a página está carregando exibe esse status
    if (loading) return <LoadingPage />;
    // Mensagem de erro caso haja algum
    if (error) return <ErrorPage error={error} />;

    return (
        <main className="flex flex-col items-center h-full p-4">
            {/* Pop up que fica escondido até ser chamado */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
            {/* Título da página */}
            <PageTitle iconName="train-subway">{`Editar Linha #${id}`}</PageTitle>

            {/* Link para voltar para tela de gerenciamento */}
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/gerenciar-linhas">
                <i className="fa-solid fa-arrow-left" /> Voltar para gerenciamento de linhas
            </Link>

            {/* Chamando o formulário para editar linhas */}
            <EditarLinhaForm linha={linha} onSubmit={onSubmit} />
        </main>
    );
}
