"use client";
import { FormEditarLinha, linhaBody } from "@/types/props";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditarLinhaForm({ linha, onSubmit }: FormEditarLinha) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<linhaBody>();

    // Atualiza os valores do formulário quando alterado
    useEffect(() => {
        if (linha) {
            reset({
                nomeLinha: linha.nomeLinha,
                numeroLinha: linha.numeroLinha,
                statusLinha: linha.statusLinha,
            });
        }
    }, [linha, reset]);

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg mt-6 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* Nome da Linha */}
                <div>
                    <label className="font-bold dark:text-white">Nome da linha:</label>
                    <input type="text" {...register("nomeLinha", { required: "O campo nome é obrigatório." })} placeholder="Digite o nome..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeLinha && <span className="text-red-600 text-sm">{errors.nomeLinha.message}</span>}
                </div>

                {/* Número da Linha */}
                <div>
                    <label className="font-bold dark:text-white">Número da linha:</label>
                    <input
                        type="number"
                        {...register("numeroLinha", {
                            required: "O número da linha é obrigatório.",
                            min: { value: 1, message: "Número deve ser maior que zero." },
                        })}
                        placeholder="Digite um número..."
                        className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none"
                    />
                    {errors.numeroLinha && <span className="text-red-600 text-sm">{errors.numeroLinha.message}</span>}
                </div>

                {/* Status */}
                <div>
                    <label className="font-bold dark:text-white">Status:</label>
                    <select {...register("statusLinha", { required: "Selecione o status." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione</option>
                        <option value="NORMAL">🟢 Normal</option>
                        <option value="PARCIAL">🟡 Parcial</option>
                        <option value="INTERROMPIDO">🔴 Interrompido</option>
                    </select>
                    {errors.statusLinha && <span className="text-red-600 text-sm">{errors.statusLinha.message}</span>}
                </div>

                {/* Botão */}
                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded hover:bg-red-800 transition">
                        Atualizar Linha
                    </button>
                </div>
            </form>
        </div>
    );
}
