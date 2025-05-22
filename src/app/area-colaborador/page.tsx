"use client";

import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { CaixaRedirecionamento } from "@/components/CaixaRedirecionamento/CaixaRedirecionamento";
import { colaboradorBody, sessaoBody } from "@/types/props";
import { useEffect, useState } from "react";
import { API_BASE, API_KEY } from "@/services/config";

export default function AreaColaborador() {
    // Estado para armazenar as informações do colaborador
    const [colaboradorInfo, setColaboradorInfo] = useState<colaboradorBody | null>(null);
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState("");

    async function buscarSessao(token: string): Promise<sessaoBody | null> {
        try {
            const response = await fetch(`${API_BASE}/sessao/${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Analisando a reposta da API
            if (!response.ok) {
                const mensagemErro = await response.text();
                setError(mensagemErro || "Erro ao validar sessão.");
                return null;
            }

            // Guardando as informações da sessão
            const sessaoData = await response.json();

            // Verifique se a resposta tem a estrutura esperada
            if (!sessaoData || !sessaoData.colaboradorResponseDto) {
                setError("Dados de colaborador não encontrados.");
                return null;
            }

            return sessaoData;
        } catch {
            setError("Erro de conexão com a API.");

            return null;
        }
    }

    // Efeito que roda uma única vez ao carregar a página
    useEffect(() => {
        async function carregarInformacoes() {
            const token = await localStorage.getItem("session-token");

            // Caso ele encontre um token salvo no localStorage ele vai validar o mesmo na API para redirecionar automaticamente
            if (!token) {
                window.location.href = "/";
                return;
            } else {
                // Buscando a sesssão na API
                const sessao = await buscarSessao(token);

                if (sessao) {
                    // Informações do colaborador
                    const colaborador = sessao.colaboradorResponseDto; // Corrigido para colaboradorResponseDto

                    // Verifique se o colaborador existe antes de tentar acessar suas propriedades
                    if (colaborador && colaborador.id) {
                        // Salvar o estado para uso
                        await setColaboradorInfo({
                            id: colaborador.id,
                            nomeColaborador: colaborador.nomeColaborador,
                            tipoColaborador: colaborador.tipoColaborador,
                            dataCriacao: colaborador.dataCriacao,
                        });
                    } else {
                        setError("Informações do colaborador não estão completas.");
                    }
                }
            }
        }
        // Chamando a função
        carregarInformacoes();
    }, []);

    // Função para fazer logout do usuário
    function fazerLogout() {
        const token = localStorage.getItem("session-token");

        if (token) {
            // Requisição para API para invalidar a sessão
            fetch(`${API_BASE}/sessao/logout`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify({ tokenSessao: token }),
            })
                .then((response) => {
                    if (response.ok) {
                        // Remove dados de autenticação do localStorage
                        localStorage.removeItem("session-token");
                        // Redireciona para página de login
                        window.location.href = "/login";
                    } else {
                        console.error("Erro ao finalizar sessão.");
                    }
                })
                .catch((error) => {
                    console.error("Erro de conexão", error);
                });
        }
    }

    // Exibe mensagem de erro se existir
    if (error) return <ErrorPage error={error}></ErrorPage>;

    // Exibe loading enquanto os dados são carregados
    if (!colaboradorInfo) return <LoadingPage></LoadingPage>;

    // Renderização principal da página
    return (
        <main className="flex flex-col items-center mt-4 w-full h-full mb-4">
            {/* Componente de título da página */}
            <PageTitle iconName={"user-tie"}>Colaborador</PageTitle>

            {/* Saudação personalizada com nome do colaborador */}
            <h2 className="text-xl md:text-2xl font-bold">
                Bem vindo, <span className="text-red-700">{colaboradorInfo.nomeColaborador}</span>
            </h2>
            {/* Componentes de redirecionamento para as funcionalidades do sistema */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Redirect para a página de registro de alertas */}
                <CaixaRedirecionamento titulo={"Registrar alerta"} iconName={"plus"} href={"/area-colaborador/registrar-alerta"} />

                {/* Redirect para a página de gerenciar alertas */}
                <CaixaRedirecionamento titulo={"Gerenciar alertas"} iconName={"list"} href={"/area-colaborador/gerenciar-alertas"} />

                {/* Redirect para a página de manutenções */}
                <CaixaRedirecionamento titulo={"Gerenciar manutenções"} iconName={"tools"} href={"/area-colaborador/gerenciar-manutencoes"} />

                {/* Redirect para a página de mensagens de contato */}
                <CaixaRedirecionamento titulo={"Ver mensagens contato"} iconName={"envelope"} href={"/area-colaborador/mensagens-contato"} />

                {/* Redirect para a página de atualizar status de serviços */}
                <CaixaRedirecionamento titulo={"Atualizar status de serviços"} iconName={"pencil"} href={"/area-colaborador/atualizar-status"} />
            </div>

            {/* Funcionalidades visíveis apenas para administradores */}
            <div className="flex flex-col mt-8 gap-2">
                {colaboradorInfo.tipoColaborador == "ADMIN" ? (
                    <>
                        <p className="font-bold">Operações de administrador</p>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            <CaixaRedirecionamento titulo={"Gerenciar colaboradores"} iconName={"user-lock"} href={"/area-colaborador/gerenciar-colaboradores"} />
                            <CaixaRedirecionamento titulo={"Gerenciar linhas"} iconName={"location-pin-lock"} href={"/area-colaborador/gerenciar-linhas"} />
                            <CaixaRedirecionamento titulo={"Gerenciar estações"} iconName={"house-lock"} href={"/area-colaborador/gerenciar-estacoes"} />
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>

            {/* Botão de logout. chama a função logout */}
            <button className="group my-4 flex items-center gap-4 group px-4 py-1 rounded-xl bg-gray-200 dark:bg-gray-700" onClick={fazerLogout}>
                <i className="size-4 fa-solid fa-arrow-left group-hover:text-red-700"></i>
                <span className="group-hover:underline group-hover:cursor-pointer font-bold">Sair da conta</span>
            </button>
        </main>
    );
}
