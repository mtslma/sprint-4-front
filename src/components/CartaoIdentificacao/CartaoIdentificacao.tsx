"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type PresentationCardProps = {
    name: string;
};

export default function CartaoIdentificacao({ name }: PresentationCardProps) {
    const [flipped, setFlipped] = useState(false);

    const textStyle = "font-bold text-gray-300";
    const subTextStyle = "-mt-1 text-red-700 text-xs opacity-75 font-bold";

    return (
        <div className={`transition-shadow duration-300 w-[340px] md:w-[440px] h-[220px] rounded-xl perspective cursor-pointer`} onClick={() => setFlipped(!flipped)}>
            <div className={`relative w-full h-full transition-transform duration-500 ease-in-out transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
                {/* Frente do cartão */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tl from-zinc-900 via-slate-800 to-stone-900 rounded-xl flex flex-col overflow-hidden backface-hidden">
                    <div className="bg-red-900 h-8 w-full text-gray-100 font-bold flex items-center justify-center">CARTÃO DE IDENTIFICAÇÃO</div>

                    <div className="flex p-4 gap-6 w-full">
                        <div className="flex flex-col">
                            <p className="text-md font-bold text-center my-1 rounded-lg text-gray-900 bg-gray-400">ALUNO</p>
                            {/* Conteúdo principal da frente */}
                            {/* Seção da foto e etiqueta "ALUNO" */}
                            <div className="flex flex-col items-center">
                                <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden shadow-md border-2 border-gray-600/70">
                                    <Image
                                        src="/images/mtslma.png" // Caminho da imagem (certifique-se que existe na pasta public)
                                        alt={`Foto de ${name}`}
                                        layout="fill"
                                        objectFit="cover"
                                        priority // Carrega a imagem com prioridade se for importante para LCP
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div>
                                <p className={textStyle}>FIAP</p>
                                <p className={subTextStyle}>INSTITUIÇÃO</p>
                            </div>
                            <div>
                                <p className={textStyle}>{name}</p>
                                <p className={subTextStyle}>NOME</p>
                            </div>

                            <div className="flex gap-8 md:gap-16">
                                <div className="w-1/2">
                                    <p className={textStyle}>559728</p>
                                    <p className={subTextStyle}>RM</p>
                                </div>
                                <div className="w-1/2">
                                    <p className={textStyle}>06/26</p>
                                    <p className={subTextStyle}>VALIDADE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!flipped ? (
                        <div className="absolute bottom-2 right-2 z-20 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm flex items-center gap-1 animate-pulse pointer-events-none">
                            <i className="fa-solid fa-hand-pointer" />
                            <span>Contatos no verso</span>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>

                {/* Verso do cartão */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tl from-zinc-900 via-slate-800 to-stone-900 rounded-xl flex flex-col overflow-hidden backface-hidden transform rotate-y-180">
                    <div className="bg-red-900 h-8 w-full text-gray-100 font-bold flex items-center justify-center">INFORMAÇÕES EXTRAS</div>

                    <div className="flex p-4 gap-6 h-full items-center justify-start">
                        {/* Infos de contato */}
                        <div className="ml-6 flex flex-col gap-2">
                            <div className="grid-cols-2">
                                {/* Github */}
                                <div>
                                    <Link className="font-bold text-gray-300 hover:underline" href={"https://github.com/mtslma"} target="_blank" onClick={(e) => e.stopPropagation()}>
                                        <i className="fa-brands fa-github"></i> /mtslma
                                    </Link>
                                    <p className={subTextStyle}>GITHUB</p>
                                </div>
                                {/* Linkedin */}
                                <div>
                                    <Link className="font-bold text-gray-300 hover:underline" href={"https://www.linkedin.com/in/mtslma/"} target="_blank" onClick={(e) => e.stopPropagation()}>
                                        <i className="fa-brands fa-linkedin"></i> /mtslma
                                    </Link>
                                    <p className={subTextStyle}>LINKEDIN</p>
                                </div>
                                {/* Email */}
                                <div className="w-1/2">
                                    <p className="font-bold text-gray-300">devmtslma@email.com</p>
                                    <p className={subTextStyle}>EMAIL</p>
                                </div>
                            </div>
                        </div>

                        {/* Emoji grandão */}
                        <div className="text-8xl md:ml-12 hover:animate-wiggle">
                            <i className="fa-solid fa-lemon bg-gradient-to-tr from-amber-400 via-yellow-200 to-yellow-400 text-transparent bg-clip-text"></i>
                        </div>
                    </div>

                    <div className="bg-gray-400 text-gray-900 h-4 w-full text-center text-xs font-bold">© 2025 FIAP — USO INTERNO</div>
                </div>
            </div>
        </div>
    );
}
