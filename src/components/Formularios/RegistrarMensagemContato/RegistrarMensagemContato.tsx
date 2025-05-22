"use client";

import { useForm } from "react-hook-form";
import { FormMensagemContatoProps, msContatoBody } from "@/types/props";

export default function ContactForm({ onSubmit }: FormMensagemContatoProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<msContatoBody>();

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                {/* Nome */}
                <div>
                    <label className="font-bold">Nome:</label>
                    <input type="text" {...register("nome", { required: "O campo nome é obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-950 rounded-xl outline-none focus:outline-none" placeholder="Digite seu nome..." />
                    {errors.nome && <span className="text-red-600 text-sm">{errors.nome.message}</span>}
                </div>

                {/* Email */}
                <div>
                    <label className="font-bold">Email:</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "O campo email é obrigatório.",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Digite um email válido.",
                            },
                        })}
                        className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-950 rounded-xl outline-none focus:outline-none dark:border-gray-300"
                        placeholder="Digite seu email..."
                    />
                    {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
                </div>

                {/* Mensagem */}
                <div>
                    <label className="font-bold">Mensagem:</label>
                    <textarea {...register("mensagem", { required: "O campo mensagem é obrigatório." })} maxLength={255} className="resize-none w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-950 rounded-xl outline-none focus:outline-none dark:border-gray-300" placeholder="Digite sua mensagem..." />
                    {errors.mensagem && <span className="text-red-600 text-sm">{errors.mensagem.message}</span>}
                </div>

                {/* Botão */}
                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition">
                        Enviar Mensagem
                    </button>
                </div>
            </form>
        </div>
    );
}
