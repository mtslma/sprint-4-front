import { msContatoBody } from "@/types/props";
import CaixaMensagemDeContato from "@/components/CaixaMensagemDeContato/CaixaMensagemDeContato";

type ListaMensagensContato = {
    contatos: msContatoBody[];
    totalItens: number;
    onExcluir: (id: string) => void;
    renderPagination: () => void;
};

export default function ListaEstacoes({ contatos, totalItens, onExcluir, renderPagination }: ListaMensagensContato) {
    return (
        <>
            {totalItens > 0 ? (
                <>
                    {/* Grid responsivo de cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl px-4 place-items-center">
                        {contatos.map((contato) => (
                            <CaixaMensagemDeContato key={contato.id} contato={contato} onArquivar={onExcluir} />
                        ))}
                    </div>

                    {/* Controles de paginação */}
                    {renderPagination()}
                </>
            ) : (
                <p className="text-gray-600 text-center w-full">
                    <i className="fa-solid fa-circle-exclamation"></i> Nenhuma mensagem encontrada
                </p>
            )}
        </>
    );
}
