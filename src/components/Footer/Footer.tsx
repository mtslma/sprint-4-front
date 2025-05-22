import Link from "next/link";

export default function Footer() {
    return (
        <footer className="text-sm flex items-center justify-center bg-slate-50 dark:bg-black border-t border-gray-500 p-2">
            <p className="text-neutral-950 dark:text-gray-200 font-bold">
                <span className="text-red-700">Challenge CCR </span> |{" "}
                <Link href={"/integrantes"} className="hover:underline">
                    Integrantes do grupo
                </Link>
            </p>
        </footer>
    );
}
