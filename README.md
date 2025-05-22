# Challenge CCR – Sprint 4
## Front End Design Engineering

---

## Descritivo do Projeto

Gerenciar a operação de múltiplos trens em diversas linhas e estações, com intervalos curtos para manutenção, exige organização, transparência e eficiência na tomada de decisões. O **Autorail Monitor** é uma plataforma integrada desenvolvida para auxiliar tanto o CCO (Centro de Controle Operacional) e seus colaboradores quanto os passageiros, oferecendo uma gestão inteligente de alertas e status de serviços nas linhas 8 e 9 do transporte metropolitano.

Essa solução promove maior controle e comunicação eficiente entre as equipes internas e o público, garantindo um sistema mais seguro, transparente e responsivo.

---

## Funcionalidades do Sistema

### Para Administradores

* **Registro e gerenciamento de alertas:** Histórico completo de alertas encerrados para consulta e análise.
* **Classificação de alertas por gravidade:** Permite melhor priorização e resposta a incidentes, com foco nos mais críticos.
* **Atualização do status operacional de serviços:** Modificação em tempo real das condições das linhas e estações com base nas ocorrências e restrições.
* **Rede de comunicação com clientes:** Por meio de mensagens de suporte e feedbacks fornecidos, valiosos para entender no que investir para agradar o consumidor.

### Para Passageiros

* **Consulta simplificada de alertas e status de serviços:** Informações atualizadas sobre o serviço, permitindo o planejamento eficiente da viagem.
* **Acesso a canais de suporte dos serviços:** Um canal de comunicação simples e direto para fornecer feedbacks e tirar dúvidas por meio de mensagem.
* **Chatbot AUMO+:** Um assistente virtual interativo acessível via site que auxilia usuários.

---


## Repositórios Github

* **Repositório API Java:** [https://github.com/mtslma/aumo-api](https://github.com/mtslma/aumo-api)

---

## APIs

Durante os testes da aplicação, acabei consumindo quase todos os créditos do deploy gratuito da matéria de Java.
Por esse motivo, existem **3 URLs de APIs** que podem ser acessadas, todas com as mesmas funcionalidades, apenas para garantir backup e disponibilidade dos serviços.

* **API Principal:** `https://aumo-api-production.up.railway.app`

* **BACKUPS (substituir API_BASE em `services/config.ts`):**
    * **Backup 1:** `https://backup-aumo-api-production.up.railway.app/`
    * **Backup 2:** `https://aumo-api.onrender.com`

---

## Chabot

Esse repositório não contém as informações necessárias para utilizar o chatbot da IBM. É necessário utilizar suas próprias credenciais.

---
## Deploy Vercel

O deploy da aplicação Front-End está disponível em: ATUALIZAR ISSO AQUI

---

## Execução do Projeto

Para rodar o projeto localmente, siga os passos abaixo:

1.  **Clone o repositório Front-End:**
    ```bash
    git clone https://github.com/mtslma/front-sprint-4
    cd front-sprint-4
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure a API_BASE:**
    * Abra o arquivo `services/config.ts`.
    * Altere os valores com suas credenciais de API da IBM com Watson Assistant.
        ```typescript
        // services/chatbot.ts
         export const CHATBOT_ASSISTANT_ID = "";
         export const CHATBOT_API_KEY = "";
         export const CHATBOT_SERVICE_URL = "";
        ```
        
4.  **Configure as credneciais do Chatbot:**
    * Abra o arquivo `services/config.ts`.
    * Altere o valor de `API_BASE` para uma das URLs da API fornecidas acima. Por exemplo:
        ```typescript
        // services/config.ts
        export const API_BASE = "[https://aumo-api-production.up.railway.app](https://aumo-api-production.up.railway.app)";
        export const API_KEY = "sua-chave-api-aqui"; // Certifique-se de ter sua chave API configurada
        ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

6.  Abra seu navegador e acesse `http://localhost:3000` (ou a porta indicada pelo terminal).

Agora o projeto deverá estar rodando em sua máquina local!
