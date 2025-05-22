"use client";

import { estacaoBody, FormEstacaoProps } from "@/types/props";
import { useForm } from "react-hook-form";

export default function RegistrarEstacaoForm({ linhas, onSubmit, defaultValues }: FormEstacaoProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<estacaoBody>({ defaultValues });

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">REGISTRAR ESTAÇÃO</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                <div>
                    <label className="font-bold">Nome da estação:</label>
                    <input type="text" {...register("nomeEstacao", { required: "O campo nome é obrigatório." })} placeholder="Digite o nome..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeEstacao && <span className="text-red-600 text-sm">{errors.nomeEstacao.message}</span>}
                </div>

                <div>
                    <label className="font-bold">Status de funcionamento:</label>
                    <select {...register("statusEstacao", { required: "O campo é obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione o status...</option>
                        <option value="NORMAL">🟢 Normal</option>
                        <option value="PARCIAL">🟡 Parcial</option>
                        <option value="INTERROMPIDO">🔴 Interrompido</option>
                    </select>
                    {errors.statusEstacao && <span className="text-red-600 text-sm">{errors.statusEstacao.message}</span>}
                </div>

                <div>
                    <label className="font-bold">Horário de abertura:</label>
                    <input type="time" {...register("inicioOperacao", { required: "O horário de abertura é obrigatório." })} placeholder="" className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.inicioOperacao && <span className="text-red-600 text-sm">{errors.inicioOperacao.message}</span>}
                </div>

                <div>
                    <label className="font-bold">Horário de fechamento:</label>
                    <input type="time" {...register("fimOperacao", { required: "O horário de fechamento é obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.fimOperacao && <span className="text-red-600 text-sm">{errors.fimOperacao.message}</span>}
                </div>

                <div>
                    <label className="font-bold">Linha:</label>
                    <select {...register("idLinha", { required: "O campo é obrigatório." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione a linha...</option>
                        {linhas.map((linha) => (
                            <option key={linha.id} value={linha.id}>
                                {`#${linha.numeroLinha} - ${linha.nomeLinha} `}
                            </option>
                        ))}
                    </select>
                    {errors.idLinha && <span className="text-red-600 text-sm">{errors.idLinha.message}</span>}
                </div>

                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition">
                        Registrar Estação
                    </button>
                </div>
            </form>
        </div>
    );
}
