"use client";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { alertaBody, estacaoBody, linhaBody } from "@/types/props";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Alerta() {
    // ID que vem da URL
    const { id } = useParams();

    // Informações que vem da API
    const [alerta, setAlerta] = useState<alertaBody | null>(null);
    const [linha, setLinha] = useState<linhaBody | null>(null);
    const [estacao, setEstacao] = useState<estacaoBody | null>(null);

    // Estado de carreamento da página
    const [loading, setLoading] = useState(false);
    // Informações de erros
    const [error, setError] = useState<string | null>(null);

    // Mapeamento de nível de gravidade para estilos visuais
    const gravidadeMap: Record<string, { cor: string; texto: string }> = {
        LEVE: { cor: "bg-emerald-300 dark:bg-emerald-500", texto: "Leve" },
        MÉDIO: { cor: "bg-amber-300 dark:bg-yellow-500", texto: "Médio" },
        GRAVE: { cor: "bg-red-300 dark:bg-red-500", texto: "Grave" },
    };

    // Desestrutura as cores/texto com base na gravidade do alerta
    const { cor, texto } = alerta?.nivelGravidade ? gravidadeMap[alerta.nivelGravidade.toUpperCase()] || { cor: "bg-gray-300", texto: "Indefinido" } : { cor: "bg-gray-300", texto: "Indefinido" };

    // Formata uma data em formato ISO para o que estamos acostumados a ler
    function formatarData(dataISO: string): string {
        const data = new Date(dataISO);
        return data.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    useEffect(() => {
        // Assim que a página é carregada busca por informações do alerta por ID
        async function buscarAlertaPorId() {
            setLoading(true);
            try {
                // Fazendo a requisição para a API
                const res = await fetch(`${API_BASE}/alerta/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": API_KEY,
                    },
                });

                // Tratando a resposta
                if (!res.ok) {
                    const erroTexto = await res.text();
                    setError(erroTexto || `Erro ao buscar alerta. Código: ${res.status}`);
                    return;
                }
                const data: alertaBody = await res.json();
                setAlerta(data);
            } catch {
                setError("Erro de conexão com a API");
            } finally {
                setLoading(false);
            }
        }

        if (id) buscarAlertaPorId();
    }, [id]);

    useEffect(() => {
        // Assim que a página é carregada busca informações da linha e estação que estão relacionados ao alerta
        async function buscarLinhaEEstacao() {
            if (!alerta) return;

            setLoading(true);
            try {
                // Buscando as duas informações na API
                const [linhaRes, estacaoRes] = await Promise.all([
                    fetch(`${API_BASE}/linha/${alerta.idLinha}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-Key": API_KEY,
                        },
                    }),
                    fetch(`${API_BASE}/estacao/${alerta.idEstacao}`, {
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

                // Tratando respostas e armazenando dados de linha
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

        // Validando a execução apenas caso os dois campos existam em alerta
        if (alerta?.idLinha && alerta?.idEstacao) {
            buscarLinhaEEstacao();
        }
    }, [alerta]);

    // Enquanto a página estiver carregando é exibido a página de carregamento
    if (loading) return <LoadingPage />;
    // Caso haja erros é retornada
    if (error) return <ErrorPage error={error} />;

    return (
        <main className="page-layout px-4">
            {/* Título da página */}
            <PageTitle iconName={"info-circle"}>{`Alerta #${alerta?.id}`}</PageTitle>
            <Link className="hover:underline mb-2 text-xl" href="/alertas">
                <i className="fa-solid fa-arrow-left" /> Voltar para página de alertas
            </Link>

            {/* Div com informações sobre o alerta */}
            <div className="w-full max-w-xl mx-auto flex flex-col">
                <div className="flex flex-col gap-4 border p-6 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-2xl font-semibold text-justify underline">{alerta?.nomeAlerta}</p>
                    </div>

                    {/* Nível de gravidade */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span>Nível de gravidade:</span>
                        <div className={`rounded-full px-4 py-1 text-sm ${cor} text-bold`}>{texto}</div>
                    </div>

                    {/* Descrição do alerta */}
                    <div className="rounded-xl text-justify">
                        <span className="font-bold">Descrição:</span> {alerta?.descricaoAlerta}
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

                    {/* Data de criação do alerta */}
                    <div className="text-gray-500 flex items-center mt-2">
                        <i className="fa-solid fa-calendar-days mr-1" />
                        <p>{alerta?.dataCriacao ? `Alerta registrado em: ${formatarData(alerta.dataCriacao)}` : "Data não disponível"}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
