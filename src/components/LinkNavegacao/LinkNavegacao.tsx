import Link from "next/link";

// Propriedades  que serão passadas para o link, não quis usar o props: { blablabla: Blabblal } dessa vez
type LinkProps = {
    href: string;
    iconName: string;
    children: React.ReactNode;
    toggleMenu: () => void;
};

// Componente de link que será exibido, passa o endereço, um ícone, children é o texto e toggleMenu é a função para fechar o menu quando ele é clicado
export function LinkNavegacao({ href, iconName, children, toggleMenu }: LinkProps) {
    return (
        <Link onClick={toggleMenu} className="group text-lg text-gray-950 dark:text-gray-300 dark:hover:text-gray-950 border dark:border-gray-700 px-4 rounded-xl hover:bg-gray-300" href={href}>
            <p className="flex items-center justify-start md:justify-center gap-2">
                <i className={`fa-solid fa-${iconName} text-md group-hover:text-red-700`} />
                <span className="group-hover:underline">{children}</span>
            </p>
        </Link>
    );
}
