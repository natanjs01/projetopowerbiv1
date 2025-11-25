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
        // Buscar usuário por email
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('ativo', true)
            .single();

        if (error || !usuario) {
            throw new Error(MENSAGENS.erro.loginInvalido);
        }

        // Verificar senha usando bcrypt
        const senhaCorreta = await verificarSenha(senha, usuario.senha_hash);
        
        if (!senhaCorreta) {
            throw new Error(MENSAGENS.erro.loginInvalido);
        }

        // Atualizar último acesso
        await supabase
            .from('usuarios')
            .update({ ultimo_acesso: new Date().toISOString() })
            .eq('id', usuario.id);

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

        // Buscar usuário
        const { data: usuario } = await supabase
            .from('usuarios')
            .select('senha_hash')
            .eq('id', usuarioId)
            .single();

        // Verificar senha atual (se fornecida)
        if (senhaAtual) {
            const senhaCorreta = await verificarSenha(senhaAtual, usuario.senha_hash);
            if (!senhaCorreta) {
                throw new Error('Senha atual incorreta');
            }
        }

        // Gerar hash da nova senha
        const novoHash = await bcrypt.hash(novaSenha, 10);

        // Atualizar senha
        const { error } = await supabase
            .from('usuarios')
            .update({ 
                senha_hash: novoHash,
                precisa_trocar_senha: false
            })
            .eq('id', usuarioId);

        if (error) throw error;

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
    window.location.href = '../index.html';
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
        window.location.href = '../trocar-senha.html';
        return;
    }

    // Redirecionar por tipo
    if (usuario.tipo_usuario === 'admin') {
        window.location.href = '../admin/index.html';
    } else {
        window.location.href = '../dashboard.html';
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
        window.location.href = '../dashboard.html';
        return false;
    }

    // Precisa trocar senha
    if (usuario.precisa_trocar_senha && !window.location.href.includes('trocar-senha')) {
        window.location.href = '../trocar-senha.html';
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
