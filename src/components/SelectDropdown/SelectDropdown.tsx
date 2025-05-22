import { useState } from "react";

export default function SelectDropdown(props: { label: string; options: { label: string; value: string }[]; onChange: (valor: string) => void }) {
    const { label, options, onChange } = props;
    const [selected, setSelected] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const valor = e.target.value;
        setSelected(valor);
        onChange(valor);
    };

    return (
        <div className="w-2/3 min-w-84 md:max-w-[400px]">
            <select value={selected} onChange={handleChange} className="py-2 px-4 w-full rounded-lg shadow-sm bg-white border dark:bg-gray-300 border-gray-400 dark:text-gray-950 text-gray-700 text-lg focus:outline-none focus:ring focus:ring-gray-950">
                <option value="">{label}</option>
                {options.map((opcao, i) => (
                    <option key={i} value={opcao.value}>
                        {opcao.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
