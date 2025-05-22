import { useEffect, useRef } from "react";
import LinkGroupIndicator from "../GrupoLink/GrupoLink";
import { LinkNavegacao } from "../LinkNavegacao/LinkNavegacao";

export default function Navbar(props: { menuOpen: boolean; setMenuOpen: (value: boolean) => void; toggleMenuState: () => void }) {
    // Estados do menu
    const { menuOpen, setMenuOpen, toggleMenuState } = props;

    // Buscando o element da sidebar na página
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Use effect usado para verificar se o menu está aberto ou nao
    useEffect(() => {
        // Detectando cliques "fora" da barra de navegação
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        // Se o menu estiver aberto ele coloca um listener para detectar cliques e chama a função que verificar a lógica
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        // Por padrão ele deixa o listener "desativado"
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen, setMenuOpen]);

    // Lista de links que será exibida na navegação
    const listaDeLinks = (
        <>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/"} iconName={"home"}>
                Início
            </LinkNavegacao>
            {/* Links de explorar funcionalidades principais */}
            <LinkGroupIndicator>Explorar</LinkGroupIndicator>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/alertas"} iconName={"triangle-exclamation"}>
                Alertas
            </LinkNavegacao>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/linhas"} iconName={"road"}>
                Linhas
            </LinkNavegacao>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/estacoes"} iconName={"sign-hanging"}>
                Estações
            </LinkNavegacao>

            {/* Links de ajuda */}
            <LinkGroupIndicator>Ajuda</LinkGroupIndicator>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/aumo"} iconName={"robot"}>
                Aumo+
            </LinkNavegacao>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/sobre"} iconName={"circle-info"}>
                Sobre
            </LinkNavegacao>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/suporte"} iconName={"headset"}>
                Suporte
            </LinkNavegacao>
            <LinkGroupIndicator>Outro</LinkGroupIndicator>
            <LinkNavegacao toggleMenu={toggleMenuState} href={"/login"} iconName={"user-tie"}>
                Colaboradores
            </LinkNavegacao>
        </>
    );

    return (
        <>
            {/* Navegação para dispositivos maiores */}
            <nav className="hidden md:flex md:flex-wrap lg:grid lg:grid-cols-4 lg:gap-2 xl:flex xl:flex-wrap items-center justify-center-safe px-2 gap-4">{listaDeLinks}</nav>

            {/* Navegação para dispositivos mobile */}
            <aside className={`w-[240px] md:hidden fixed top-0 left-0 h-full z-50 bg-slate-50 dark:bg-black border-r border-gray-600 transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`} ref={sidebarRef}>
                <div className="flex flex-col gap-4 p-4">
                    {/* Botão para abrir e fechar o menu */}
                    <button onClick={toggleMenuState} className="group text-2xl w-full border rounded-xl text-start px-4 hover:cursor-pointer">
                        <p className="text-xl inline-flex items-center gap-4 ">
                            <i className="fa-solid fa-arrow-left text-xl group-hover:text-red-700" />
                            <span className="group-hover:underline">Fechar</span>
                        </p>
                    </button>
                    {/* Chamando a lista de menus */}
                    <span className="w-full border border-slate-950" />
                    {listaDeLinks}
                </div>
            </aside>
        </>
    );
}
