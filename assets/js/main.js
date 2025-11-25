// =====================================================
// FUNÇÕES AUXILIARES GERAIS
// =====================================================

/**
 * Mostra notificação para o usuário
 * @param {string} mensagem - Mensagem a exibir
 * @param {string} tipo - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duracao - Duração em ms
 */
function mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    // Adicionar ao body
    document.body.appendChild(notificacao);
    
    // Animar entrada
    setTimeout(() => notificacao.classList.add('show'), 10);
    
    // Remover após duração
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => document.body.removeChild(notificacao), 300);
    }, duracao);
}

/**
 * Mostra loading
 * @param {boolean} mostrar - true para mostrar, false para ocultar
 */
function mostrarLoading(mostrar = true) {
    let loading = document.getElementById('loading-global');
    
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loading-global';
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Carregando...</p>
        `;
        document.body.appendChild(loading);
    }
    
    loading.style.display = mostrar ? 'flex' : 'none';
}

/**
 * Formata data para exibição
 * @param {string} dataISO - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatarData(dataISO) {
    if (!dataISO) return '-';
    
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Formata data sem hora
 * @param {string} dataISO - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatarDataSimples(dataISO) {
    if (!dataISO) return '-';
    
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
}

/**
 * Valida email
 * @param {string} email - Email para validar
 * @returns {boolean}
 */
function validarEmail(email) {
    return VALIDACOES.email.test(email);
}

/**
 * Valida força da senha
 * @param {string} senha - Senha para validar
 * @returns {Object} Resultado da validação
 */
function validarForcaSenha(senha) {
    const resultado = {
        valida: true,
        erros: []
    };
    
    if (senha.length < APP_CONFIG.senhaMinLength) {
        resultado.valida = false;
        resultado.erros.push(`Mínimo ${APP_CONFIG.senhaMinLength} caracteres`);
    }
    
    if (APP_CONFIG.senhaDeveConter.maiuscula && !/[A-Z]/.test(senha)) {
        resultado.valida = false;
        resultado.erros.push('Pelo menos 1 letra maiúscula');
    }
    
    if (APP_CONFIG.senhaDeveConter.minuscula && !/[a-z]/.test(senha)) {
        resultado.valida = false;
        resultado.erros.push('Pelo menos 1 letra minúscula');
    }
    
    if (APP_CONFIG.senhaDeveConter.numero && !/[0-9]/.test(senha)) {
        resultado.valida = false;
        resultado.erros.push('Pelo menos 1 número');
    }
    
    if (APP_CONFIG.senhaDeveConter.especial && !/[@$!%*?&#]/.test(senha)) {
        resultado.valida = false;
        resultado.erros.push('Pelo menos 1 caractere especial (@$!%*?&#)');
    }
    
    return resultado;
}

/**
 * Confirmar ação com o usuário
 * @param {string} mensagem - Mensagem de confirmação
 * @returns {boolean} true se confirmou
 */
function confirmar(mensagem) {
    return confirm(mensagem);
}

/**
 * Copia texto para área de transferência
 * @param {string} texto - Texto para copiar
 */
async function copiarParaClipboard(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        mostrarNotificacao('Copiado!', 'success', 1500);
    } catch (error) {
        console.error('Erro ao copiar:', error);
    }
}

/**
 * Sanitiza HTML para prevenir XSS
 * @param {string} texto - Texto para sanitizar
 * @returns {string} Texto sanitizado
 */
function sanitizarHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Debounce para funções
 * @param {Function} func - Função para executar
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Popula select com opções
 * @param {string} selectId - ID do select
 * @param {Array} opcoes - Array de opções
 * @param {string} valorKey - Chave para o valor
 * @param {string} textoKey - Chave para o texto
 */
function popularSelect(selectId, opcoes, valorKey = 'id', textoKey = 'nome') {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione...</option>';
    
    opcoes.forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao[valorKey];
        option.textContent = opcao[textoKey];
        select.appendChild(option);
    });
}

/**
 * Limpa formulário
 * @param {string} formId - ID do formulário
 */
function limparFormulario(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Atualiza informações do usuário na interface
 */
function atualizarInfoUsuario() {
    const usuario = obterSessao();
    if (!usuario) return;
    
    // Atualizar elementos comuns
    const nomeElements = document.querySelectorAll('.usuario-nome');
    nomeElements.forEach(el => el.textContent = usuario.nome);
    
    const setorElements = document.querySelectorAll('.usuario-setor');
    setorElements.forEach(el => el.textContent = usuario.setor);
    
    const emailElements = document.querySelectorAll('.usuario-email');
    emailElements.forEach(el => el.textContent = usuario.email);
}

/**
 * Inicialização comum para todas as páginas
 */
function inicializarPagina() {
    // Atualizar info do usuário
    atualizarInfoUsuario();
    
    // Configurar botão de logout
    const btnLogout = document.querySelectorAll('.btn-logout');
    btnLogout.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirmar('Deseja realmente sair?')) {
                fazerLogout();
            }
        });
    });
}

// Executar ao carregar qualquer página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarPagina);
} else {
    inicializarPagina();
}
