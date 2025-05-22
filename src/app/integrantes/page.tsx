import PageTitle from "@/components/PageTitle/PageTitle";
import CartaoIdentificacao from "@/components/CartaoIdentificacao/CartaoIdentificacao";

export default function Alertas() {
    return (
        <main className="page-layout ">
            <PageTitle iconName={"person"}>Integrantes</PageTitle>

            <div className="mt-4 w-full md:w-1/2 flex items-center flex-col ">
                <p className=" md:px-32 text-xl w-auto text-center my-8">
                    O <span className="custom-gradient font-bold">Autorail Monitor</span> foi idealizado, projetado e desenvolvido por Mateus da Silveira Lima
                </p>

                {/* Chamando o componente do cartão de identificação */}
                <CartaoIdentificacao name={"Mateus da Silveira Lima"}></CartaoIdentificacao>
            </div>
        </main>
    );
}
