"use client";

import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle"; // Componente de título reutilizável com ícone
import { API_BASE, API_KEY } from "@/services/config";
import { estacaoBody, linhaBody } from "@/types/props"; // Tipagens para garantir estrutura dos dados
import { useEffect, useState } from "react";

export default function Estacoes() {
    // Estado para armazenar a lista de estações (usado no <select>)
    const [estacoes, setEstacoes] = useState<estacaoBody[]>([]);

    // Estado para armazenar os dados da estação selecionada
    const [estacaoSelecionada, setEstacaoSelecionada] = useState<estacaoBody | null>(null);

    // Estado separado para armazenar todos os dados da linha correspondente
    const [linha, setLinha] = useState<linhaBody | null>(null);

    // Estado de carregamento
    const [loading, setLoading] = useState(false); // Indicador de carregamento
    // Erros do sistema
    const [erro, setErro] = useState<string | null>(null);

    // useEffect para buscar a lista de estações na montagem da página
    useEffect(() => {
        const buscarEstacoes = async () => {
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
                    const json = await res.json();
                    setEstacoes(json.data); // Armazena o array de estações no estado
                } else {
                    setErro(await res.text());
                }
            } catch (error) {
                console.error("Erro na requisição de estações:", error);
            } finally {
                setLoading(false);
            }
        };
        buscarEstacoes();
    }, []);

    // Função disparada ao selecionar uma estação no dropdown
    const handleSelecionarEstacao = async (id: string) => {
        if (!id) {
            setEstacaoSelecionada(null);
            setLinha(null);
            return;
        }

        try {
            // Busca os detalhes completos da estação
            const resEstacao = await fetch(`${API_BASE}/estacao/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            if (resEstacao.ok) {
                const dadosEstacao = await resEstacao.json();
                setEstacaoSelecionada(dadosEstacao); // Atualiza a estação selecionada
                // Em seguida, busca a linha associada a essa estação
                const resLinha = await fetch(`${API_BASE}/linha/${dadosEstacao.idLinha}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });
                if (resLinha.ok) {
                    const dadosLinha = await resLinha.json();
                    setLinha(dadosLinha); // Armazena o objeto completo da linha
                } else {
                    setErro(await resLinha.text());
                }
            } else {
                setErro(await resEstacao.text());
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes da estação/linha:", error);
        }
    };

    // Exibe página de carregamento enquanto os dados são buscados
    if (loading) return <LoadingPage />;

    // Exibe página de erro, caso algo tenha dado errado
    if (erro) return <ErrorPage error={erro} />;

    return (
        <main className="page-layout">
            {/* Título da página */}
            <PageTitle iconName="sign-hanging">Estações</PageTitle>

            {/* Select das estações */}
            <div className="w-2/3 min-w-84 md:max-w-[400px] flex justify-center">
                <select onChange={(e) => handleSelecionarEstacao(e.target.value)} className="bg-slate-50 dark:bg-black border font-sans rounded-xl p-2 min-w-[95%] max-w-2xl" defaultValue="">
                    <option value="">Selecionar...</option>
                    {estacoes.map((estacao) => (
                        <option key={estacao.id} value={estacao.id}>
                            {estacao.nomeEstacao}
                        </option>
                    ))}
                </select>
            </div>

            <p className="text-lg md:text-xl text-center my-4 max-w-[90%]">Selecione uma estação para carregar as informações</p>

            {/* Caixa de informações da estação */}
            {/* Caixa de informações */}
            <div className="flex justify-center items-center flex-col gap-4 w-[90%] max-w-xl border p-6 rounded-xl shadow-lg mt-4 mx-auto">
                <p className="text-2xl font-bold">INFORMAÇÕES</p>

                {/* Nome da Estação */}
                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 px-4 flex justify-between gap-2 md:gap-0 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-950">Estação:</label>
                    <p className="px-2 md:px-8 text-center rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold">{estacaoSelecionada ? estacaoSelecionada.nomeEstacao : "- - -"}</p>
                </div>

                {/* Status da Estação */}
                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 flex justify-between px-4 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-900">Status:</label>
                    <p
                        className={`px-2 md:px-8  rounded-xl font-bold ${
                            estacaoSelecionada
                                ? estacaoSelecionada.statusEstacao === "NORMAL"
                                    ? "bg-green-400 text-green-900 dark:bg-green-600 dark:text-green-50"
                                    : estacaoSelecionada.statusEstacao === "PARCIAL"
                                    ? "bg-amber-300 text-amber-900 dark:bg-amber-500 dark:text-amber-50"
                                    : "bg-red-400 text-red-900 dark:bg-red-600 dark:text-red-50"
                                : "rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold"
                        }`}
                    >
                        {estacaoSelecionada?.statusEstacao ?? "- - -"}
                    </p>
                </div>

                {/* Início de Operação */}
                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 flex justify-between items-center  px-4 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-950">Início operação:</label>
                    <p className="px-2 md:px-8 rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold">{estacaoSelecionada ? estacaoSelecionada.inicioOperacao : "- - -"}</p>
                </div>

                {/* Fim de Operação */}
                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 flex justify-between items-center px-4 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-950">Fim operação:</label>
                    <p className="px-2 md:px-8 text-center rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold">{estacaoSelecionada ? estacaoSelecionada.fimOperacao : "- - -"}</p>
                </div>

                {/* Linha Associada */}
                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 flex justify-between px-4 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-950">Linha:</label>
                    <p className="px-2 md:px-8 rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold">{linha ? `${linha.numeroLinha} - ${linha.nomeLinha}` : "- - -"}</p>
                </div>
            </div>
        </main>
    );
}
