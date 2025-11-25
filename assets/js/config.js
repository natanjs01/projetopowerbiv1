// =====================================================
// CONFIGURAÇÃO DO SUPABASE
// =====================================================

// IMPORTANTE: Substitua pelas suas credenciais do Supabase
// Encontre em: Seu Projeto > Settings > API

const SUPABASE_URL = 'SUA_URL_DO_SUPABASE_AQUI';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';

// Exemplo:
// const SUPABASE_URL = 'https://xxxxxxxxxxx.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// =====================================================
// CONFIGURAÇÕES DO SISTEMA
// =====================================================

const APP_CONFIG = {
    nome: 'BI Portal Secure',
    versao: '1.0.0',
    senhaMinLength: 8,
    senhaDeveConter: {
        maiuscula: true,
        minuscula: true,
        numero: true,
        especial: true
    },
    sessaoTimeout: 3600000, // 1 hora em millisegundos
    logAcoes: true
};

// =====================================================
// CONFIGURAÇÕES DO POWER BI
// =====================================================

const POWERBI_CONFIG = {
    baseUrl: 'https://app.powerbi.com/reportEmbed',
    ctid: '9b7f8a4a-312e-4ce9-9391-103c1c9a32a1', // Seu Tenant ID
    autoAuth: true,
    allowFullScreen: true
};

// =====================================================
// MENSAGENS DO SISTEMA
// =====================================================

const MENSAGENS = {
    erro: {
        loginInvalido: 'Email ou senha incorretos',
        emailInvalido: 'Email inválido',
        senhaFraca: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais',
        senhasNaoCoincidem: 'As senhas não coincidem',
        camposObrigatorios: 'Preencha todos os campos obrigatórios',
        erroGenerico: 'Ocorreu um erro. Tente novamente.',
        semPermissao: 'Você não tem permissão para acessar esta página',
        sessaoExpirada: 'Sua sessão expirou. Faça login novamente.'
    },
    sucesso: {
        loginSucesso: 'Login realizado com sucesso!',
        senhaTrocada: 'Senha alterada com sucesso!',
        usuarioCriado: 'Usuário criado com sucesso!',
        relatorioAdicionado: 'Relatório adicionado com sucesso!',
        permissaoAtualizada: 'Permissões atualizadas com sucesso!',
        senhaResetada: 'Senha resetada. Nova senha: {senha}'
    },
    info: {
        carregando: 'Carregando...',
        processando: 'Processando...',
        aguarde: 'Aguarde...'
    }
};

// =====================================================
// VALIDAÇÕES
// =====================================================

const VALIDACOES = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    senhaForte: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    somenteLetras: /^[A-Za-zÀ-ÿ\s]+$/,
    reportId: /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i
};

// =====================================================
// EXPORTAR CONFIGURAÇÕES
// =====================================================

// Verificar se as credenciais foram configuradas
if (SUPABASE_URL === 'SUA_URL_DO_SUPABASE_AQUI' || SUPABASE_ANON_KEY === 'SUA_CHAVE_ANONIMA_AQUI') {
    console.warn('⚠️ ATENÇÃO: Configure as credenciais do Supabase no arquivo config.js!');
}
