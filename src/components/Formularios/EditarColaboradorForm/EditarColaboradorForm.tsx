import { colaboradorBody, FormEditarColaborador } from "@/types/props";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditarColaboradorForm({ onSubmit, colaborador }: FormEditarColaborador) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, // para atualizar os valores do formulário quando o colaborador mudar
    } = useForm<colaboradorBody>();

    // Atualiza os valores do formulário com os dados recebidos do colaborador
    useEffect(() => {
        if (colaborador) {
            reset({
                nomeColaborador: colaborador.nomeColaborador,
                tipoColaborador: colaborador.tipoColaborador,
            });
        }
    }, [colaborador, reset]);

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg mt-6 mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* Campo: Nome */}
                <div>
                    <label className="font-bold">Nome do colaborador:</label>
                    <input type="text" {...register("nomeColaborador", { required: "O campo nome é obrigatório." })} placeholder="Informe o nome..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeColaborador && <span className="text-red-600 text-sm">{errors.nomeColaborador.message}</span>}
                </div>

                {/* Campo: Tipo de colaborador */}
                <div>
                    <label className="font-bold">Tipo de colaborador:</label>
                    <select {...register("tipoColaborador", { required: "Selecione o tipo." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="OPERADOR">Operador</option>
                    </select>
                    {errors.tipoColaborador && <span className="text-red-600 text-sm">{errors.tipoColaborador.message}</span>}
                </div>

                {/* Botão de envio */}
                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition">
                        Atualizar Colaborador
                    </button>
                </div>
            </form>
        </div>
    );
}
