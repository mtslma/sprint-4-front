"use client";

import Link from "next/link";
import { estacaoBody } from "@/types/props";

type ListaEstacoes = {
    estacoes: estacaoBody[];
    onExcluir: (id: string) => void;
};

export default function ListaEstacoes({ estacoes, onExcluir }: ListaEstacoes) {
    return (
        <div className="h-full max-h-[520px] overflow-y-scroll flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">LISTA DE ESTAÇÕES</p>
            {estacoes.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm text-center">Nenhuma estação encontrada.</p>
            ) : (
                <ul className="w-full space-y-2">
                    {/* Fazendo o map das estações e exibindo na lista */}
                    {estacoes.map((estacao) => (
                        <li key={estacao.id} className="w-full p-2 rounded-xl drop-shadow-lg border flex flex-col xl:flex-row justify-between items-start xl:items-center">
                            <div className="text-md flex items-center gap-2 font-medium dark:text-white truncate">
                                <div className={`w-4 h-4 rounded-full ${estacao.statusEstacao === "NORMAL" ? "bg-green-500" : estacao.statusEstacao === "PARCIAL" ? "bg-yellow-500" : "bg-red-500"}`} title={estacao.statusEstacao}></div>#{estacao.id} {estacao.nomeEstacao}
                            </div>

                            {/* Botões */}
                            <div className="flex gap-2 self-end">
                                {/* Botão que chama a função para excluir */}
                                <button onClick={() => onExcluir(estacao.id)} className="hover:cursor-pointer px-4 p-1 text-sm rounded-lg bg-red-700 text-gray-200 font-bold hover:bg-red-800 transition">
                                    Excluir
                                </button>
                                {/* Botão que faz redirect para a página de edição */}
                                <Link href={`/area-colaborador/gerenciar-estacoes/editar/${estacao.id}`} className="px-4 py-1 text-sm rounded-lg bg-blue-800 text-gray-200 font-bold hover:bg-blue-900 transition">
                                    Editar
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
