"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BotaoDeTema } from "../BotaoDeTema/BotaoDeTema";
import Navbar from "../Navbar/Navbar";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [lightModeActive, setLightModeActive] = useState(false);

    // Função para abrir/ fechar menu, altera o state salvo
    function toggleMenuState() {
        setMenuOpen(!menuOpen);
    }

    return (
        <header className="max-w-screen flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-black border-b">
            {/* Botão para abrir a navbar, aparece apenas no no mobile */}
            <button className="md:hidden hover:cursor-pointer" onClick={toggleMenuState}>
                <i className="fa-solid fa-bars text-2xl text-gray-950 dark:text-gray-300" />
            </button>

            {/* Exibindo a logo do site, no tema claro aparece um, no tema escuro outro */}
            <Link href={"/"} className="min-w-[160]">
                <Image src={lightModeActive ? "/images/logo-light.png" : "/images/logo-dark.png"} alt={"Autorail Monitor Logo"} width={160} height={160} />
            </Link>

            {/* Puxando o componente de navbar para a lógica de exibição dos ícones */}
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} toggleMenuState={toggleMenuState}></Navbar>

            {/* Botão para alterar o tema */}
            <BotaoDeTema lightModeActive={lightModeActive} setLightModeActive={setLightModeActive} />
        </header>
    );
}
