"use client";

import { FormManutencaoProps, manutencaoBody } from "@/types/props";
import { useForm } from "react-hook-form";

export default function RegistrarManutencaoForm({ estacoes, linhas, onSubmit, defaultValues }: FormManutencaoProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<manutencaoBody>({ defaultValues });

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg">
            <p className="text-lg font-bold text-center mb-2 md:text-2xl">REGISTRAR MANUTENÇÃO</p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
                <div>
                    {/* Campo para preencher o nome */}
                    <label className="font-bold">Nome da manutenção:</label>
                    <input type="text" {...register("nomeManutencao", { required: "Campo obrigatório." })} placeholder="Digite o nome da manutenção..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeManutencao && <span className="text-red-600 text-sm">{errors.nomeManutencao.message}</span>}
                </div>

                <div>
                    {/* Campo para preencher a descrição */}
                    <label className="font-bold">Descrição da manutenção:</label>
                    <textarea {...register("descricaoManutencao", { required: "Campo obrigatório." })} placeholder="Digite a descrição da manutenção..." className="resize-none w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.descricaoManutencao && <span className="text-red-600 text-sm">{errors.descricaoManutencao.message}</span>}
                </div>

                <div>
                    {/* Campo para selecionar prioridade */}
                    <label className="font-bold">Prioridade da manutenção:</label>
                    <select {...register("nivelPrioridade", { required: "Campo obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                        <option value="">Selecione a prioridade...</option>
                        <option value="BAIXA">🟢 Baixa</option>
                        <option value="MÉDIA">🟡 Média</option>
                        <option value="ALTA">🔴 Alta</option>
                    </select>
                    {errors.nivelPrioridade && <span className="text-red-600 text-sm">{errors.nivelPrioridade.message}</span>}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Campo para selecionar estação */}
                    <div className="flex-1">
                        <label className="font-bold">Estação relacionada:</label>
                        <select {...register("idEstacao", { required: "Campo obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                            <option value="">Selecione a estação...</option>
                            {estacoes.map((estacao) => (
                                <option key={estacao.id} value={estacao.id}>
                                    {estacao.nomeEstacao}
                                </option>
                            ))}
                        </select>
                        {errors.idEstacao && <span className="text-red-600 text-sm">{errors.idEstacao.message}</span>}
                    </div>

                    {/* Campo para selecionar linha */}
                    <div className="flex-1">
                        <label className="font-bold">Linha relacionada:</label>
                        <select {...register("idLinha", { required: "Campo obrigatório." })} className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none">
                            <option value="">Selecione a linha...</option>
                            {linhas.map((linha) => (
                                <option key={linha.id} value={linha.id}>
                                    {linha.nomeLinha}
                                </option>
                            ))}
                        </select>
                        {errors.idLinha && <span className="text-red-600 text-sm">{errors.idLinha.message}</span>}
                    </div>
                </div>

                {/* Botão de envio do formulário */}
                <div className="text-right">
                    <button type="submit" className="bg-red-700 text-white font-bold px-4 py-2 rounded-xl hover:bg-red-800 transition">
                        Registrar Manutenção
                    </button>
                </div>
            </form>
        </div>
    );
}
