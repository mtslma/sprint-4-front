import { estacaoBody, FormEditarEstacao } from "@/types/props";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditarEstacaoForm({ estacao, linhas, onSubmit }: FormEditarEstacao) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<estacaoBody>();

    // Atualiza os valores do formulário quando alterado
    useEffect(() => {
        if (estacao) {
            reset({
                nomeEstacao: estacao.nomeEstacao,
                statusEstacao: estacao.statusEstacao,
                inicioOperacao: estacao.inicioOperacao,
                fimOperacao: estacao.fimOperacao,
                idLinha: estacao.idLinha,
            });
        }
    }, [estacao, reset]);

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg mt-6 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* Nome */}
                <div>
                    <input type="text" {...register("nomeEstacao", { required: "O campo nome é obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeEstacao && <span className="text-red-600 text-sm">{errors.nomeEstacao.message}</span>}
                </div>

                {/* Status */}
                <div>
                    <label className="font-bold dark:text-white">Status de funcionamento:</label>
                    <select {...register("statusEstacao", { required: "Selecione o status." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecionar status...</option>
                        <option value="NORMAL">🟢 Normal</option>
                        <option value="PARCIAL">🟡 Parcial</option>
                        <option value="INTERROMPIDO">🔴 Interrompido</option>
                    </select>
                    {errors.statusEstacao && <span className="text-red-600 text-sm">{errors.statusEstacao.message}</span>}
                </div>

                {/* Horários */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="font-bold dark:text-white">Horário de abertura:</label>
                        <input type="time" {...register("inicioOperacao", { required: "Campo obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                        {errors.inicioOperacao && <span className="text-red-600 text-sm">{errors.inicioOperacao.message}</span>}
                    </div>
                    <div className="flex-1">
                        <label className="font-bold dark:text-white">Horário de fechamento:</label>
                        <input type="time" {...register("fimOperacao", { required: "Campo obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                        {errors.fimOperacao && <span className="text-red-600 text-sm">{errors.fimOperacao.message}</span>}
                    </div>
                </div>

                {/* Linha */}
                <div>
                    <label className="font-bold dark:text-white">Linha:</label>
                    <select {...register("idLinha", { required: "Selecione uma linha." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecionar linha...</option>
                        {linhas.map((linha) => (
                            <option key={linha.id} value={linha.id}>
                                {`#${linha.numeroLinha} - ${linha.nomeLinha}`}
                            </option>
                        ))}
                    </select>
                    {errors.idLinha && <span className="text-red-600 text-sm">{errors.idLinha.message}</span>}
                </div>

                {/* Botão */}
                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-800 transition disabled:opacity-50">
                        Atualizar Estação
                    </button>
                </div>
            </form>
        </div>
    );
}
