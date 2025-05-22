import { FilterButtonProps, SearchBarProps } from "@/types/props";
import React, { useState } from "react";

// Componente que representa um botão de filtro individual
export function FilterButton({ label, valor, activeFilter, onClick }: FilterButtonProps) {
    return (
        <button onClick={() => onClick(valor)} className={`${activeFilter === valor ? "bg-red-700 text-white" : "bg-gray-300 dark:bg-gray-800"} px-4 py-1 rounded-lg hover:bg-red-800 hover:text-white transition-all min-w-24 md:w-28`}>
            {label} {/* Texto exibido no botão, como "Nome", "Descrição", etc */}
        </button>
    );
}

// Componente da barra de pesquisa principal com suporte a filtros
export default function SearchBar({ filtros, onFiltrar }: SearchBarProps) {
    const [inputValue, setInputValue] = useState<string>(""); // Valor atual do campo de texto
    const [activeFilter, setActiveFilter] = useState<string | null>(`${filtros[0].valor}`); // Filtro selecionado (ex: nome, descrição)

    // Função chamada ao digitar algo no campo de pesquisa
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInputValue(value);

        if (activeFilter) {
            onFiltrar(activeFilter, value); // Chama o filtro com o valor atual do input
        }
    };

    // Função chamada ao trocar o filtro (ex: de nome para descrição)
    const handleFilterChange = (filtro: string) => {
        setActiveFilter(filtro);
        setInputValue(""); // Limpa o campo de texto ao trocar o filtro
        onFiltrar(filtro, ""); // Aplica o novo filtro com valor vazio
    };

    return (
        <div className="w-full md:w-full max-w-xl mx-auto mt-2 mb-6 px-4 ">
            {/* Campo de entrada de texto para busca */}
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Pesquisar..." className="w-full p-2 border border-gray-300 rounded-2xl mb-4 focus:outline-none focus:ring-0" />

            <div className="flex flex-col md:flex-row gap-4 items-center justify-around">
                <p>Filtrar pesquisa por:</p>

                {/* Botões de filtros disponíveis (ex: Nome, Descrição, Nível) */}
                <div className="flex flex-row justify-center text-center items-center gap-2 sm:gap-6">
                    {filtros.map((filtro) => (
                        <FilterButton key={filtro.valor} label={filtro.label} valor={filtro.valor} activeFilter={activeFilter} onClick={handleFilterChange} />
                    ))}
                </div>
            </div>
        </div>
    );
}
