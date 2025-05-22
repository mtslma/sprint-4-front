"use client";

import { FormColaboradorProps, registrarColaboradorBody } from "@/types/props";
import { useForm } from "react-hook-form";

export default function RegistrarColaboradorForm({ onSubmit, defaultValues }: FormColaboradorProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<registrarColaboradorBody>({ defaultValues });

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">REGISTRAR COLABORADOR</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                <div>
                    <label className="font-bold">Nome:</label>
                    <input type="text" {...register("nomeColaborador", { required: "Nome é obrigatório." })} placeholder="Digite o nome..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeColaborador && <span className="text-red-600 text-sm">{errors.nomeColaborador.message}</span>}
                </div>

                <div>
                    <label className="font-bold">Tipo de colaborador:</label>
                    <select {...register("tipoColaborador", { required: "Selecione o tipo." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione um tipo</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="OPERADOR">Operador</option>
                    </select>
                    {errors.tipoColaborador && <span className="text-red-600 text-sm">{errors.tipoColaborador.message}</span>}
                </div>

                <div>
                    <label className="font-bold">Email:</label>
                    <input type="email" {...register("autenticaColaborador.email", { required: "Email é obrigatório." })} placeholder="Digite um email..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.autenticaColaborador?.email && <span className="text-red-600 text-sm">{errors.autenticaColaborador.email.message}</span>}
                </div>

                <div>
                    <label className="font-bold">Senha:</label>
                    <input type="password" {...register("autenticaColaborador.senha", { required: "Senha é obrigatória." })} placeholder="Digite uma senha..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.autenticaColaborador?.senha && <span className="text-red-600 text-sm">{errors.autenticaColaborador.senha.message}</span>}
                </div>

                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition">
                        Registrar Colaborador
                    </button>
                </div>
            </form>
        </div>
    );
}
