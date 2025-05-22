"use client";

import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import EditarColaboradorForm from "@/components/Formularios/EditarColaboradorForm/EditarColaboradorForm";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { colaboradorBody, registrarColaboradorBody } from "@/types/props";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function EditarColaborador() {
    const { id } = useParams();
    const [colaborador, setColaborador] = useState<colaboradorBody | null>(null);

    // Estados para exibição do pop-up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estado de carregamento da página
    const [loading, setLoading] = useState<boolean>(false);
    // Estado de erro da página
    const [error, setError] = useState<string | null>(null);

    // Exibe o pop-up com a mensagem e tipo de status
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    // Carrega os dados do colaborador ao montar o componente ou mudar o ID
    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                async function fetchColaborador() {
                    try {
                        const res = await fetch(`${API_BASE}/colaborador/${id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": API_KEY,
                            },
                        });

                        // Analisando resposta da API
                        if (res.ok) {
                            const data: colaboradorBody = await res.json();
                            setColaborador(data);
                        } else {
                            const erroTexto = await res.text();
                            setError(erroTexto);
                        }
                    } catch {
                        showPopup("Erro ao carregar colaborador.", "error");
                    } finally {
                        setLoading(false);
                    }
                }
                if (id) fetchColaborador();
            }
        }
        validarToken();
    }, [id]);

    // Submete o formulário de edição
    const onSubmit: SubmitHandler<Omit<registrarColaboradorBody, "autenticaColaborador">> = async (data) => {
        // Corpo que será enviado para a API
        const corpojson = {
            nomeColaborador: data.nomeColaborador,
            tipoColaborador: data.tipoColaborador,
        };

        try {
            setLoading(true);
            // Fazendo a requisição para a API
            const res = await fetch(`${API_BASE}/colaborador/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpojson),
            });

            // Analisando a resposta
            if (res.ok) {
                showPopup("Colaborador atualizado com sucesso!", "success");

                // Atualiza os dados no estado local para refletir no título e possíveis dependentes
                setColaborador((prev) => (prev ? { ...prev, ...corpojson } : null));
            } else {
                showPopup(`Erro ao atualizar colaborador: ${res.status}`, "error");
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
        <main className="page-layout px-4">
            {/* Pop-up de feedback */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            {/* Título dinâmico com o ID do colaborador */}
            <PageTitle iconName="pen">{`Editando colaborador #${colaborador?.id}`}</PageTitle>

            {/* Link para retornar à listagem */}
            <Link className="hover:underline text-xl" href="/area-colaborador/gerenciar-colaboradores">
                <i className="fa-solid fa-arrow-left" /> Voltar para gerenciamento
            </Link>

            {/* Formulário de edição */}
            <EditarColaboradorForm onSubmit={onSubmit} colaborador={colaborador} />
        </main>
    );
}
