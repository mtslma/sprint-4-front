"use client";

import Link from "next/link";
import { linhaBody } from "@/types/props";

type ListaLinhas = {
    linhas: linhaBody[];
    onExcluir: (id: string) => void;
};

export default function ListaEstacoes({ linhas, onExcluir }: ListaLinhas) {
    return (
        <div className="h-full max-h-[520px] overflow-y-scroll flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">LISTA DE LINHAS</p>
            {linhas.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm text-center">Nenhuma linha cadastrada.</p>
            ) : (
                <ul className="w-full space-y-2">
                    {linhas.map((linha) => (
                        <li key={linha.id} className="w-full p-2 rounded-xl drop-shadow-lg border flex flex-col xl:flex-row justify-between items-start xl:items-center">
                            <div className="text-md font-medium dark:text-white">
                                #{linha.numeroLinha} {linha.nomeLinha}
                            </div>
                            <div className="flex gap-2 self-end">
                                <button onClick={() => onExcluir(linha.id)} className="hover:cursor-pointer px-4 p-1 text-sm rounded-lg bg-red-700 text-gray-200 font-bold hover:bg-red-800 transition">
                                    Excluir
                                </button>
                                <Link href={`/area-colaborador/gerenciar-linhas/editar/${linha.id}`} className="px-4 py-1 text-sm rounded-lg bg-blue-800 text-gray-200 font-bold hover:bg-blue-900 transition">
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
