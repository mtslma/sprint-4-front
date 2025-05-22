import { msContatoBody } from "@/types/props";
// Removido o import de useState, pois não será mais usado neste componente.

// Função que formata a data para um formato mais agradável
const formatarData = (data: string): string => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, "0");
    const minutos = String(date.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
};

// Função que formata o texto para deixar a exibição mais agradável
function formatarTexto(texto: string): string {
    return texto
        .toLowerCase()
        .split(" ")
        .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(" ");
}

type Props = {
    contato: msContatoBody;
    onArquivar: (id: string) => void; // Função para chamar ao arquivar a mensagem
};

export default function CaixaMensagemDeContato({ contato, onArquivar }: Props) {
    return (
        <div className="w-full max-w-[360px] p-5 rounded-xl border shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* Cabeçalho com nome e email */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center justify-start gap-4 text-xl font-semibold text-gray-800 dark:text-gray-100">{formatarTexto(contato.nome)}</div>
                    <p className="flex items-center text-gray-600 dark:text-gray-300 text-sm mt-0.5 gap-2">
                        <i className="fa-solid fa-envelope" />
                        {contato.email.toLowerCase()}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatarData(contato.dataCriacao)}</span>
                    {/* Botão de arquivar */}
                    <button
                        onClick={() => onArquivar(contato.id)}
                        className="text-sm text-gray-500 group cursor-pointer" // Removido 'disabled={loading}' e estilos relacionados
                    >
                        <i className="fa-solid fa-box-archive font-bold group-hover:text-red-700" />
                        <span className="group-hover:underline ml-2">Arquivar</span>
                    </button>
                </div>
            </div>

            {/* Mensagem */}
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line max-h-[220px] bg-gray-300 p-2 rounded-xl dark:bg-gray-700 overflow-y-auto pr-1 flex-1">{contato.mensagem}</p>
        </div>
    );
}
