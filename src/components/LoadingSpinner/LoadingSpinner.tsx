export default function LoadingSpinner({ size }: { size: number }) {
    return <div style={{ width: size, height: size }} className="border-4 border-t-red-600 border-gray-200 rounded-full animate-spin" />;
}
