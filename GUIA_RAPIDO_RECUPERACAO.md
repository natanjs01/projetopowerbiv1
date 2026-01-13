# 🔐 Guia Rápido - Sistema de Recuperação de Senha

## ✅ Passo a Passo para Configuração

### 1️⃣ Executar SQL no Supabase (OBRIGATÓRIO)

```
1. Acesse: https://app.supabase.com/project/kzljxzhjkbpfksrlpplq
2. Clique em "SQL Editor" no menu lateral
3. Copie o conteúdo de: database_setup_recuperacao_senha.sql
4. Cole no editor e clique em "Run"
5. Verifique se apareceu: "Success. No rows returned"
```

### 2️⃣ Configurar Supabase Auth (RECOMENDADO)

```
1. Vá em "Authentication" > "URL Configuration"
2. Em "Site URL", coloque a URL do seu projeto
3. Em "Redirect URLs", adicione:
   - http://localhost/redefinir-senha.html (para testes locais)
   - https://seu-dominio.com/redefinir-senha.html (produção)
```

### 3️⃣ Personalizar Email (OPCIONAL)

```
1. Vá em "Authentication" > "Email Templates" > "Reset Password"
2. Personalize o template do email
3. Salve as alterações
```

### 4️⃣ Configurar SMTP (OPCIONAL - Para envio de emails)

```
1. Vá em "Settings" > "Auth" > "SMTP Settings"
2. Configure seu provedor de email
3. Para Gmail:
   - Host: smtp.gmail.com
   - Port: 587
   - User: seu-email@gmail.com
   - Password: senha de app do Gmail
```

---

## 🎯 Como Usar

### Para Usuários:

```
1. Na tela de login, clique em "Esqueci minha senha"
2. Digite seu email cadastrado
3. Clique em "Enviar Link de Recuperação"
4. Verifique seu email
5. Clique no link recebido
6. Digite sua nova senha (2x)
7. Clique em "Redefinir Senha"
8. Faça login com a nova senha
```

### Para Administradores (se email não configurado):

```
1. Quando usuário solicitar recuperação, aparecerá um token no console
2. Copie o token
3. Envie manualmente ao usuário:
   Link: https://seu-dominio.com/redefinir-senha.html?token=TOKEN_AQUI
4. Usuário acessa o link e redefine a senha
```

---

## 🔍 Verificar se está Funcionando

### Teste Rápido:

```sql
-- No SQL Editor do Supabase, execute:
SELECT * FROM tokens_recuperacao;

-- Se a tabela existir, está configurado corretamente!
```

### Teste Completo:

```
1. Abra index.html no navegador
2. Clique em "Esqueci minha senha"
3. Digite um email válido cadastrado
4. Verifique se apareceu mensagem de sucesso
5. Abra o console do navegador (F12)
6. Veja se há erros em vermelho
```

---

## 🚨 Solução Rápida de Problemas

### ❌ Erro: "Tabela tokens_recuperacao não existe"
**Solução:** Execute o arquivo `database_setup_recuperacao_senha.sql` no Supabase

### ❌ Erro: "Link de recuperação inválido"
**Solução:** Configure as "Redirect URLs" no Supabase Auth

### ❌ Erro: "Email não enviado"
**Solução:** Configure SMTP ou use o método de token manual

### ❌ Erro: "Senha não atualizada"
**Solução:** Verifique se a função `atualizar_senha_sha256` existe no banco

---

## 📱 Arquivos do Sistema

```
✅ esqueci-senha.html       → Página de solicitação
✅ redefinir-senha.html     → Página de redefinição
✅ assets/js/auth.js        → Funções de recuperação
✅ database_setup.sql       → Script SQL da tabela
✅ index.html               → Link adicionado
```

---

## 🎨 Visual

O sistema tem:
- ✅ Design responsivo (funciona em celular)
- ✅ Background animado com imagens
- ✅ Alertas coloridos de sucesso/erro
- ✅ Botão para mostrar/ocultar senha
- ✅ Validação de senha forte
- ✅ Loading durante processamento

---

## 📞 Próximos Passos

1. [ ] Testar localmente
2. [ ] Executar SQL no Supabase
3. [ ] Configurar URLs de redirecionamento
4. [ ] Configurar SMTP (se quiser emails automáticos)
5. [ ] Testar fluxo completo
6. [ ] Comunicar aos usuários

---

## 💡 Dica Pro

Para testes rápidos sem configurar email:

```javascript
// Abra o console (F12) após solicitar recuperação
// Copie o token que aparece no console
// Use: redefinir-senha.html?token=SEU_TOKEN_AQUI
```

---

**Sistema Pronto! 🎉**

Documentação completa em: `RECUPERACAO_SENHA_README.md`
