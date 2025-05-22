type PageTitleProps = {
    iconName: string;
    children: React.ReactNode;
};

export default function PageTitle({ iconName, children }: PageTitleProps) {
    return (
        <h1 className="flex items-center justify-center my-4 text-center gap-3 py-1 px-4 rounded-xl font-bold text-2xl bg-gray-200 dark:bg-gray-700 shadow-md">
            <i className={`fa-solid fa-${iconName} text-red-700`} />
            <p>{children?.toString().toLocaleUpperCase()}</p>
        </h1>
    );
}
