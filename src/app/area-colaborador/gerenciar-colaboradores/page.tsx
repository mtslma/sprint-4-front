"use client";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import RegistrarColaboradorForm from "@/components/Formularios/RegistrarColaboradorForm/RegistrarColaboradorForm";
import ListaColaboradores from "@/components/Listas/ListaColaboradores/ListaColaboradores";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { colaboradorBody, registrarColaboradorBody } from "@/types/props";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export default function GerenciarColaboradores() {
    // Onde ficam armazenados os colaboradores buscados
    const [colaboradores, setColaboradores] = useState<colaboradorBody[]>([]);

    // Informações para exibição dos pop-ups
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Estado de carregamento da página
    const [loading, setLoading] = useState(false);
    // Armazena os erros da página
    const [error, setError] = useState<string | null>(null);

    // Função para exibir o pop-up
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000);
    };

    // Função para buscar colaboradores
    const fetchColaboradores = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/colaborador/search`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setColaboradores(data.data); // Guarda as informações encontradas no state de estações
            } else {
                setError(await res.text()); // Pega o erro da API e salva
            }
        } catch {
            showPopup("Erro ao carregar estações", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    // Quando a página é carregada chama a função fetchColaboradores()
    useEffect(() => {
        setLoading(true);

        async function validarToken() {
            const token = await localStorage.getItem("session-token");

            // Se não encontrar token, redireciona para a tela inicial
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                // Se o token for validado ele busca os colaboradores
                fetchColaboradores();
            }
        }
        validarToken();
    }, [fetchColaboradores]);

    // Função para excluir colaboradores
    async function excluirColaborador(id: string) {
        try {
            // Envia uma requisição DELETE para a API passando o ID do colaborador que será deletado
            const res = await fetch(`${API_BASE}/colaborador/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Validando resposta do método
            if (res.ok) {
                setColaboradores((prev) => prev.filter((colab) => colab.id !== id));
                showPopup("Colaborador excluído com sucesso.", "success");
            } else {
                const erroTexto = await res.text();
                showPopup(erroTexto || "Erro ao excluir colaborador", "error");
            }
        } catch {
            showPopup("Erro ao excluir colaborador.", "error");
        }
    }

    // Função que recebe os cliques do formulário de registrar colaborador
    const onSubmit: SubmitHandler<registrarColaboradorBody> = async (data) => {
        // Preparando o corpo que será enviado
        const corpojson = {
            nomeColaborador: data.nomeColaborador,
            tipoColaborador: data.tipoColaborador,
            autenticaColaborador: {
                email: data.autenticaColaborador.email,
                senha: data.autenticaColaborador.senha,
            },
        };

        try {
            // Enviando requisição para a API pelo método POST passando o corpo que foi criado
            const res = await fetch(`${API_BASE}/colaborador`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(corpojson),
            });

            // Validando resposta do método
            if (res.ok) {
                showPopup("Colaborador registrado com sucesso.", "success");
                fetchColaboradores(); // chamando a função que atualiza a lista de colaboradores
            } else {
                const erroTexto = await res.text();
                showPopup(erroTexto || "Erro ao excluir colaborador", "error");
            }
        } catch (error) {
            showPopup(`Erro inesperado: ${String(error)}`, "error");
        }
    };

    // Exibindo tela de carregamento
    // Se for true ele vai retornar a página de loading
    if (loading) return <LoadingPage></LoadingPage>;
    // Exibindo tela de erro
    if (error) return <ErrorPage error={error}></ErrorPage>;

    return (
        <div className="flex flex-col items-center mt-4 w-full h-full mb-4">
            {/* Pop-up que fica escondido até chegar a hora de aparecer */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            {/* Título da página */}
            <PageTitle iconName="users">Gerenciar Colaboradores</PageTitle>

            {/* Link de redirecionamento da página */}
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/">
                <i className="fa-solid fa-arrow-left" /> Voltar para área do colaborador
            </Link>

            {/* Essa div ajusta a disposição dos itens na tela, em mobile fica vertical, a partir de md: fica horizontal */}
            <div className="flex flex-col md:flex-row items-start md:justify-center gap-8 mt-8 w-full px-4">
                {/* Chamando a lista de colaboradores e passando a função de excluir que ela utiliza */}
                <ListaColaboradores colaboradores={colaboradores} onExcluir={excluirColaborador} />

                {/* Chamando o formulário de registro de colaborador */}
                <RegistrarColaboradorForm onSubmit={onSubmit} />
            </div>
        </div>
    );
}
