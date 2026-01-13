# 🔐 Sistema de Recuperação de Senha - BI Portal Secure

## 📋 Visão Geral

Sistema completo de recuperação de senha para o BI Portal Secure, integrado com Supabase Auth.

## 🗂️ Arquivos Criados

1. **esqueci-senha.html** - Página para solicitar recuperação de senha
2. **redefinir-senha.html** - Página para redefinir a senha
3. **assets/js/auth.js** - Funções de recuperação adicionadas
4. **database_setup_recuperacao_senha.sql** - Script SQL para criar tabela de tokens

## 🚀 Como Configurar

### Passo 1: Configurar Supabase Auth

1. Acesse seu dashboard do Supabase: https://app.supabase.com/project/kzljxzhjkbpfksrlpplq

2. Vá em **Authentication > Email Templates > Reset Password**

3. Configure o template de email (opcional, mas recomendado):
   ```
   <h2>Recuperação de Senha - BI Portal Secure</h2>
   <p>Olá,</p>
   <p>Você solicitou a recuperação de senha no BI Portal Secure.</p>
   <p>Clique no link abaixo para redefinir sua senha:</p>
   <p><a href="{{ .ConfirmationURL }}">Redefinir Senha</a></p>
   <p>Este link expira em 1 hora.</p>
   <p>Se você não solicitou esta recuperação, ignore este email.</p>
   <br>
   <p>Controladoria - Grupo Líder</p>
   ```

4. Vá em **Authentication > URL Configuration**
   - Em **Site URL**, adicione: `https://seu-dominio.com` ou `file:///caminho/do/projeto`
   - Em **Redirect URLs**, adicione: `https://seu-dominio.com/redefinir-senha.html`

### Passo 2: Criar Tabela no Banco de Dados

1. Acesse **SQL Editor** no Supabase

2. Execute o conteúdo do arquivo `database_setup_recuperacao_senha.sql`

3. Verifique se a tabela foi criada:
   ```sql
   SELECT * FROM tokens_recuperacao;
   ```

### Passo 3: Configurar SMTP (Opcional)

Para enviar emails personalizados:

1. Vá em **Settings > Auth**
2. Em **SMTP Settings**, configure seu servidor de email
3. Recomendado: Gmail, SendGrid, Mailgun, ou outro provedor

**Configuração Gmail:**
- SMTP Host: `smtp.gmail.com`
- SMTP Port: `587`
- SMTP User: `seu-email@gmail.com`
- SMTP Password: Use uma "senha de app" (não sua senha real)

### Passo 4: Testar o Sistema

1. Abra `index.html` no navegador
2. Clique em "Esqueci minha senha"
3. Digite um email cadastrado
4. Verifique o email recebido
5. Clique no link e redefina a senha

## 🔧 Métodos de Recuperação

O sistema suporta **dois métodos**:

### Método 1: Supabase Auth (Recomendado)
- Usa o sistema nativo do Supabase
- Envia email automaticamente
- Mais seguro e confiável
- Requer configuração SMTP

### Método 2: Token Manual (Fallback)
- Usado quando Supabase Auth não está configurado
- Gera token manual e salva no banco
- Administrador precisa enviar link manualmente
- Útil para testes ou ambientes sem email

## 📧 Fluxo de Recuperação

```
1. Usuário clica em "Esqueci minha senha"
   ↓
2. Digita o email
   ↓
3. Sistema verifica se email existe
   ↓
4. Envia email com link de recuperação
   ↓
5. Usuário clica no link
   ↓
6. Abre página de redefinição de senha
   ↓
7. Usuário digita nova senha
   ↓
8. Sistema valida e atualiza senha
   ↓
9. Redireciona para login
```

## 🔒 Segurança

- ✅ Tokens expiram em 1 hora
- ✅ Tokens podem ser usados apenas uma vez
- ✅ Senha validada com critérios fortes:
  - Mínimo 8 caracteres
  - Pelo menos 1 letra maiúscula
  - Pelo menos 1 letra minúscula
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial
- ✅ Senha armazenada com SHA256 no banco
- ✅ RLS (Row Level Security) habilitado
- ✅ Logs de auditoria registrados

## 🎨 Recursos Visuais

- Background animado com imagens do Grupo Líder
- Design responsivo (mobile e desktop)
- Alertas de sucesso e erro
- Botões com estados de loading
- Ícone para mostrar/ocultar senha

## 🐛 Solução de Problemas

### Email não está sendo enviado
1. Verifique configurações SMTP no Supabase
2. Verifique se o email está na caixa de spam
3. Use o método de token manual como fallback

### Token inválido ou expirado
1. Tokens expiram em 1 hora
2. Solicite nova recuperação de senha
3. Verifique se a tabela `tokens_recuperacao` existe

### Senha não está sendo atualizada
1. Verifique se a função `atualizar_senha_sha256` existe no banco
2. Verifique logs do navegador (F12 > Console)
3. Verifique permissões RLS no Supabase

### Link de recuperação não funciona
1. Verifique se adicionou a URL em "Redirect URLs" no Supabase
2. Verifique se o parâmetro `?type=recovery` está na URL
3. Teste o método de token manual

## 📝 Logs e Auditoria

Todas as ações de recuperação são registradas:

```sql
SELECT * FROM logs_sistema 
WHERE acao = 'RECUPERACAO_SENHA' 
ORDER BY data_hora DESC;
```

## 🔄 Manutenção

### Limpar tokens expirados automaticamente

Execute periodicamente:

```sql
SELECT limpar_tokens_expirados();
```

Ou configure um cron job no Supabase:
1. Vá em **Database > Cron Jobs**
2. Crie um job para executar diariamente:
   ```sql
   SELECT limpar_tokens_expirados();
   ```

## 📚 Documentação Adicional

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Suporte

Se precisar de ajuda:
1. Verifique os logs do navegador (F12 > Console)
2. Verifique os logs do Supabase
3. Entre em contato com o administrador do sistema

## ✅ Checklist de Implementação

- [ ] Executar SQL de criação da tabela
- [ ] Configurar Supabase Auth (Email Templates)
- [ ] Configurar URLs de redirecionamento
- [ ] Configurar SMTP (opcional)
- [ ] Testar fluxo completo
- [ ] Personalizar template de email (opcional)
- [ ] Configurar cron job para limpar tokens
- [ ] Documentar para equipe

---

**Desenvolvido para Controladoria - Grupo Líder**  
**BI Portal Secure v1.0**  
**© 2025**
