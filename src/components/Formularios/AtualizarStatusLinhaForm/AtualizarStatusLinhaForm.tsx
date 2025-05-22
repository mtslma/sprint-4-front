"use client";
import { LinhaStatusFormProps } from "@/types/props";
import StatusForm from "../AtualizarStatusForm/AtualizarStatusForm";
import { useForm } from "react-hook-form";
import { atualizarStatusBody } from "@/types/props";

export default function AtualizarStatusLinhaForm({ linhas, onSubmit }: LinhaStatusFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<atualizarStatusBody>();

    // Construindo o formulário de atualizar status de linhas
    return <StatusForm title="ATUALIZAR STATUS DE LINHAS" items={linhas.map((linha) => ({ id: linha.id, nome: linha.nomeLinha }))} register={register} errors={errors} onSubmit={handleSubmit(onSubmit)} type="linha" />;
}
