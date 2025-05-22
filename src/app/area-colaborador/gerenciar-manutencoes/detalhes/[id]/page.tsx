"use client";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { estacaoBody, linhaBody } from "@/types/props";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Informações para registrar manutenção
export interface manutencaoBody {
    id: string;
    nomeManutencao: string;
    descricaoManutencao: string;
    nivelPrioridade: string;
    idLinha: string;
    idEstacao: string;
}

export default function Manutencao() {
    // ID que vem da URL
    const { id } = useParams();

    // Informações que vem da API
    const [manutencao, setManutencao] = useState<manutencaoBody | null>(null);
    const [linha, setLinha] = useState<linhaBody | null>(null);
    const [estacao, setEstacao] = useState<estacaoBody | null>(null);

    // Estado de carregamento da página
    const [loading, setLoading] = useState(false);
    // Informações de erros
    const [error, setError] = useState<string | null>(null);

    // Mapeamento de nível de prioridade para estilos visuais
    const prioridadeMap: Record<string, { cor: string; texto: string }> = {
        BAIXA: { cor: "bg-green-400 text-green-900 dark:bg-green-600 dark:text-green-50", texto: "Baixa" },
        MÉDIA: { cor: "bg-amber-300 text-amber-900 dark:bg-amber-500 dark:text-amber-50", texto: "Média" },
        ALTA: { cor: "bg-red-400 text-red-900 dark:bg-red-600 dark:text-red-50", texto: "Alta" },
    };

    // Desestrutura as cores/texto com base na prioridade da manutenção
    const { cor, texto } = manutencao?.nivelPrioridade ? prioridadeMap[manutencao.nivelPrioridade.toUpperCase()] || { cor: "bg-gray-300", texto: "Indefinido" } : { cor: "bg-gray-300", texto: "Indefinido" };

    useEffect(() => {
        // Assim que a página é carregada busca por informações da manutenção por ID
        async function buscarManutencaoPorId() {
            setLoading(true);
            try {
                // Fazendo a requisição para a API
                const res = await fetch(`${API_BASE}/manutencao/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY,
                    },
                });

                // Tratando a resposta
                if (!res.ok) {
                    const erroTexto = await res.text();
                    setError(erroTexto || `Erro ao buscar manutenção. Código: ${res.status}`);
                    return;
                }
                const data: manutencaoBody = await res.json();
                setManutencao(data);
            } catch {
                setError("Erro de conexão com a API");
            } finally {
                setLoading(false);
            }
        }

        // Chamando a função
        if (id) buscarManutencaoPorId();
    }, [id]);

    useEffect(() => {
        // Assim que a página é carregada busca informações da linha e estação que estão relacionados à manutenção
        async function buscarLinhaEEstacao() {
            if (!manutencao) return;

            setLoading(true);
            try {
                // Buscando as duas informações na API
                const [linhaRes, estacaoRes] = await Promise.all([
                    fetch(`${API_BASE}/linha/${manutencao.idLinha}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-Key": API_KEY,
                        },
                    }),
                    fetch(`${API_BASE}/estacao/${manutencao.idEstacao}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-Key": API_KEY,
                        },
                    }),
                ]);

                // Tratando respostas e armazenando dados de linha
                if (linhaRes.ok) {
                    const linhaData: linhaBody = await linhaRes.json();
                    setLinha(linhaData);
                } else {
                    const erroTexto = await linhaRes.text();
                    setError(erroTexto || "Erro ao buscar linha.");
                }

                // Tratando respostas e armazenando dados de estação
                if (estacaoRes.ok) {
                    const estacaoData: estacaoBody = await estacaoRes.json();
                    setEstacao(estacaoData);
                } else {
                    const erroTexto = await estacaoRes.text();
                    setError(erroTexto || "Erro ao buscar estação.");
                }
            } catch {
                setError("Erro de conexão com a API");
            } finally {
                setLoading(false);
            }
        }

        // Validando a execução apenas caso os dois campos existam em manutenção
        if (manutencao?.idLinha && manutencao?.idEstacao) {
            buscarLinhaEEstacao();
        }
    }, [manutencao]);

    // Enquanto a página estiver carregando é exibido a página de carregamento
    if (loading) return <LoadingPage />;
    // Caso haja erros é retornada
    if (error) return <ErrorPage error={error} />;

    return (
        <main className="page-layout px-4">
            {/* Título da página */}
            <PageTitle iconName={"wrench"}>{`Manutenção #${manutencao?.id}`}</PageTitle>
            <Link className="hover:underline mb-2 text-xl" href="/area-colaborador/gerenciar-manutencoes">
                <i className="fa-solid fa-arrow-left" /> Voltar para gerenciamento
            </Link>

            {/* Div com informações sobre a manutenção */}
            <div className="w-full max-w-xl mx-auto flex flex-col">
                <div className="flex flex-col gap-4 border p-6 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-2xl font-bold text-justify underline">{manutencao?.nomeManutencao}</p>
                    </div>

                    {/* Nível de prioridade */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span>Nível de prioridade:</span>
                        <div className={`rounded-full px-4 py-1 text-sm ${cor} font-bold`}>{texto}</div>
                    </div>

                    {/* Descrição da manutenção */}
                    <div className="rounded-xl text-justify">
                        <span className="font-bold">Descrição:</span> {manutencao?.descricaoManutencao}
                    </div>

                    {/* Informações de linha e estação */}
                    <div className="flex flex-col gap-1">
                        <p>
                            <span className="font-bold">Linha:</span> {linha ? `(${linha.numeroLinha}) ${linha.nomeLinha}` : "Carregando..."}
                        </p>
                        <p>
                            <span className="font-bold">Estação:</span> {estacao ? `${estacao.nomeEstacao}` : "Carregando..."}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
