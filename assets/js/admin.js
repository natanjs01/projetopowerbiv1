// =====================================================
// FUNÇÕES ADMINISTRATIVAS
// =====================================================

/**
 * Busca todos os usuários
 * @returns {Array} Lista de usuários
 */
async function buscarTodosUsuarios() {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .order('nome');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
}

/**
 * Cria novo usuário
 * @param {Object} dadosUsuario - Dados do usuário
 * @returns {Object} Resultado da operação
 */
async function criarUsuario(dadosUsuario) {
    try {
        const usuario = obterSessao();

        // Gerar senha temporária
        const senhaTemporaria = gerarSenhaTemporaria();

        // Criar hash SHA256 no cliente usando Web Crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(senhaTemporaria);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const senhaHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Inserir usuário diretamente
        const { data: novoUsuario, error } = await supabase
            .from('usuarios')
            .insert({
                email: dadosUsuario.email,
                senha_hash: senhaHash,
                nome: dadosUsuario.nome,
                setor: dadosUsuario.setor,
                tipo_usuario: dadosUsuario.tipo_usuario,
                precisa_trocar_senha: true,
                ativo: true,
                criado_por: usuario.id
            })
            .select()
            .single();

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, null, 'CRIAR_USUARIO', { email: dadosUsuario.email });

        return { sucesso: true, usuario: novoUsuario, senhaTemporaria };
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Atualiza usuário
 * @param {string} usuarioId - ID do usuário
 * @param {Object} dadosAtualizados - Dados para atualizar
 * @returns {Object} Resultado da operação
 */
async function atualizarUsuario(usuarioId, dadosAtualizados) {
    try {
        const usuario = obterSessao();

        const { error } = await supabase
            .from('usuarios')
            .update(dadosAtualizados)
            .eq('id', usuarioId);

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, null, 'ATUALIZAR_USUARIO', { usuarioId });

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Desativa usuário
 * @param {string} usuarioId - ID do usuário
 * @returns {Object} Resultado da operação
 */
async function desativarUsuario(usuarioId) {
    try {
        const usuario = obterSessao();

        const { error } = await supabase
            .from('usuarios')
            .update({ ativo: false })
            .eq('id', usuarioId);

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, null, 'DESATIVAR_USUARIO', { usuarioId });

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao desativar usuário:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Resetar senha do usuário
 * @param {string} usuarioId - ID do usuário
 * @returns {Object} Resultado com nova senha temporária
 */
async function resetarSenha(usuarioId) {
    try {
        const usuario = obterSessao();

        // Gerar nova senha temporária
        const novaSenha = gerarSenhaTemporaria();
        
        // Criar hash SHA256 usando Web Crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(novaSenha);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const senhaHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const { error } = await supabase
            .from('usuarios')
            .update({ 
                senha_hash: senhaHash,
                precisa_trocar_senha: true
            })
            .eq('id', usuarioId);

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, null, 'RESETAR_SENHA', { usuarioId });

        return novaSenha; // Retornar apenas a senha, não um objeto
    } catch (error) {
        console.error('Erro ao resetar senha:', error);
        throw error; // Lançar erro para ser capturado no try/catch do HTML
    }
}

/**
 * Gera senha temporária aleatória
 * @returns {string} Senha temporária
 */
function gerarSenhaTemporaria() {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&*';
    let senha = '';
    
    // Garantir que tenha pelo menos 1 de cada tipo
    senha += 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 24)]; // Maiúscula
    senha += 'abcdefghjkmnpqrstuvwxyz'[Math.floor(Math.random() * 24)]; // Minúscula
    senha += '23456789'[Math.floor(Math.random() * 8)]; // Número
    senha += '@#$%&*'[Math.floor(Math.random() * 6)]; // Especial
    
    // Completar até 12 caracteres
    for (let i = 0; i < 8; i++) {
        senha += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    
    // Embaralhar
    return senha.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Busca todos os setores
 * @returns {Array} Lista de setores
 */
async function buscarSetores() {
    try {
        const { data, error } = await supabase
            .from('setores')
            .select('*')
            .eq('ativo', true)
            .order('nome');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar setores:', error);
        return [];
    }
}

/**
 * Busca estatísticas do sistema
 * @returns {Object} Estatísticas
 */
async function buscarEstatisticas() {
    try {
        const [usuarios, relatorios, logs] = await Promise.all([
            supabase.from('usuarios').select('id', { count: 'exact' }),
            supabase.from('relatorios').select('id', { count: 'exact' }).eq('ativo', true),
            supabase.from('logs_acesso').select('id', { count: 'exact' })
                .gte('data_hora', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        ]);

        return {
            totalUsuarios: usuarios.count || 0,
            totalRelatorios: relatorios.count || 0,
            acessosHoje: logs.count || 0
        };
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return { totalUsuarios: 0, totalRelatorios: 0, acessosHoje: 0 };
    }
}

/**
 * Busca logs de acesso
 * @param {number} limite - Número de registros
 * @returns {Array} Lista de logs
 */
async function buscarLogs(limite = 50) {
    try {
        const { data, error } = await supabase
            .from('logs_acesso')
            .select(`
                *,
                usuarios:usuario_id(nome, email),
                relatorios:relatorio_id(titulo)
            `)
            .order('data_hora', { ascending: false })
            .limit(limite);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar logs:', error);
        return [];
    }
}
