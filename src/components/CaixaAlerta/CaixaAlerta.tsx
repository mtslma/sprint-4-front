import { alertaBody } from "@/types/props";
import Link from "next/link";

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

// Exibe o nome, descrição, data e gravidade do alerta.
export function CaixaAlerta({ id, nomeAlerta, descricaoAlerta, dataCriacao, nivelGravidade }: alertaBody) {
    // Mapeamento de nível de gravidade para estilos visuais
    const gravidadeMap: Record<string, { cor: string; texto: string }> = {
        LEVE: { cor: "bg-green-400 text-green-900 dark:bg-green-600 dark:text-green-50", texto: "Leve" },
        MÉDIO: { cor: "bg-amber-300 text-amber-900 dark:bg-amber-500 dark:text-amber-50", texto: "Médio" },
        GRAVE: { cor: "bg-red-400 text-red-900 dark:bg-red-600 dark:text-red-50", texto: "Grave" },
    };

    // Desestrutura as cores/texto com base na gravidade do alerta
    const { cor: corDaGravidade, texto: textoGravidade } = gravidadeMap[nivelGravidade.toUpperCase()] || {
        cor: "bg-gray-800 text-gray-300 dark:bg-gray-950",
        texto: "- - -",
    };

    return (
        <Link href={`/alertas/${id}`} className="group w-[340px] p-6 shadow-lg rounded-xl border hover:bg-gray-200 hover:dark:bg-slate-950">
            <div className="flex justify-between items-center mb-2">
                {/* Nome do alerta (limitado para não estourar layout) */}
                <h2 className="font-semibold text-xl text-left truncate max-w-[200px] group-hover:underline">{nomeAlerta}</h2>

                {/* Gravidade do alerta com fundo colorido */}
                <p className={`${corDaGravidade} text-center rounded-full min-w-1/4 px-4 font-bold text-gray-900`}>{textoGravidade}</p>
            </div>

            <div className="relative flex items-center justify-between gap-2">
                {/* Descrição visível apenas quando o mouse não está em cima */}
                <p className="max-w-[120px] overflow-hidden whitespace-nowrap text-ellipsis group-hover:opacity-0 group-hover:invisible transition-opacity duration-300">{descricaoAlerta}</p>

                {/* Texto "Ver detalhes" aparece sobreposto ao passar o mouse */}
                <p className="absolute inset-0 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transform transition-all duration-300 text-red-700">Ver detalhes</p>

                {/* Data formatada */}
                <p className="min-w-[110px] text-gray-500 text-end">
                    <i className="fa-solid fa-calendar-days" /> {formatarData(dataCriacao)}
                </p>
            </div>
        </Link>
    );
}
