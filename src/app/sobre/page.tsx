import PageTitle from "@/components/PageTitle/PageTitle";

export default function Alertas() {
    return (
        <main className="flex flex-col items-center h-full mb-4 p-4">
            <PageTitle iconName={"circle-info"}>Sobre o projeto</PageTitle>

            {/* Descrição do Projeto */}
            <section className="w-full max-w-2xl md:max-3-xl border p-6 rounded-xl shadow-lg mt-6">
                <h3 className="custom-gradient text-2xl font-bold text-center text-red-700 mb-4">O que é o Autorail Monitor?</h3>
                <p className="text-justify">
                    O <span className="custom-gradient font-bold">Autorail Monitor</span> é uma plataforma criada para otimizar o gerenciamento das operações ferroviárias e a transparência dos serviços oferecidos nas linhas 8 e 9 do transporte metropolitano. A plataforma foi projetada para oferecer maior eficiência na operação, permitindo que tanto os operadores quanto os passageiros acompanhem e
                    gerenciem alertas e a situação de linhas e estações em tempo real.
                </p>
            </section>

            {/* Funcionalidades do Projeto */}
            <section className="w-full max-w-2xl md:max-3-xl border p-6 rounded-xl shadow-lg mt-6">
                <h3 className="text-xl text-center font-bold text-red-700 mb-4">Principais Funcionalidades</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Gestão de alertas em tempo real.</li>
                    <li>Classificação de alertas por gravidade.</li>
                    <li>Atualização de status das linhas e estações.</li>
                    <li>Informações acessíveis para passageiros por meio do website.</li>
                    <li>Suporte eficiente para usuários.</li>
                </ul>
            </section>

            {/* Benefícios para os Usuários */}
            <section className="w-full max-w-2xl md:max-3-xl border p-6 rounded-xl shadow-lg mt-6">
                <h3 className="text-xl text-center font-bold text-red-700 mb-4">Benefícios do Sistema</h3>
                <ul className="list-disc pl-6">
                    <li>Melhora na organização e resposta a incidentes.</li>
                    <li>Transparência no status das operações, aumentando a confiança dos passageiros.</li>
                    <li>Maior agilidade na solução de problemas.</li>
                    <li>Acesso rápido a informações e suporte para todos os usuários.</li>
                </ul>
            </section>

            {/* Conclusão */}
            <section className="w-full max-w-2xl md:max-3-xl border p-6 rounded-xl shadow-lg mt-6">
                <h3 className="text-xl text-center font-bold text-red-700 mb-4">Conclusão</h3>
                <p className="text-justify">
                    O <strong>Autorail Monitor</strong> visa transformar a gestão ferroviária, proporcionando um ambiente mais organizado e transparente, tanto para os operadores quanto para os passageiros, resultando em um serviço mais eficiente e confiável.
                </p>
            </section>
        </main>
    );
}
