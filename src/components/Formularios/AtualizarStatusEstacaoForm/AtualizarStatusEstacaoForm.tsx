"use client";
import { estacaoBody } from "@/types/props";
import { useForm } from "react-hook-form";
import { atualizarStatusBody } from "@/types/props";
import StatusForm from "../AtualizarStatusForm/AtualizarStatusForm";

interface EstacaoStatusFormProps {
    estacoes: estacaoBody[];
    onSubmit: (data: atualizarStatusBody) => Promise<void>;
}

export default function AtualizarStatusEstacaoForm({ estacoes, onSubmit }: EstacaoStatusFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<atualizarStatusBody>();

    // Construindo o formulário de atualizar status de estações
    return <StatusForm title="ATUALIZAR STATUS DE ESTAÇÕES" items={estacoes.map((estacao) => ({ id: estacao.id, nome: estacao.nomeEstacao }))} register={register} errors={errors} onSubmit={handleSubmit(onSubmit)} type="estacao" />;
}
