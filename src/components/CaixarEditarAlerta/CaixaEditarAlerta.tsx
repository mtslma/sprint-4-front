import { alertaBody } from "@/types/props";
import Link from "next/link";

// Função para formatar uma data em formato ISO para o padrão brasileiro
function formatarData(dataISO: string): string {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
        day: "2-digit", // Dia com dois dígitos
        month: "2-digit", // Mês com dois dígitos
        year: "numeric", // Ano com quatro dígitos
        hour: "2-digit", // Hora com dois dígitos
        minute: "2-digit", // Minuto com dois dígitos
    });
}

interface Props extends alertaBody {
    excluirAlerta: (id: string) => void; // Função para excluir o alerta, recebendo o ID do alerta
}

// Caixa de alerta para edição e exclusão
export function CaixaEditarAlerta({ id, nomeAlerta, dataCriacao, nivelGravidade, excluirAlerta }: Props) {
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
        // O contêiner principal agora tem o estilo da caixa normal e um group para hover
        <div className="group w-[340px] p-6 shadow-lg rounded-xl border hover:bg-gray-200 hover:dark:bg-slate-950 flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-center mb-2">
                    {/* Nome do alerta (limitado para não estourar layout) */}
                    <h2 className="font-semibold text-xl text-left truncate max-w-[200px]">{nomeAlerta}</h2>

                    {/* Exibe a gravidade com a cor correspondente */}
                    <p className={`${corDaGravidade} text-center rounded-full min-w-1/4 px-4 font-bold text-gray-900`}>{textoGravidade}</p>
                </div>

                {/* Link para visualizar detalhes do alerta que se comporta como o principal da CaixaAlerta */}
                <Link href={`/alertas/${id}`} className="block w-full text-red-700 font-bold hover:underline mb-4">
                    Ir para página de detalhes
                </Link>

                {/* Exibe a data de criação do alerta formatada */}
                <p className="text-gray-500 text-sm">
                    <i className="fa-solid fa-calendar-days mr-1" /> {formatarData(dataCriacao)}
                </p>
            </div>

            {/* Nova seção para os botões de ação na parte inferior */}
            <div className="flex justify-around items-center mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                {/* Botão para excluir o alerta */}
                <button onClick={() => excluirAlerta(id)} className="flex gap-2 items-center text-gray-700 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-500 transition-colors duration-200">
                    <i className="fa-solid fa-trash"></i>
                    <span className="text-sm">Encerrar</span>
                </button>

                {/* Link para editar o alerta */}
                <Link className="flex gap-2 items-center text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-500 transition-colors duration-200" href={`/area-colaborador/gerenciar-alertas/editar/${id}`}>
                    <i className="fa-solid fa-pen"></i>
                    <span className="text-sm">Editar</span>
                </Link>
            </div>
        </div>
    );
}
