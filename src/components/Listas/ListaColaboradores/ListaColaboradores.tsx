"use client";

import Link from "next/link";
import { colaboradorBody } from "@/types/props";

type ListaColaboradoresProps = {
    colaboradores: colaboradorBody[];
    onExcluir: (id: string) => void;
};

export default function ListaColaboradores({ colaboradores, onExcluir }: ListaColaboradoresProps) {
    return (
        <div className="h-full max-h-[520px] overflow-y-scroll flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">LISTA DE COLABORADORES</p>

            {colaboradores.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm text-center">Nenhum colaborador encontrado.</p>
            ) : (
                <ul className="w-full space-y-2">
                    {/* w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none */}
                    {colaboradores.map((colab) => (
                        <li key={colab.id} className="w-full p-2 rounded-xl drop-shadow-lg border flex flex-col xl:flex-row justify-between items-start xl:items-center">
                            <div className="text-md font-medium dark:text-white truncate">
                                #{colab.id} {colab.nomeColaborador} - <span className="text-sm">{colab.tipoColaborador}</span>
                            </div>
                            <div className="flex gap-2 self-end">
                                {/* Botão que chama a função para excluir */}
                                <button onClick={() => onExcluir(colab.id)} className="hover:cursor-pointer px-4 p-1 text-sm rounded-lg bg-red-700 text-gray-200 font-bold hover:bg-red-800 transition">
                                    Excluir
                                </button>
                                {/* Botão que faz redirect para a página de edição */}
                                <Link href={`/area-colaborador/gerenciar-colaboradores/editar/${colab.id}`} className="px-4 py-1 text-sm rounded-lg bg-blue-800 text-gray-200 font-bold hover:bg-blue-900 transition">
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
