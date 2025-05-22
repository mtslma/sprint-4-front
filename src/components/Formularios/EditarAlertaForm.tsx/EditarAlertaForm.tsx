import { FormEditarAlerta, registrarAlertaBody } from "@/types/props";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditarAlertaForm({ alerta, estacoes, linhas, onSubmit }: FormEditarAlerta) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<registrarAlertaBody>();

    // Atualiza os valores do formulário quando alterado
    useEffect(() => {
        if (alerta) {
            reset({
                nomeAlerta: alerta.nomeAlerta,
                descricaoAlerta: alerta.descricaoAlerta,
                nivelAlerta: alerta.nivelGravidade,
                idEstacao: alerta.idEstacao,
                idLinha: alerta.idLinha,
            });
        }
    }, [alerta, reset]);

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg mt-6 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* Nome */}
                <div>
                    <label className="font-bold">Nome:</label>
                    <input type="text" {...register("nomeAlerta", { required: "O campo nome é obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeAlerta && <span className="text-red-600 text-sm">{errors.nomeAlerta.message}</span>}
                </div>

                {/* Descrição */}
                <div>
                    <label className="font-bold">Descrição:</label>
                    <textarea {...register("descricaoAlerta", { required: "O campo descrição é obrigatório." })} className="resize-none w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.descricaoAlerta && <span className="text-red-600 text-sm">{errors.descricaoAlerta.message}</span>}
                </div>

                {/* Nível de gravidade */}
                <div>
                    <label className="font-bold">Nível de gravidade:</label>
                    <select {...register("nivelAlerta", { required: "Selecione um nível." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione</option>
                        <option value="LEVE">🟢 Leve</option>
                        <option value="MÉDIO">🟡 Médio</option>
                        <option value="GRAVE">🔴 Grave</option>
                    </select>
                    {errors.nivelAlerta && <span className="text-red-600 text-sm">{errors.nivelAlerta.message}</span>}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Estação */}
                    <div className="flex-1">
                        <label className="font-bold">Estação:</label>
                        <select {...register("idEstacao", { required: "Selecione uma estação." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                            <option value="">Selecione</option>
                            {estacoes.map((estacao) => (
                                <option key={estacao.id} value={estacao.id}>
                                    {estacao.nomeEstacao}
                                </option>
                            ))}
                        </select>
                        {errors.idEstacao && <span className="text-red-600 text-sm">{errors.idEstacao.message}</span>}
                    </div>

                    {/* Linha */}
                    <div className="flex-1">
                        <label className="font-bold">Linha:</label>
                        <select {...register("idLinha", { required: "Selecione uma linha." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                            <option value="">Selecione</option>
                            {linhas.map((linha) => (
                                <option key={linha.id} value={linha.id}>
                                    {linha.nomeLinha}
                                </option>
                            ))}
                        </select>
                        {errors.idLinha && <span className="text-red-600 text-sm">{errors.idLinha.message}</span>}
                    </div>
                </div>

                {/* Botão */}
                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition">
                        Atualizar Alerta
                    </button>
                </div>
            </form>
        </div>
    );
}
