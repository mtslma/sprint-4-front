"use client";

import PageTitle from "@/components/PageTitle/PageTitle";
import ContactItem from "@/components/MensagemDeContato/MensagemDeContato";
import AlertPopup from "@/components/AlertPopUp/AlertaPopUp";
import LoadingPage from "@/components/LoadingPage/LoadingPage";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import { msContatoBody } from "@/types/props";
import { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import ContactForm from "@/components/Formularios/RegistrarMensagemContato/RegistrarMensagemContato";
import { API_BASE, API_KEY } from "@/services/config";

export default function Suporte() {
    // Armazenando informações da mensagem pop up
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error" | "info">("info");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Armazenando informações do estado da página
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Função para exibir o pop up
    const showPopup = (message: string, type: "success" | "error" | "info") => {
        setPopupMessage(message);
        setPopupType(type);
        setIsPopupVisible(true);
        setTimeout(() => setIsPopupVisible(false), 4000); // Some após 4 segundos
    };

    // Função que faz a chamada para o envio da mensagem
    const onSubmit: SubmitHandler<msContatoBody> = async (data) => {
        setLoading(true); // Página carregando
        try {
            // Fazendo o POST para a API com os dados do formulário
            const res = await fetch(`${API_BASE}/mensagem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(data),
            });

            // Analisando a resposta
            if (res.ok) {
                showPopup("Mensagem enviada com sucesso!", "success");
            } else {
                const errorText = await res.text();
                setError(errorText || "Erro ao enviar mensagem");
            }
        } catch {
            showPopup("Erro de conexão com a API.", "error");
        } finally {
            setLoading(false); // Fim do loading
        }
    };

    // Exibe a tela de carregamento
    if (loading) return <LoadingPage />;
    // Exibe a tela de erro
    if (error) return <ErrorPage error={error} />;

    return (
        <main className="flex flex-col items-center h-full mb-4 p-4">
            {/* Elemento de popup que fica escondido aqui até precisar aparecer */}
            <AlertPopup message={popupMessage} type={popupType} isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} />

            {/* Título da página */}
            <PageTitle iconName="headset">Suporte</PageTitle>

            {/* Seção informativa */}
            <section className="w-full max-w-2xl md:max-3-xl border p-6 rounded-xl shadow-lg mt-6 flex flex-col gap-4">
                <div>
                    <h3 className="custom-gradient text-2xl md:text-3xl font-bold text-center mb-4">Precisando de ajuda?</h3>
                    <p className="text-center md:text-lg md:px-16">Fale conosco por meio dos nossos canais de contato!</p>
                </div>

                {/* Contatos disponíveis */}
                <ContactItem iconClass="fa-solid fa-phone" title="Telefone" value="+55 (11) 12345-6789" description="Atendimento de Seg. a Sex., das 8h às 18h." />
                <ContactItem iconClass="fa-solid fa-envelope" title="E-mail" value="suporte@aumo.com.br" description="Garantia de resposta em até 7 dias úteis." />
            </section>

            {/* Formulário de contato */}
            <section className="flex flex-col justify-center items-center w-full max-w-2xl md:max-3-xl border p-6 rounded-xl shadow-lg mt-6 mx-auto">
                <h3 className="custom-gradient text-xl md:text-2xl font-bold text-center text-red-700 mb-2">
                    <i className="fa-solid fa-message" /> Nos envie uma mensagem!
                </h3>
                <p className="text-center md:text-lg md:px-16 my-2">Se preferir você pode enviar uma mensagem, preencha os campos abaixo e logo mais nosso time entrará em contato por meio do endereço de email fornecido!</p>

                {/* Chamando o formulário de contato */}
                <ContactForm onSubmit={onSubmit} />
            </section>
        </main>
    );
}
