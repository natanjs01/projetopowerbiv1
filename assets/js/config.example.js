// ⚙️ CONFIGURAÇÕES DO BI PORTAL SECURE
// 
// ⚠️ IMPORTANTE: Este é um arquivo de EXEMPLO!
// 
// ANTES DE USAR:
// 1. Copie este arquivo para: config.js
// 2. Substitua os valores de exemplo pelas suas credenciais reais do Supabase
// 3. NÃO COMITE o arquivo config.js no Git!
//
// Como obter as credenciais:
// 1. Acesse https://supabase.com/dashboard
// 2. Selecione seu projeto
// 3. Vá em Settings > API
// 4. Copie a URL e a chave anônima (anon/public)

// ==========================================
// SUPABASE - Banco de Dados
// ==========================================
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SUA_CHAVE_AQUI';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// POWER BI - Configurações
// ==========================================
const POWERBI_CONFIG = {
    tenantId: '9b7f8a4a-312e-4ce9-9391-103c1c9a32a1', // Seu Tenant ID do Power BI
    embedUrl: 'https://app.powerbi.com/reportEmbed'
};

// ==========================================
// APLICAÇÃO - Configurações Gerais
// ==========================================
const APP_CONFIG = {
    nome: 'BI Portal Secure',
    versao: '1.0.0',
    sessionKey: 'bi_portal_sessao'
};

// ==========================================
// VALIDAÇÕES
// ==========================================
const VALIDACOES = {
    senhaMinima: 8,
    senhaRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// ==========================================
// MENSAGENS DO SISTEMA
// ==========================================
const MENSAGENS = {
    loginSucesso: 'Login realizado com sucesso!',
    loginErro: 'Email ou senha incorretos',
    senhaTrocada: 'Senha alterada com sucesso!',
    senhaFraca: 'Senha muito fraca. Use letras maiúsculas, minúsculas, números e caracteres especiais',
    usuarioInativo: 'Usuário inativo. Entre em contato com o administrador',
    sessaoExpirada: 'Sessão expirada. Faça login novamente',
    erroGenerico: 'Ocorreu um erro. Tente novamente'
};
