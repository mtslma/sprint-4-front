import { ContactItemProps } from "@/types/props";
import CopyableText from "../TextoCopiavel/TextoCopiavel";

export default function MensagemDeContato({ iconClass, title, value, description }: ContactItemProps) {
    return (
        <div className="mb-6">
            <h3 className="custom-gradient text-xl md:text-2xl font-bold text-center text-red-700 mb-2">
                <i className={iconClass} /> {title}
            </h3>
            <span className="text-xl font-bold block text-center">
                <CopyableText text={value} />
            </span>
            <p className="text-sm text-gray-500 text-center">{description}</p>
        </div>
    );
}
