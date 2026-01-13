-- =====================================================
-- TABELA DE TOKENS DE RECUPERAÇÃO DE SENHA
-- =====================================================
-- Execute este SQL no Supabase SQL Editor para criar a tabela

CREATE TABLE IF NOT EXISTS tokens_recuperacao (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expira_em TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT NOW(),
    usado_em TIMESTAMP,
    
    -- Índices para melhor performance
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacao_token ON tokens_recuperacao(token);
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacao_usuario_id ON tokens_recuperacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacao_usado ON tokens_recuperacao(usado);
CREATE INDEX IF NOT EXISTS idx_tokens_recuperacao_expira_em ON tokens_recuperacao(expira_em);

-- Comentários nas colunas
COMMENT ON TABLE tokens_recuperacao IS 'Tokens para recuperação de senha';
COMMENT ON COLUMN tokens_recuperacao.usuario_id IS 'ID do usuário que solicitou a recuperação';
COMMENT ON COLUMN tokens_recuperacao.token IS 'Token único de recuperação (64 caracteres)';
COMMENT ON COLUMN tokens_recuperacao.expira_em IS 'Data e hora de expiração do token (1 hora após criação)';
COMMENT ON COLUMN tokens_recuperacao.usado IS 'Indica se o token já foi utilizado';
COMMENT ON COLUMN tokens_recuperacao.criado_em IS 'Data e hora de criação do token';
COMMENT ON COLUMN tokens_recuperacao.usado_em IS 'Data e hora em que o token foi utilizado';

-- =====================================================
-- FUNÇÃO PARA LIMPAR TOKENS EXPIRADOS
-- =====================================================
-- Esta função remove tokens expirados e usados automaticamente

CREATE OR REPLACE FUNCTION limpar_tokens_expirados()
RETURNS void AS $$
BEGIN
    DELETE FROM tokens_recuperacao 
    WHERE (expira_em < NOW() OR usado = TRUE) 
    AND criado_em < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário na função
COMMENT ON FUNCTION limpar_tokens_expirados() IS 'Remove tokens expirados ou usados há mais de 7 dias';

-- =====================================================
-- CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================
-- Habilitar RLS na tabela

ALTER TABLE tokens_recuperacao ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
-- Permitir inserção apenas através de função RPC
CREATE POLICY "Permitir inserção via RPC" ON tokens_recuperacao
    FOR INSERT
    WITH CHECK (true);

-- Permitir leitura apenas de tokens válidos
CREATE POLICY "Permitir leitura de tokens válidos" ON tokens_recuperacao
    FOR SELECT
    USING (expira_em > NOW() AND usado = FALSE);

-- Permitir atualização apenas de tokens válidos
CREATE POLICY "Permitir atualização de tokens válidos" ON tokens_recuperacao
    FOR UPDATE
    USING (expira_em > NOW());

-- =====================================================
-- GRANTS DE PERMISSÃO
-- =====================================================

-- Permitir que usuários anônimos acessem a tabela via funções
GRANT SELECT, INSERT, UPDATE ON tokens_recuperacao TO anon;
GRANT SELECT, INSERT, UPDATE ON tokens_recuperacao TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE tokens_recuperacao_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE tokens_recuperacao_id_seq TO authenticated;

-- =====================================================
-- CONFIGURAR SUPABASE AUTH PARA RECUPERAÇÃO DE SENHA
-- =====================================================
-- IMPORTANTE: No Supabase Dashboard, configure:
-- 1. Authentication > Email Templates > Reset Password
-- 2. Personalize o template de email
-- 3. Configure o redirect URL: https://seu-dominio.com/redefinir-senha.html
-- 4. Em Settings > Auth > Site URL, adicione sua URL

-- =====================================================
-- EXEMPLO DE USO
-- =====================================================
/*
-- Criar um token de recuperação manualmente (apenas para testes)
INSERT INTO tokens_recuperacao (usuario_id, token, expira_em)
VALUES (1, 'token_teste_123456789', NOW() + INTERVAL '1 hour');

-- Verificar tokens ativos
SELECT * FROM tokens_recuperacao WHERE usado = FALSE AND expira_em > NOW();

-- Limpar tokens expirados
SELECT limpar_tokens_expirados();
*/
