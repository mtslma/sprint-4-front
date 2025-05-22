import { useState } from "react";

export default function TextoCopiavel(props: { text: string }) {
    const { text } = props;
    const [copied, setCopied] = useState(false);

    // Função para receber clique
    const handleCopy = async () => {
        // Tentanto usar a clipboard api
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 500);
            } catch (err) {
                console.error("Erro ao copiar com Clipboard API:", err);
                fallbackCopy();
            }
        } else {
            // Se o Clipboard API não estiver disponível usa a função fallback
            fallbackCopy();
        }
    };

    // Função de fallback para copiar o texto usando execCommand (funciona no navegador)
    const fallbackCopy = () => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            const successful = document.execCommand("copy");
            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 500);
            } else {
                console.error("Erro ao copiar com execCommand");
            }
        } catch (err) {
            console.error("Erro ao tentar copiar:", err);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    return (
        <div onClick={handleCopy} className="cursor-pointer text-gray-950 select-none flex items-center justify-center gap-2 text-center transition-ors duration-200">
            {copied ? (
                <p className="text-gray-950 dark:text-gray-300">
                    <i className="fa-solid fa-check text-red-700" /> Copiado!
                </p>
            ) : (
                <p className="text-gray-950 dark:text-gray-300">
                    <i className="fa-solid fa-copy text-gray-500" /> {text}
                </p>
            )}
        </div>
    );
}
