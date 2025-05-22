"use client";
import PageTitle from "@/components/PageTitle/PageTitle";
import { CHATBOT_API_KEY, CHATBOT_ASSISTANT_ID, CHATBOT_SERVICE_URL } from "@/services/chatbot";
import { ChatMessage, WatsonGenericResponse } from "@/types/props";
import { useState } from "react";

export default function Aumo() {
    // Informações de mensagens de usuário e histórico de chat
    const [userMessage, setUserMessage] = useState(""); // Estado para a mensagem atual do usuário.
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]); // Estado para o histórico de mensagens do chat.
    const [loading, setLoading] = useState(false); // Estado para controlar o carregamento da resposta do chatbot.

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserMessage(e.target.value); // Atualiza o estado da mensagem do usuário conforme ele digita.
    };

    const handleSendMessage = async () => {
        if (userMessage.trim() === "") return; // Impede o envio de mensagens vazias.

        // Adiciona a mensagem do usuário ao histórico e ativa o estado de carregamento.
        setChatHistory((prev) => [...prev, { sender: "user", message: userMessage }]);
        setLoading(true);

        try {
            // Criar sessão com o chatbot WATSON
            // Requisição para criar uma nova sessão com o serviço do Watson Assistant.
            const sessionRes = await fetch(`${CHATBOT_SERVICE_URL}/v2/assistants/${CHATBOT_ASSISTANT_ID}/sessions?version=2021-06-14`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa("apikey:" + CHATBOT_API_KEY)}`,
                },
            });

            const sessionData = await sessionRes.json(); // Processa a resposta da criação da sessão.
            const sessionId = sessionData.session_id; // Extrai o ID da sessão.

            if (!sessionId) {
                console.error("Falha ao criar sessão:", sessionData); // Loga erro se a sessão não for criada.
                return;
            }

            // Enviar mensagem, faz o post para a API do Watson
            // Requisição para enviar a mensagem do usuário para o Watson Assistant usando a sessão criada.
            const messageRes = await fetch(`${CHATBOT_SERVICE_URL}/v2/assistants/${CHATBOT_ASSISTANT_ID}/sessions/${sessionId}/message?version=2021-06-14`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${btoa("apikey:" + CHATBOT_API_KEY)}`,
                },
                body: JSON.stringify({
                    input: {
                        message_type: "text",
                        text: userMessage,
                    },
                }),
            });

            // Erros
            // Verifica se houve erros nas requisições de sessão ou mensagem.
            if (!sessionRes.ok) {
                console.error("Erro na criação da sessão:", await sessionRes.text());
            }
            if (!messageRes.ok) {
                console.error("Erro ao enviar mensagem:", await messageRes.text());
            }

            const messageData = await messageRes.json(); // Processa a resposta da mensagem do Watson.

            // Extrai a resposta de texto do chatbot, se houver.
            const botText = (messageData.output.generic as WatsonGenericResponse[]).find((item) => item.response_type === "text");

            const botMessage = botText?.text || "Desculpa, ainda não entendo nada sobre isso..."; // Define a mensagem do bot ou uma resposta padrão.
            setChatHistory((prev) => [...prev, { sender: "bot", message: botMessage }]); // Adiciona a mensagem do bot ao histórico.
        } catch (error) {
            console.error("Erro ao conversar com Watson:", error); // Captura e loga quaisquer erros na comunicação.
            setChatHistory((prev) => [...prev, { sender: "bot", message: "[Erro ao obter resposta]" }]); // Adiciona uma mensagem de erro ao histórico.
        } finally {
            setUserMessage(""); // Limpa o campo de mensagem do usuário.
            setLoading(false); // Desativa o estado de carregamento.
        }
    };

    return (
        <main className="page-layout justify-start">
            <PageTitle iconName={"robot"}>Falar com o aumo</PageTitle>
            {/* Caixinha do chat */}
            <div className="flex flex-col w-full max-w-full sm:max-w-2xl border p-2 mt-4 rounded-xl shadow-lg">
                {/* Container do histórico de mensagens */}
                <div className="border-gray-950 min-h-[350px] dark:border-gray-300 rounded-lg p-4 mb-6 space-y-4 max-h-[450px] w-full overflow-y-auto pr-2">
                    {/* Verificando se não há mensagens */}
                    {chatHistory.length === 0 ? (
                        <div className="text-center dark:text-gray-300 font-bold">Envie uma mensagem para iniciar!</div>
                    ) : (
                        chatHistory.map((chat, index) => (
                            <div key={index} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`min-w-[15%] max-w-[70%] px-4 py-1 rounded-lg text-lg shadow-md ${chat.sender === "user" ? "text-endtext-gray-800 bg-red-700 text-gray-100 dark:text-gray-200 self-end" : "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 self-start"}`}>
                                    <p className="text-xs font-bold">
                                        {chat.sender === "user" ? (
                                            "VOCÊ"
                                        ) : (
                                            <>
                                                <i className="fa-solid fa-robot" /> AUMO
                                            </>
                                        )}
                                    </p>
                                    <p className="text-lg">{chat.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input de mensagem e botão de envio */}
                <div className="flex self-center w-full gap-2 md:max-w-[80%]">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={handleMessageChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage(); // Enviar mensagem ao pressionar Enter.
                        }}
                        placeholder="Digite algo aqui..."
                        className="flex-1 px-4 py-3 sm:py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-400 focus:outline-none sm:text-sm"
                    />

                    {/* Botão para enviar mensagens */}
                    <button onClick={handleSendMessage} disabled={loading} className="max-w-[40px] flex items-center justify-center text-center bg-red-700 text-gray-100 font-bold px-6 py-3 sm:px-6 sm:py-2 rounded-lg hover:bg-red-800 transition disabled:opacity-50 text-lg sm:text-base">
                        {loading ? "..." : <i className="fa-solid fa-paper-plane text-red"></i>}
                    </button>
                </div>
            </div>
        </main>
    );
}
