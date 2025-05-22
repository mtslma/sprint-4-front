"use client";

import { FormEditarManutencao, manutencaoBody } from "@/types/props";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditarManutencaoForm({ manutencao, estacoes, linhas, onSubmit }: FormEditarManutencao) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<manutencaoBody>();

    // Atualiza os valores do formulário quando alterado
    useEffect(() => {
        if (manutencao) {
            reset({
                nomeManutencao: manutencao.nomeManutencao,
                descricaoManutencao: manutencao.descricaoManutencao,
                nivelPrioridade: manutencao.nivelPrioridade,
                idEstacao: manutencao.idEstacao,
                idLinha: manutencao.idLinha,
            });
        }
    }, [manutencao, reset]);

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg mt-6 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* Nome */}
                <div>
                    <label className="font-bold">Nome da Manutenção:</label>
                    <input type="text" {...register("nomeManutencao", { required: "O campo nome é obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeManutencao && <span className="text-red-600 text-sm">{errors.nomeManutencao.message}</span>}
                </div>

                {/* Descrição */}
                <div>
                    <label className="font-bold">Descrição da manutenção:</label>
                    <input type="text" {...register("descricaoManutencao", { required: "O campo descrição é obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.descricaoManutencao && <span className="text-red-600 text-sm">{errors.descricaoManutencao.message}</span>}
                </div>

                {/* Nível de Prioridade */}
                <div>
                    <label className="font-bold">Nível de Prioridade:</label>
                    <select {...register("nivelPrioridade", { required: "Campo obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione</option>
                        <option value="BAIXA">🟢 Baixa</option>
                        <option value="MÉDIA">🟡 Média</option>
                        <option value="ALTA">🔴 Alta</option>
                    </select>
                    {errors.nivelPrioridade && <span className="text-red-600 text-sm">{errors.nivelPrioridade.message}</span>}
                </div>

                {/* Estação e Linha */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="font-bold">Estação relacionada:</label>
                        <select {...register("idEstacao", { required: "Campo obrigatório." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none dark:border-gray-300">
                            <option value="">Selecione</option>
                            {estacoes.map((estacao) => (
                                <option key={estacao.id} value={estacao.id}>
                                    {estacao.nomeEstacao}
                                </option>
                            ))}
                        </select>
                        {errors.idEstacao && <span className="text-red-600 text-sm">{errors.idEstacao.message}</span>}
                    </div>

                    {/* Campo de linha relacionada */}
                    <div className="flex-1">
                        <label className="font-bold">Linha relacionada:</label>
                        <select {...register("idLinha", { required: "Campo obrigatório." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none dark:border-gray-300">
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
                        Atualizar Manutenção
                    </button>
                </div>
            </form>
        </div>
    );
}
