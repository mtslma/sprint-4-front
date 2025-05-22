"use client";

import { FormLinhasProps, linhaBody } from "@/types/props";
import { useForm } from "react-hook-form";

export default function RegistrarLinhaForm({ onSubmit, defaultValues }: FormLinhasProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<linhaBody>({ defaultValues });

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">REGISTRAR LINHA</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* Nome da Linha */}
                <div>
                    <label className="font-bold">Nome da linha:</label>
                    <input type="text" {...register("nomeLinha", { required: "O campo nome é obrigatório." })} placeholder="Digite o nome da linha" className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeLinha && <span className="text-red-600 text-sm">{errors.nomeLinha.message}</span>}
                </div>

                {/* Número da Linha */}
                <div>
                    <label className="font-bold">Número da linha:</label>
                    <input type="number" {...register("numeroLinha", { required: "O número da linha é obrigatório.", min: { value: 1, message: "Número deve ser maior que zero." } })} placeholder="Ex: 8" className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.numeroLinha && <span className="text-red-600 text-sm">{errors.numeroLinha.message}</span>}
                </div>

                {/* Status */}
                <div>
                    <label className="font-bold">Status:</label>
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
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition">
                        Registrar Linha
                    </button>
                </div>
            </form>
        </div>
    );
}
