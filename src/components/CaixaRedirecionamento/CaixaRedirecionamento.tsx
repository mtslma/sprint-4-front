import Link from "next/link";

// Tipagem das propriedades do alerta
type AlertBoxProps = {
    titulo: string;
    iconName: string;
    href: string;
};

// Caixa de alerta
export function CaixaRedirecionamento({ titulo, iconName, href }: AlertBoxProps) {
    return (
        <>
            <div className="relative group w-40 h-30 md:w-[320px] md:h-28 text-center flex items-center justify-center rounded-xl border hover:bg-gray-200 hover:dark:bg-slate-950">
                <Link className="w-full h-full flex flex-col items-center justify-center divide gap-4" href={href}>
                    <i className={`fa-solid fa-${iconName} text-3xl md:text-4xl group-hover:text-rose-700`}></i>
                    <h3 className="text-sm md:text-xl group-hover:underline font-bold text-center px-1">{titulo}</h3>
                </Link>
            </div>
        </>
    );
}
