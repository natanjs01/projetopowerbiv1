// =====================================================
// GERENCIAMENTO DE RELATÓRIOS POWER BI
// =====================================================

/**
 * Extrai Report ID do iframe do Power BI
 * @param {string} iframeCode - Código iframe completo
 * @returns {string|null} Report ID ou null
 */
function extrairReportId(iframeCode) {
    if (!iframeCode || typeof iframeCode !== 'string') return null;
    const match = iframeCode.match(VALIDACOES.reportId);
    return match ? match[0] : null;
}

/**
 * Busca relatórios do usuário
 * @returns {Array} Lista de relatórios
 */
async function buscarRelatoriosUsuario() {
    try {
        const usuario = obterSessao();
        if (!usuario) return [];

        let query = supabase
            .from('relatorios')
            .select('*')
            .eq('ativo', true);

        // Se não for admin, filtrar por permissões
        if (usuario.tipo_usuario !== 'admin') {
            // Buscar relatórios com permissão
            const { data: permissoes } = await supabase
                .from('permissoes')
                .select('relatorio_id')
                .or(`usuario_id.eq.${usuario.id},setor.eq.${usuario.setor}`);

            const idsPermitidos = permissoes.map(p => p.relatorio_id);
            
            if (idsPermitidos.length === 0) return [];
            
            query = query.in('id', idsPermitidos);
        }

        const { data, error } = await query.order('titulo');

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        return [];
    }
}

/**
 * Busca todos os relatórios (admin)
 * @returns {Array} Lista de relatórios
 */
async function buscarTodosRelatorios() {
    try {
        const { data, error } = await supabase
            .from('relatorios')
            .select('*')
            .order('titulo');

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar relatórios:', error);
        return [];
    }
}

/**
 * Adiciona novo relatório
 * @param {Object} dadosRelatorio - Dados do relatório
 * @returns {Object} Resultado da operação
 */
async function adicionarRelatorio(dadosRelatorio) {
    try {
        const usuario = obterSessao();
        
        // Extrair report_id do iframe
        const reportId = extrairReportId(dadosRelatorio.iframe_completo);
        if (!reportId) {
            throw new Error('Iframe inválido. Não foi possível extrair o Report ID.');
        }

        // Inserir relatório
        const { data, error } = await supabase
            .from('relatorios')
            .insert({
                titulo: dadosRelatorio.titulo,
                descricao: dadosRelatorio.descricao,
                report_id_powerbi: reportId,
                categoria: dadosRelatorio.categoria,
                iframe_completo: dadosRelatorio.iframe_completo,
                data_source: dadosRelatorio.data_source,
                update_frequency: dadosRelatorio.update_frequency,
                responsavel: dadosRelatorio.responsavel,
                criado_por: usuario.id,
                ativo: true
            })
            .select()
            .single();

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, data.id, 'CRIAR_RELATORIO', { titulo: dadosRelatorio.titulo });

        return { sucesso: true, relatorio: data };
    } catch (error) {
        console.error('Erro ao adicionar relatório:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Atualiza relatório existente
 * @param {string} relatorioId - ID do relatório
 * @param {Object} dadosAtualizados - Dados para atualizar
 * @returns {Object} Resultado da operação
 */
async function atualizarRelatorio(relatorioId, dadosAtualizados) {
    try {
        const usuario = obterSessao();

        // Se iframe foi atualizado, extrair novo reportId
        if (dadosAtualizados.iframe_completo) {
            const reportId = extrairReportId(dadosAtualizados.iframe_completo);
            if (reportId) {
                dadosAtualizados.report_id_powerbi = reportId;
            }
        }

        const { error } = await supabase
            .from('relatorios')
            .update(dadosAtualizados)
            .eq('id', relatorioId);

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, relatorioId, 'ATUALIZAR_RELATORIO', dadosAtualizados);

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao atualizar relatório:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Exclui relatório (desativa)
 * @param {string} relatorioId - ID do relatório
 * @returns {Object} Resultado da operação
 */
async function excluirRelatorio(relatorioId) {
    try {
        const usuario = obterSessao();

        const { error } = await supabase
            .from('relatorios')
            .update({ ativo: false })
            .eq('id', relatorioId);

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, relatorioId, 'EXCLUIR_RELATORIO', {});

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao excluir relatório:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Busca permissões de um relatório
 * @param {string} relatorioId - ID do relatório
 * @returns {Array} Lista de permissões
 */
async function buscarPermissoesRelatorio(relatorioId) {
    try {
        const { data, error } = await supabase
            .from('permissoes')
            .select(`
                *,
                usuarios:usuario_id(nome, email, setor)
            `)
            .eq('relatorio_id', relatorioId);

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        return [];
    }
}

/**
 * Concede permissão para usuário/setor
 * @param {string} relatorioId - ID do relatório
 * @param {string} usuarioId - ID do usuário (ou null se for por setor)
 * @param {string} setor - Nome do setor (ou null se for por usuário)
 * @returns {Object} Resultado da operação
 */
async function concederPermissao(relatorioId, usuarioId = null, setor = null) {
    try {
        const usuario = obterSessao();

        const { error } = await supabase
            .from('permissoes')
            .insert({
                relatorio_id: relatorioId,
                usuario_id: usuarioId,
                setor: setor,
                concedido_por: usuario.id
            });

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, relatorioId, 'CONCEDER_PERMISSAO', { usuarioId, setor });

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao conceder permissão:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Remove permissão
 * @param {string} permissaoId - ID da permissão
 * @returns {Object} Resultado da operação
 */
async function removerPermissao(permissaoId) {
    try {
        const usuario = obterSessao();

        const { error } = await supabase
            .from('permissoes')
            .delete()
            .eq('id', permissaoId);

        if (error) throw error;

        // Registrar log
        await registrarLog(usuario.id, null, 'REMOVER_PERMISSAO', { permissaoId });

        return { sucesso: true };
    } catch (error) {
        console.error('Erro ao remover permissão:', error);
        return { sucesso: false, erro: error.message };
    }
}

/**
 * Gera URL do Power BI para embed
 * @param {string} reportId - ID do relatório
 * @returns {string} URL completa
 */
function gerarURLPowerBI(reportId) {
    return `${POWERBI_CONFIG.baseUrl}?reportId=${reportId}&autoAuth=${POWERBI_CONFIG.autoAuth}&ctid=${POWERBI_CONFIG.ctid}`;
}

/**
 * Registra visualização de relatório
 * @param {string} relatorioId - ID do relatório
 */
async function registrarVisualizacao(relatorioId) {
    const usuario = obterSessao();
    if (usuario) {
        await registrarLog(usuario.id, relatorioId, 'VISUALIZAR_RELATORIO', {});
    }
}
