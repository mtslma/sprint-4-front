"use client";

import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import RegistrarLinhaForm from "@/components/Formularios/RegistrarLinhaForm/RegistrarLinhaForm";
import ListaLinhas from "@/components/Listas/ListaLinhas/ListaLinhas";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { linhaBody } from "@/types/props";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function GerenciarLinhas() {
    // Guarda as linhas buscadas
    const [linhas, setLinhas] = useState<linhaBody[]>([]);

    // Informações usadas para exibição do pop-up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estado de carregamento da página
    const [loading, setLoading] = useState(true);
    // Erros da página
    const [error, setError] = useState<string | null>(null);

    // Função para buscar colaboradores
    const fetchLinhas = useCallback(async () => {
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
                setLinhas(data.data); // Guarda as informações encontradas no state de estações
            } else {
                setError(await res.text()); // Pega o erro da API e salva
            }
        } catch {
            showPopup("Erro ao carregar estações", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // Quando a página é carregada chama a função fetchLinhas()
    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                fetchLinhas();
            }
        }

        // Chamando a função
        validarToken();
    }, [fetchLinhas]);

    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    // Função para excluir linhas
    async function excluirLinha(id: string) {
        try {
            // Envia uma requisição DELETE para a API passando o ID da linha que será deletada
            const res = await fetch(`${API_BASE}/linha/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Validando resposta do método
            if (res.ok) {
                setLinhas((prev) => prev.filter((linha) => linha.id !== id));
                showPopup("Linhas excluída com sucesso.", "success");
            } else {
                const erroTexto = await res.text();
                showPopup(erroTexto || "Erro ao excluir linha", "error");
            }
        } catch {
            showPopup("Erro ao excluir linha.", "error");
        }
    }

    // Função que recebe os cliques do formulário de registrar colaborador
    const onSubmit: SubmitHandler<linhaBody> = async (data) => {
        try {
            // Enviando requisição para a API pelo método POST
            const res = await fetch(`${API_BASE}/linha`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(data), // Preparando o corpo que será enviado
            });

            // Validando resposta do método
            if (res.ok) {
                showPopup("Linha registrada com sucesso.", "success");
                fetchLinhas(); // recaregando a lista par aexibir o que foi criado
            } else {
                showPopup(`Erro ao registrar linha: ${res.status}`, "error");
            }
        } catch {
            showPopup("Erro de conexão com a API.", "error");
        }
    };

    // Enquanto a página está carregando
    if (loading) return <LoadingPage />;

    // Em caso de erro essa será a página exibida
    if (error) return <ErrorPage error={error} />;

    return (
        <div className="flex flex-col items-center mt-4 w-full h-full mb-4">
            {/* Pop-up que fica escondido */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            {/* Título da página */}
            <PageTitle iconName="train-subway">Gerenciar Linhas</PageTitle>

            {/* Link para volta para a área do colaborador */}
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/">
                <i className="fa-solid fa-arrow-left" /> Voltar para área do colaborador
            </Link>

            <div className="flex flex-col md:flex-row items-start md:justify-center gap-8 mt-8 w-full px-4">
                {/* Lista de Linhas */}
                <ListaLinhas linhas={linhas} onExcluir={excluirLinha}></ListaLinhas>

                {/* Formulário de Cadastro */}
                <RegistrarLinhaForm onSubmit={onSubmit}></RegistrarLinhaForm>
            </div>
        </div>
    );
}
