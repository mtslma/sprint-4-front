import Link from "next/link";
type PageLinkProps = {
    href: string;
    children: React.ReactNode;
};

export default function PageLink({ href, children }: PageLinkProps) {
    return (
        <Link href={href} className="text-xl font-bold text-gray-200 bg-red-700 border-2 border-red-800 dark:border-red-800 hover:bg-red-800 dark:hover:bg-red-900 px-8 py-2 rounded-lg shadow-xl">
            {children}
        </Link>
    );
}
