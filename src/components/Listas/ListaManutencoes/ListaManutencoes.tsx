"use client";

import { manutencaoBody } from "@/types/props";
import Link from "next/link";

type ListaManutencoes = {
    manutencoes: manutencaoBody[];
    onExcluir: (id: string) => void;
};

export default function ListaEstacoes({ manutencoes, onExcluir }: ListaManutencoes) {
    return (
        <div className="h-full max-h-[520px] overflow-y-scroll flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">LISTA DE MANUTENÇÕES</p>
            {manutencoes.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm text-center">Nenhuma manutenção encontrada.</p>
            ) : (
                <ul className="w-full space-y-2">
                    {/* Fazendo o map das manutenções e exibindo na lista */}
                    {manutencoes.map((manutencao) => (
                        <li key={manutencao.id} className="w-full p-2 rounded-xl drop-shadow-lg border flex flex-col xl:flex-row justify-between items-start xl:items-center">
                            <div className="text-md font-medium dark:text-white truncate">
                                #{manutencao.id} {manutencao.nomeManutencao}
                            </div>
                            <div className="flex gap-2">
                                {/* Botão que faz a chamada da função de excluir linhas */}
                                <button onClick={() => onExcluir(manutencao.id)} className="hover:cursor-pointer px-4 py-1 text-sm rounded-lg bg-red-700 text-gray-200 font-bold hover:bg-red-800 transition">
                                    Excluir
                                </button>
                                {/* Link de redirect que envia para a página de editar */}
                                <Link href={`/area-colaborador/gerenciar-manutencoes/editar/${manutencao.id}`} className="px-4 py-1 text-sm rounded-lg bg-blue-800 text-gray-200 font-bold hover:bg-blue-900 transition">
                                    Editar
                                </Link>
                                {/* Link de redirect que envia para a página de detalhes da manutenção */}
                                <Link href={`/area-colaborador/gerenciar-manutencoes/detalhes/${manutencao.id}`} className="px-4 py-1 text-sm rounded-lg bg-green-700 text-gray-200 font-bold hover:bg-green-800 transition">
                                    Detalhes
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
