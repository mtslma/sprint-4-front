"use client";

import PageTitle from "@/components/PageTitle/PageTitle";
import { API_BASE, API_KEY } from "@/services/config";
import { loginBody, sessaoBody } from "@/types/props";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Login() {
    // Armazena mensagens de erro
    const [error, setError] = useState<string>("");

    // Informações que serão usadas no formulário de login
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<loginBody>();

    // Função para buscar informações da sessão pelo token
    async function buscarSessao(token: string): Promise<sessaoBody | null> {
        try {
            const response = await fetch(`${API_BASE}/sessao/${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
            });

            // Se a resposta não for OK (ex: 401, 400...), tenta ler e exibir a mensagem de erro vinda da API
            if (!response.ok) {
                const mensagemErro = await response.text(); // Usa .text() e pega o texto de erro que a API retorna
                setError(mensagemErro || "Erro ao validar sessão.");
                return null; // Retorna null pois houve erro
            }

            // Se a resposta for OK, extrai os dados da sessão
            const data: sessaoBody = await response.json();
            return data;
        } catch (error) {
            // Captura erros inesperados (ex: falha de rede)
            console.error(error);
            if (error instanceof Error) {
                await setError(error.message);
            } else {
                setError("Erro desconhecido.");
            }
            return null;
        }
    }

    // Efeito que roda uma única vez ao carregar a página
    useEffect(() => {
        // Após validar se existe uma sessão ativa, redireciona o usuário para a área do colaborador
        async function redirecionarAreaColaborador() {
            const token = localStorage.getItem("session-token");

            // Só tenta buscar a sessão se houver token salvo
            if (token) {
                const sessao = await buscarSessao(token);

                // Se a sessão estiver ativa (status === 'ATIVA'), redireciona
                if (sessao?.statusSessao.toUpperCase() === "ATIVA") {
                    window.location.href = "/area-colaborador";
                }
            }
        }

        redirecionarAreaColaborador();
    }, []);

    // Função chamada quando o formulário é enviado
    const onSubmit: SubmitHandler<loginBody> = async (data) => {
        try {
            // Fazendo o POST para API com os dados de login
            const response = await fetch(`${API_BASE}/autenticacao`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify(data),
            });

            // Se a resposta não for ok, tenta exibir o erro retornado pela API
            if (!response.ok) {
                const errorMessage = await response.text(); // A API retorna uma string como mensagem de erro
                setError(errorMessage || "Ocorreu um erro ao fazer login.");
                return;
            }

            // Pegando o token da sessão que a API retorna
            const { "session-token": sessionToken } = await response.json();

            // Se o token de sessão for retornado, salva no localStorage
            if (sessionToken) {
                localStorage.setItem("session-token", sessionToken);

                // Redireciona para a área do colaborador
                window.location.href = "/area-colaborador";
            }
        } catch (error) {
            console.error("Erro de conexão", error);

            // Mostra mensagem genérica caso não consiga se conectar com o servidor
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Erro de conexão com o servidor.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center mt-4 w-full h-full mb-4 gap-8">
            <PageTitle iconName={"user"}>Realizar Login</PageTitle>
            <div className="w-full max-w-md">
                {/* Exibe o erro caso haja algum */}
                {error && <p className="font-bold text-red-700 text-center mb-4">{error}</p>}

                {/* Formulário de login */}
                <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded-xl flex flex-col gap-8 mx-4">
                    {/* Campo de email */}
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
                            placeholder="Digite seu email..."
                            className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-950 rounded-xl outline-none focus:outline-none"
                        />
                        {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
                    </div>

                    {/* Campo de senha */}
                    <div>
                        <label className="font-bold">Senha:</label>
                        <input
                            type="password"
                            {...register("senha", {
                                required: "O campo senha é obrigatório.",
                            })}
                            placeholder="Digite sua senha..."
                            className="w-full p-2 border drop-shadow-lg bg-gray-100 dark:bg-gray-950 rounded-xl outline-none focus:outline-none"
                        />
                        {errors.senha && <span className="text-red-600 text-sm">{errors.senha.message}</span>}
                    </div>

                    <button type="submit" className="w-full py-2 bg-red-700 text-white font-semibold rounded-xl hover:bg-red-800 focus:outline-none">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
