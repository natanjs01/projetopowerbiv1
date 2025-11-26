// =====================================================
// SISTEMA DE AUTENTICAÇÃO
// =====================================================

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================================================
// FUNÇÕES DE AUTENTICAÇÃO
// =====================================================

/**
 * Faz login do usuário
 * @param {string} email - Email do usuário
 * @param {string} senha - Senha do usuário
 * @returns {Object} Dados do usuário ou erro
 */
async function fazerLogin(email, senha) {
    try {
        // Chamar função de login SHA256 no banco de dados
        const { data, error } = await supabase
            .rpc('fazer_login_sha256', {
                p_email: email,
                p_senha: senha
            });

        if (error) {
            console.error('Erro ao chamar fazer_login_sha256:', error);
            throw new Error(MENSAGENS.erro.loginInvalido);
        }

        // A função retorna um array, pegar primeiro resultado
        const resultado = Array.isArray(data) ? data[0] : data;

        console.log('Resultado do login:', resultado);

        if (!resultado || !resultado.sucesso) {
            throw new Error(resultado?.mensagem || MENSAGENS.erro.loginInvalido);
        }

        console.log('Login bem-sucedido!');

        // Montar objeto de usuário
        const usuario = {
            id: resultado.usuario_id,
            nome: resultado.nome,
            email: resultado.email,
            tipo_usuario: resultado.tipo_usuario,
            setor: resultado.setor,
            precisa_trocar_senha: resultado.precisa_trocar_senha
        };

        // Registrar log de acesso
        await registrarLog(usuario.id, null, 'LOGIN', { email });

        // Salvar sessão
        salvarSessao(usuario);

        return { sucesso: true, usuario };
    } catch (error) {
        console.error('Erro no login:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Verifica se a senha está correta
 * @param {string} senha - Senha em texto plano
 * @param {string} hash - Hash armazenado
 * @returns {boolean}
 */
async function verificarSenha(senha, hash) {
    try {
        // Usar biblioteca bcrypt.js (incluir no HTML)
        return await bcrypt.compare(senha, hash);
    } catch (error) {
        console.error('Erro ao verificar senha:', error);
        return false;
    }
}

/**
 * Troca a senha do usuário
 * @param {string} usuarioId - ID do usuário
 * @param {string} senhaAtual - Senha atual
 * @param {string} novaSenha - Nova senha
 * @returns {Object} Resultado da operação
 */
async function trocarSenha(usuarioId, senhaAtual, novaSenha) {
    try {
        // Validar nova senha
        if (!VALIDACOES.senhaForte.test(novaSenha)) {
            throw new Error(MENSAGENS.erro.senhaFraca);
        }

        // Chamar função SQL de trocar senha
        const { data, error } = await supabase
            .rpc('trocar_senha_sha256', {
                p_usuario_id: usuarioId,
                p_senha_atual: senhaAtual || null,
                p_nova_senha: novaSenha
            });

        if (error) {
            console.error('Erro ao chamar trocar_senha_sha256:', error);
            throw new Error('Erro ao atualizar senha');
        }

        // A função retorna um array
        const resultado = Array.isArray(data) ? data[0] : data;

        if (!resultado || !resultado.sucesso) {
            throw new Error(resultado?.mensagem || 'Erro ao atualizar senha');
        }

        // Registrar log
        await registrarLog(usuarioId, null, 'TROCA_SENHA', {});

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao trocar senha:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Faz logout do usuário
 */
function fazerLogout() {
    const usuario = obterSessao();
    if (usuario) {
        registrarLog(usuario.id, null, 'LOGOUT', {});
    }
    limparSessao();
    // Detecta se está na pasta admin ou na raiz
    const isAdminPage = window.location.pathname.includes('/admin/');
    window.location.href = isAdminPage ? '../index.html' : 'index.html';
}

// =====================================================
// GERENCIAMENTO DE SESSÃO
// =====================================================

/**
 * Salva sessão do usuário no localStorage
 * @param {Object} usuario - Dados do usuário
 */
function salvarSessao(usuario) {
    const sessao = {
        usuario: {
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            setor: usuario.setor,
            tipo_usuario: usuario.tipo_usuario,
            precisa_trocar_senha: usuario.precisa_trocar_senha
        },
        timestamp: Date.now()
    };
    localStorage.setItem('sessao_bi_portal', JSON.stringify(sessao));
}

/**
 * Obtém sessão atual
 * @returns {Object|null} Dados da sessão
 */
function obterSessao() {
    const sessaoStr = localStorage.getItem('sessao_bi_portal');
    if (!sessaoStr) return null;

    try {
        const sessao = JSON.parse(sessaoStr);
        
        // Verificar se sessão expirou
        const tempoDecorrido = Date.now() - sessao.timestamp;
        if (tempoDecorrido > APP_CONFIG.sessaoTimeout) {
            limparSessao();
            return null;
        }

        return sessao.usuario;
    } catch (error) {
        limparSessao();
        return null;
    }
}

/**
 * Limpa sessão
 */
function limparSessao() {
    localStorage.removeItem('sessao_bi_portal');
}

/**
 * Verifica se usuário está autenticado
 * @returns {boolean}
 */
function estaAutenticado() {
    return obterSessao() !== null;
}

/**
 * Verifica se usuário é admin
 * @returns {boolean}
 */
function ehAdmin() {
    const usuario = obterSessao();
    return usuario && usuario.tipo_usuario === 'admin';
}

/**
 * Redireciona usuário baseado no tipo
 */
function redirecionarPorTipo() {
    const usuario = obterSessao();
    
    if (!usuario) {
        window.location.href = '../index.html';
        return;
    }

    // Se precisa trocar senha
    if (usuario.precisa_trocar_senha) {
        window.location.href = 'trocar-senha.html';
        return;
    }

    // Redirecionar por tipo
    if (usuario.tipo_usuario === 'admin') {
        window.location.href = 'admin/index.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

/**
 * Protege página - requer autenticação
 * @param {string} tipoRequerido - 'admin' ou null
 */
function protegerPagina(tipoRequerido = null) {
    const usuario = obterSessao();

    // Não autenticado
    if (!usuario) {
        window.location.href = '../index.html';
        return false;
    }

    // Requer admin
    if (tipoRequerido === 'admin' && usuario.tipo_usuario !== 'admin') {
        alert(MENSAGENS.erro.semPermissao);
        window.location.href = 'dashboard.html';
        return false;
    }

    // Precisa trocar senha
    if (usuario.precisa_trocar_senha && !window.location.href.includes('trocar-senha')) {
        window.location.href = 'trocar-senha.html';
        return false;
    }

    return true;
}

// =====================================================
// LOGS E AUDITORIA
// =====================================================

/**
 * Registra ação no log
 * @param {string} usuarioId - ID do usuário
 * @param {string} relatorioId - ID do relatório (opcional)
 * @param {string} acao - Tipo de ação
 * @param {Object} detalhes - Detalhes adicionais
 */
async function registrarLog(usuarioId, relatorioId, acao, detalhes) {
    if (!APP_CONFIG.logAcoes) return;

    try {
        await supabase.from('logs_acesso').insert({
            usuario_id: usuarioId,
            relatorio_id: relatorioId,
            acao: acao,
            detalhes: detalhes,
            ip_address: await obterIP(),
            data_hora: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao registrar log:', error);
    }
}

/**
 * Obtém IP do usuário (aproximado)
 * @returns {string}
 */
async function obterIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch {
        return 'Desconhecido';
    }
}
