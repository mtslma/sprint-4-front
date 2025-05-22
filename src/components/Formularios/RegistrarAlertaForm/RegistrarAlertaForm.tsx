"use client";

import { FormAlertasProps, registrarAlertaBody } from "@/types/props"; // Assumindo que registrarAlertaBody é o tipo correto
import { useForm } from "react-hook-form";

// Se este formulário é para registrar alertas, talvez o nome ideal fosse RegistrarAlertaForm
export default function RegisrtarAlertaForm({ estacoes, linhas, onSubmit, defaultValues }: FormAlertasProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<registrarAlertaBody>({
        defaultValues: defaultValues || {
            // Garante valores padrão para um reset limpo
            nomeAlerta: "",
            descricaoAlerta: "",
            nivelAlerta: "",
            idEstacao: "",
            idLinha: "",
        },
    });

    // Wrapper para resetar após o submit
    const handleFormSubmitInterno = async (data: registrarAlertaBody) => {
        await onSubmit(data);
        reset();
    };

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-2xl border p-4 rounded-xl shadow-lg mt-6 mx-auto">
            {/* Agora, handleSubmit do react-hook-form chama a nossa handleFormSubmitInterno */}
            <form onSubmit={handleSubmit(handleFormSubmitInterno)} className="flex flex-col gap-4 w-full">
                {/* Nome */}
                <div>
                    <label className="font-bold">Nome do alerta:</label>
                    <input type="text" {...register("nomeAlerta", { required: "O campo nome é obrigatório." })} placeholder="Digite o nome do alerta..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.nomeAlerta && <span className="text-red-600 text-sm">{errors.nomeAlerta.message}</span>}
                </div>

                {/* Descrição */}
                <div>
                    <label className="font-bold">Descrição do alerta:</label>
                    <textarea {...register("descricaoAlerta", { required: "O campo descrição é obrigatório." })} maxLength={255} placeholder="Descreva o alerta..." className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none" />
                    {errors.descricaoAlerta && <span className="text-red-600 text-sm">{errors.descricaoAlerta.message}</span>}
                </div>

                {/* Nível */}
                <div>
                    <label className="font-bold">Nível de gravidade:</label>
                    <select {...register("nivelAlerta", { required: "Selecione um nível." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none dark:border-gray-300">
                        <option value="">Selecione um nível...</option>
                        <option value="LEVE">🟢 Leve</option>
                        <option value="MÉDIO">🟡 Médio</option>
                        <option value="GRAVE">🔴 Grave</option>
                    </select>
                    {errors.nivelAlerta && <span className="text-red-600 text-sm">{errors.nivelAlerta.message}</span>}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Estação */}
                    <div className="flex-1">
                        <label className="font-bold">Estação relacionada:</label>
                        <select {...register("idEstacao", { required: "Selecione uma estação." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none dark:border-gray-300">
                            <option value="">Selecione uma estação...</option>
                            {/* Garante que estacoes é um array antes de mapear */}
                            {Array.isArray(estacoes) &&
                                estacoes.map((estacao) => (
                                    <option key={estacao.id} value={estacao.id}>
                                        {estacao.nomeEstacao}
                                    </option>
                                ))}
                        </select>
                        {errors.idEstacao && <span className="text-red-600 text-sm">{errors.idEstacao.message}</span>}
                    </div>

                    {/* Linha */}
                    <div className="flex-1">
                        <label className="font-bold">Linha relacionada:</label>
                        <select {...register("idLinha", { required: "Selecione uma linha." })} className="font-sans w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-900 rounded-xl outline-none focus:outline-none dark:border-gray-300">
                            <option value="">Selecione uma linha...</option>
                            {/* Garante que linhas é um array antes de mapear */}
                            {Array.isArray(linhas) &&
                                linhas.map((linha) => (
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
                        Registrar Alerta
                    </button>
                </div>
            </form>
        </div>
    );
}
