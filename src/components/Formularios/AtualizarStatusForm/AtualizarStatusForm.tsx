"use client";
import { StatusFormProps } from "@/types/props";

export default function AtualizarStatusForm({ title, items, register, errors, onSubmit, type }: StatusFormProps) {
    return (
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg mt-6 mx-auto">
            {/* Título do formulário */}
            <p className="text-lg font-bold text-center mb-4 dark:text-white">{title}</p>

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div>
                    {/* Definindo a label do formulário */}
                    <label className="font-bold dark:text-white">{type === "linha" ? "Linha:" : "Estação:"}</label>
                    {/* Select de itens, ao selecionar o ID é passado para a URL que vai atualizar */}
                    <select
                        {...register("id", {
                            required: `Selecione uma ${type === "linha" ? "linha" : "estação"}.`,
                        })}
                        className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none"
                    >
                        <option value="">Selecionar...</option>
                        {/* Fazendo o mapeamento dos itens presentes na lista e definindo seu valor */}
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nome}
                            </option>
                        ))}
                    </select>
                    {errors.id && <span className="text-red-600 text-sm">{errors.id.message}</span>}
                </div>

                {/* Select de status, é o que será passado no corpo da URL que vai atualizar */}
                <div>
                    <label className="font-bold dark:text-white">Status de funcionamento:</label>
                    <select {...register("status", { required: "Selecione o status." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecionar...</option>
                        <option value="NORMAL">🟢 Normal</option>
                        <option value="PARCIAL">🟡 Parcial</option>
                        <option value="INTERROMPIDO">🔴 Interrompido</option>
                    </select>
                    {errors.status && <span className="text-red-600 text-sm">{errors.status.message}</span>}
                </div>

                {/* Botão de confirmação */}
                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-800 transition">
                        Atualizar
                    </button>
                </div>
            </form>
        </div>
    );
}
