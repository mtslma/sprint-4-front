// Pegando os requisitos do react-hook-form
import { FieldErrors, SubmitHandler, UseFormRegister } from "react-hook-form";

// O nome dos tipos tem que bater com o que está na API

// Informações que serão passadas ao realizar login
export interface loginBody {
    email: string;
    senha: string;
};

// Informações de colaborador
export interface colaboradorBody {
    id: string;
    dataCriacao: string;
    nomeColaborador: string;
    tipoColaborador: string;
}

// Informações para registrar colaborador
export interface registrarColaboradorBody {
    nomeColaborador: string,
    tipoColaborador: string,
    autenticaColaborador: {
        email: string,
        senha: string,
    }
}

// Informações de sessão
export interface sessaoBody {
    tokenSessao: string;
    statusSessao: string;
    dataLogin: string;
    colaboradorResponseDto: colaboradorBody;
}

// Informações de alertas
export interface alertaBody {
    id: string;
    deleted: boolean;
    dataCriacao: string;
    dataEncerramento: string;
    nomeAlerta: string;
    descricaoAlerta: string;
    nivelGravidade: string;
    idLinha: string;
    idEstacao: string;
}

// Informações de mensagens de contato
export interface msContatoBody {
    id: string;
    deleted: boolean;
    dataCriacao: string;
    nome: string;
    email: string;
    mensagem: string;
}

// Informações das linhas
export interface linhaBody {
    id: string;
    deleted: boolean;
    nomeLinha: string;
    numeroLinha: string;
    statusLinha: string;
    dataCriacao: string;
}

// Informações para atualizar apenas o status da linha
export interface atualizarStatusBody {
    id: string;
    status: string;
}

// Informações de estação
export interface estacaoBody {
    id: string;
    idLinha: string;
    deleted: string;
    dataCriacao: string;
    nomeEstacao: string;
    statusEstacao: string;
    inicioOperacao: string;
    fimOperacao: string;
}

// Informações para atualizar apenas o status da estação
export interface statusLinhaBody {
    id: string;
    statusEstacao: string;
}

// Propriedades da SearchBar
export interface SearchBarProps {
    filtros: { label: string; valor: string }[]; // Lista de filtros dinâmicos
    onFiltrar: (filtro: string, valor: string) => void;
}

export interface FilterButtonProps {
    label: string;
    valor: string;
    activeFilter: string | null;
    onClick: (filtro: string) => void;
}

// Informações para registrar alerta (formulário)
export interface registrarAlertaBody {
    nomeAlerta: string;
    descricaoAlerta: string;
    nivelAlerta: string;
    idEstacao: string;
    idLinha: string;
};

// Informações para registrar manutenção
export interface manutencaoBody {
    id: string;
    nomeManutencao: string;
    descricaoManutencao: string;
    nivelPrioridade: string;
    idLinha: string;
    idEstacao: string;
}

export interface ContactItemProps {
    iconClass: string; 
    title: string; 
    value: string; 
    description: string; 
};


// OS TIPOS ABAIXO SÃO RELACIONADOS À FORMULÁRIOS, SEJAM ELES DE STATUS, REGISTRO OU EDIÇÃO

// FORMULÁRIOS DE STATUS

// Propriedades de status gerais
export interface StatusFormProps {
    title: string;
    items: { id: string; nome: string }[];
    register: UseFormRegister<atualizarStatusBody>;
    errors: FieldErrors<atualizarStatusBody>;
    onSubmit: () => void;
    type: "linha" | "estacao"; // Como o formulário é usado para dois outros componentes é preciso passar o tipo para definir o que será passado
}

// Formulário de status de linhas
export interface LinhaStatusFormProps {
    linhas: linhaBody[];
    onSubmit: (data: atualizarStatusBody) => Promise<void>;
}

// FORMULÁRIOS DE REGISTRO

// Formulário para registar alertas
export interface FormAlertasProps {
    linhas: linhaBody[];
    estacoes: estacaoBody[];
    onSubmit: SubmitHandler<registrarAlertaBody>;
    defaultValues?: registrarAlertaBody;
};

// Formulário para registrar colaborador
export interface FormColaboradorProps {
    onSubmit: SubmitHandler<registrarColaboradorBody>;
    defaultValues?: registrarColaboradorBody;
};

// Formulário para registrar estações
export interface FormEstacaoProps {
    linhas: linhaBody[];
    onSubmit: SubmitHandler<estacaoBody>;
    defaultValues?: estacaoBody;
};

// Formulário para registrar linhas
export interface FormLinhasProps {
    onSubmit: SubmitHandler<linhaBody>;
    defaultValues?: linhaBody;
};


// Formulário para registrar manutenções
export interface FormManutencaoProps {
    linhas: linhaBody[];
    estacoes: estacaoBody[];
    onSubmit: SubmitHandler<manutencaoBody>;
    defaultValues?: manutencaoBody;
};

// Formulário para registrar mensagens de contato
export interface FormMensagemContatoProps {
    onSubmit: (data: msContatoBody) => void;
}

// FORMULÁRIOS DE EDIÇÃO

// Formulário de edição de alertas
export interface FormEditarAlerta {
    alerta?: alertaBody | null;
    estacoes: estacaoBody[];
    linhas: linhaBody[];
    onSubmit: (data: registrarAlertaBody) => void;
}

// Formulário de edição de colaborador
export interface FormEditarColaborador {
    colaborador?: colaboradorBody | null;
    onSubmit: (data: colaboradorBody) => void;
}

// Formulário de edição de estações
export interface FormEditarEstacao {
    estacao?: estacaoBody | null;
    linhas: linhaBody[];
    onSubmit: (data: estacaoBody) => void;
}

// Formulário de edição de linhas
export interface FormEditarLinha {
    linha?: linhaBody | null;
    onSubmit: (data: linhaBody) => void;
}

// Formulário de edição de estações
export interface FormEditarManutencao {
    manutencao?: manutencaoBody | null;
    linhas: linhaBody[];
    estacoes: estacaoBody[];
    onSubmit: (data: manutencaoBody) => void;
}


// TIPOS USADO PARA A PÁGINA DE CHATBOT

export interface ChatMessage {
    sender: "user" | "bot";
    message: string;
};

export interface WatsonGenericResponse {
    response_type: string;
    text?: string;
};