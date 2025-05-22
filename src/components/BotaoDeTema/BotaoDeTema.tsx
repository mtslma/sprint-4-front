import { useEffect } from "react";

// Propriedades que serão passadas para o botão
type ThemeButtonProps = {
    lightModeActive: boolean;
    setLightModeActive: (state: boolean) => void;
};

// Botão para alterar o tema, é utilizado no header
export function BotaoDeTema({ lightModeActive, setLightModeActive }: ThemeButtonProps) {
    // Função para alterar o tema
    const toggleTheme = () => {
        const isLight = !lightModeActive; // Verificar se não está no tema claro
        const newTheme = isLight ? "light" : "dark";
        // Altera a classe no body para que ele aplique as formatações do :ark
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        setLightModeActive(isLight);
        // Salva a informação no localStorage
        localStorage.setItem("theme", newTheme);
    };

    // Use effect que carrega o tema quando a página é carregada
    useEffect(() => {
        // Função para caregar o tema que busca no localStorage a preferência que está armazenada
        function loadTheme() {
            if (typeof window !== undefined) {
                const savedTheme = localStorage.getItem("theme") || "light";
                document.documentElement.classList.toggle("dark", savedTheme === "dark");
                setLightModeActive(savedTheme === "light");
            }
        }
        // Chama a função que executa a lógica e define o tema
        loadTheme();
    }, [setLightModeActive]);
    return (
        // Caso o tema seja claro, exibe o ícone de lua com cor escura, caso contrário, um sol com cor clara
        <button onClick={toggleTheme} className={`hover:cursor-pointer text-2xl ${lightModeActive ? "text-gray-950" : "text-gray-300"}`}>
            <i className={`fa-solid  fa-${lightModeActive ? "moon" : "sun"}`} />
        </button>
    );
}
