type AlertPopupProps = {
    message: string;
    type?: "success" | "error" | "info";
    isVisible: boolean;
    onClose: () => void;
};

export default function AlertPopup({ message, type = "info", isVisible, onClose }: AlertPopupProps) {
    if (!isVisible) return null;

    const typeStyles = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
    };

    return (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded text-white shadow z-50 ${typeStyles[type]}`}>
            <div className="flex items-center justify-between gap-4">
                <span>{message}</span>
                <button onClick={onClose} className="font-bold ml-4">
                    ×
                </button>
            </div>
        </div>
    );
}
