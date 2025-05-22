"use client";

import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { linhaBody } from "@/types/props";
import { useEffect, useState } from "react";

export default function Linhas() {
    // Estado para armazenar a lista de linhas (usado no <select>)
    const [linhas, setLinhas] = useState<linhaBody[]>([]);

    // Estado para armazenar os dados da linha selecionada
    const [linhaSelecionada, setLinhaSelecionada] = useState<linhaBody | null>(null);

    // Estado de carregamento
    const [loading, setLoading] = useState(false); // Indicador de carregamento
    // Erros do sistema
    const [erro, setErro] = useState<string | null>(null);

    // useEffect para buscar a lista de linhas na montagem da página
    useEffect(() => {
        const buscarLinhas = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE}/linha/search`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY,
                    },
                });
                if (res.ok) {
                    const json = await res.json();
                    setLinhas(json.data); // Armazena o array de linhas no estado
                } else {
                    setErro("Erro ao buscar linhas");
                }
            } catch (error) {
                console.error("Erro na requisição de linhas:", error);
            } finally {
                setLoading(false);
            }
        };
        buscarLinhas();
    }, []);

    // Função disparada ao selecionar uma linha no dropdown
    const handleSelecionarLinha = async (id: string) => {
        if (!id) {
            setLinhaSelecionada(null);
            return;
        }

        try {
            // Busca os detalhes completos da linha
            const resLinha = await fetch(`${API_BASE}/linha/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });
            if (resLinha.ok) {
                const dadosLinha = await resLinha.json();
                setLinhaSelecionada(dadosLinha); // Atualiza a linha selecionada
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes da linha:", error);
        }
    };

    // Exibe página de carregamento enquanto os dados são buscados
    if (loading) return <LoadingPage />;

    // Exibe página de erro, caso algo tenha dado errado
    if (erro) return <ErrorPage error={erro} />;

    return (
        <main className="page-layout">
            {/* Título da página */}
            <PageTitle iconName="road">Linhas</PageTitle>

            {/* Select das linhas */}
            <div className="w-2/3 min-w-84 md:max-w-[400px] flex justify-center">
                <select onChange={(e) => handleSelecionarLinha(e.target.value)} className="bg-slate-50 dark:bg-black border font-sans rounded-xl p-2 min-w-[95%] max-w-2xl" defaultValue="">
                    <option value="">Selecionar...</option>
                    {/* Mapenando as linhas que foram encontradas pela API e definindo o value do campo com o ID delas */}
                    {linhas.map((linha) => (
                        <option key={linha.id} value={linha.id}>
                            {linha.numeroLinha} - {linha.nomeLinha}
                        </option>
                    ))}
                </select>
            </div>

            <p className="text-lg md:text-xl text-center my-4 max-w-[90%]">Selecione uma linha carregar as informações</p>

            {/* Caixa de informações */}
            <div className="flex justify-center items-center flex-col gap-4 w-[90%] max-w-xl border p-6 rounded-xl shadow-lg mt-4 mx-auto">
                <p className="text-2xl font-bold">INFORMAÇÕES</p>

                {/* Nome da Linha */}
                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 flex justify-between px-4 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-950">Nome:</label>
                    <p className="px-8 rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold">{linhaSelecionada ? `${linhaSelecionada?.nomeLinha}` : "- - -"}</p>
                </div>

                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 flex justify-between px-4 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-900">Número:</label>
                    <p className="px-8 rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold">{linhaSelecionada ? `${linhaSelecionada?.numeroLinha}` : "- - -"}</p>
                </div>

                {/* Status da Linha */}
                <div className="drop-shadow-xl self-center w-full max-w-[90%] lg:max-w-2/3 py-2 flex justify-between px-4 bg-gray-300 rounded-2xl">
                    <label className="font-bold dark:text-gray-900">Status:</label>
                    {/* Mudando as cores de acordo com o status */}
                    <p
                        className={`px-8 rounded-xl font-bold ${
                            linhaSelecionada
                                ? linhaSelecionada.statusLinha === "NORMAL"
                                    ? "bg-green-400 text-green-900 dark:bg-green-600 dark:text-green-50"
                                    : linhaSelecionada.statusLinha === "PARCIAL"
                                    ? "bg-amber-300 text-amber-900 dark:bg-amber-500 dark:text-amber-50"
                                    : "bg-red-400 text-red-900 dark:bg-red-600 dark:text-red-50"
                                : "rounded-xl bg-gray-800 dark:bg-gray-950 text-gray-300 font-bold"
                        }`}
                    >
                        {linhaSelecionada?.statusLinha ?? "- - -"}
                    </p>
                </div>
            </div>
        </main>
    );
}
