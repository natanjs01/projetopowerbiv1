// =====================================================
// SISTEMA DE AUTENTICAÇÃO
// =====================================================

// Função para inicializar Supabase de forma segura
function initSupabase() {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase não carregado! Verifique a conexão CDN.');
        return null;
    }
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('Credenciais do Supabase não configuradas!');
        return null;
    }
    
    try {
        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (error) {
        console.error('Erro ao inicializar Supabase:', error);
        return null;
    }
}

// Inicializar cliente Supabase (sem let/const/var para evitar declaração duplicada)
var supabase = initSupabase();

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
        // Verificar se Supabase foi inicializado
        if (!supabase) {
            supabase = initSupabase();
            if (!supabase) {
                throw new Error('Erro ao conectar com o banco de dados. Tente novamente.');
            }
        }
        
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

// =====================================================
// FUNÇÕES DE RECUPERAÇÃO DE SENHA
// =====================================================

/**
 * Solicita recuperação de senha via email
 * @param {string} email - Email do usuário
 * @returns {Object} Resultado da operação
 */
async function solicitarRecuperacaoSenha(email) {
    try {
        // Verificar se Supabase foi inicializado
        if (!supabase) {
            supabase = initSupabase();
            if (!supabase) {
                throw new Error('Erro ao conectar com o banco de dados. Tente novamente.');
            }
        }
        
        // Verificar se o email existe no sistema
        const { data: usuarioData, error: usuarioError } = await supabase
            .from('usuarios')
            .select('id, email, nome')
            .eq('email', email)
            .single();
        
        if (usuarioError || !usuarioData) {
            // Por segurança, retornar mensagem genérica mesmo se o email não existir
            return { 
                sucesso: true, 
                mensagem: 'Se o email existir em nosso sistema, você receberá um link de recuperação em breve.' 
            };
        }
        
        // Enviar email de recuperação usando Supabase Auth
        const baseUrl = window.location.origin.includes('github.io') 
            ? 'https://natanjs01.github.io/projetopowerbiv1'
            : window.location.origin;
            
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${baseUrl}/redefinir-senha.html`
        });
        
        if (error) {
            console.error('Erro ao enviar email de recuperação:', error);
            
            // Se o Supabase Auth não estiver configurado, usar método alternativo
            // Gerar token de recuperação manual
            const token = gerarTokenRecuperacao();
            const expiraEm = new Date(Date.now() + 3600000); // 1 hora
            
            // Salvar token no banco de dados
            const { error: tokenError } = await supabase
                .from('tokens_recuperacao')
                .insert({
                    usuario_id: usuarioData.id,
                    token: token,
                    expira_em: expiraEm.toISOString(),
                    usado: false
                });
            
            if (tokenError) {
                console.error('Erro ao salvar token:', tokenError);
                throw new Error('Erro ao processar recuperação de senha.');
            }
            
            // Determinar URL base
            const baseUrl = window.location.origin.includes('github.io') 
                ? 'https://natanjs01.github.io/projetopowerbiv1'
                : window.location.origin;
            
            // Aqui você poderia integrar com um serviço de email
            // Por enquanto, vamos retornar sucesso com instruções
            console.log('Token de recuperação gerado:', token);
            console.log('Link de recuperação:', `${baseUrl}/redefinir-senha.html?token=${token}`);
            
            return { 
                sucesso: true, 
                mensagem: 'Instruções de recuperação foram enviadas. Entre em contato com o administrador do sistema.',
                token: token // Em produção, remover isso e enviar por email
            };
        }
        
        return { 
            sucesso: true, 
            mensagem: 'Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.' 
        };
        
    } catch (error) {
        console.error('Erro na recuperação de senha:', error);
        return { 
            sucesso: false, 
            erro: error.message || 'Erro ao processar recuperação de senha.' 
        };
    }
}

/**
 * Atualiza a senha usando o token de recuperação do Supabase
 * @param {string} novaSenha - Nova senha do usuário
 * @returns {Object} Resultado da operação
 */
async function atualizarSenhaRecuperacao(novaSenha) {
    try {
        // Verificar se Supabase foi inicializado
        if (!supabase) {
            supabase = initSupabase();
            if (!supabase) {
                throw new Error('Erro ao conectar com o banco de dados. Tente novamente.');
            }
        }
        
        // Validar força da senha
        if (!validarSenhaForte(novaSenha)) {
            throw new Error('A senha não atende aos requisitos de segurança.');
        }
        
        // Atualizar senha usando Supabase Auth
        const { data, error } = await supabase.auth.updateUser({
            password: novaSenha
        });
        
        if (error) {
            console.error('Erro ao atualizar senha:', error);
            
            // Tentar método alternativo usando token manual
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            
            if (token) {
                return await atualizarSenhaComTokenManual(token, novaSenha);
            }
            
            throw new Error('Link de recuperação inválido ou expirado.');
        }
        
        // Obter o email do usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email) {
            // Atualizar senha no banco de dados usando SHA256
            const { error: updateError } = await supabase
                .rpc('atualizar_senha_sha256', {
                    p_email: user.email,
                    p_nova_senha: novaSenha
                });
            
            if (updateError) {
                console.error('Erro ao atualizar senha no banco:', updateError);
            }
            
            // Registrar log
            const { data: usuarioData } = await supabase
                .from('usuarios')
                .select('id')
                .eq('email', user.email)
                .single();
            
            if (usuarioData) {
                await registrarLog(usuarioData.id, null, 'RECUPERACAO_SENHA', { email: user.email });
            }
        }
        
        // Fazer logout após redefinir senha
        await supabase.auth.signOut();
        
        return { 
            sucesso: true, 
            mensagem: 'Senha redefinida com sucesso!' 
        };
        
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return { 
            sucesso: false, 
            erro: error.message || 'Erro ao redefinir senha.' 
        };
    }
}

/**
 * Atualiza senha usando token manual (fallback)
 * @param {string} token - Token de recuperação
 * @param {string} novaSenha - Nova senha
 * @returns {Object} Resultado da operação
 */
async function atualizarSenhaComTokenManual(token, novaSenha) {
    try {
        // Verificar token no banco de dados
        const { data: tokenData, error: tokenError } = await supabase
            .from('tokens_recuperacao')
            .select('*, usuarios(id, email)')
            .eq('token', token)
            .eq('usado', false)
            .single();
        
        if (tokenError || !tokenData) {
            throw new Error('Token inválido ou expirado.');
        }
        
        // Verificar se o token expirou
        const agora = new Date();
        const expiraEm = new Date(tokenData.expira_em);
        
        if (agora > expiraEm) {
            throw new Error('Token expirado. Solicite uma nova recuperação de senha.');
        }
        
        // Atualizar senha no banco de dados
        const { error: updateError } = await supabase
            .rpc('atualizar_senha_sha256', {
                p_email: tokenData.usuarios.email,
                p_nova_senha: novaSenha
            });
        
        if (updateError) {
            console.error('Erro ao atualizar senha:', updateError);
            throw new Error('Erro ao atualizar senha no banco de dados.');
        }
        
        // Marcar token como usado
        await supabase
            .from('tokens_recuperacao')
            .update({ usado: true })
            .eq('token', token);
        
        // Registrar log
        await registrarLog(tokenData.usuario_id, null, 'RECUPERACAO_SENHA', { 
            email: tokenData.usuarios.email 
        });
        
        return { 
            sucesso: true, 
            mensagem: 'Senha redefinida com sucesso!' 
        };
        
    } catch (error) {
        console.error('Erro ao atualizar senha com token manual:', error);
        return { 
            sucesso: false, 
            erro: error.message || 'Erro ao redefinir senha.' 
        };
    }
}

/**
 * Gera um token aleatório para recuperação de senha
 * @returns {string} Token gerado
 */
function gerarTokenRecuperacao() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
        token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return token;
}

/**
 * Valida se a senha atende aos requisitos de segurança
 * @param {string} senha - Senha a ser validada
 * @returns {boolean}
 */
function validarSenhaForte(senha) {
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    const tamanhoMinimo = senha.length >= 8;
    
    return temMaiuscula && temMinuscula && temNumero && temEspecial && tamanhoMinimo;
}
