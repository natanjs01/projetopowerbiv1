# 🚀 Configuração Completa - GitHub Pages

## ✅ URLs Configuradas para seu Projeto

Seu projeto está hospedado em:
```
https://natanjs01.github.io/projetopowerbiv1/
```

---

## 🔧 Passo 1: Configurar no Supabase

### 📍 Acesse a URL Configuration:
```
https://app.supabase.com/project/kzljxzhjkbpfksrlpplq/auth/url-configuration
```

### 📝 Configure os seguintes valores:

#### **Site URL:**
```
https://natanjs01.github.io
```
👆 **IMPORTANTE:** Remova o `http://localhost:3000` e coloque isso

#### **Redirect URLs:** (Clique em "Add URL" para cada uma)

1️⃣ 
```
https://natanjs01.github.io/projetopowerbiv1/redefinir-senha.html
```

2️⃣ 
```
https://natanjs01.github.io/projetopowerbiv1/esqueci-senha.html
```

3️⃣ 
```
https://natanjs01.github.io/projetopowerbiv1/index.html
```

4️⃣ 
```
https://natanjs01.github.io/projetopowerbiv1/
```

### 💾 Salvar:
Clique no botão verde **"Save"** ou **"Save changes"** no final da página

---

## 🎯 Passo 2: Fazer Deploy no GitHub Pages

### Opção A: Via Terminal (se você usa Git)
```bash
# Adicionar arquivos novos
git add .

# Fazer commit
git commit -m "Adicionar sistema de recuperação de senha"

# Enviar para GitHub
git push origin main
```

### Opção B: Via GitHub Web Interface
1. Acesse: https://github.com/natanjs01/projetopowerbiv1
2. Clique em "Upload files"
3. Arraste os arquivos novos:
   - `esqueci-senha.html`
   - `redefinir-senha.html`
   - `assets/js/auth.js` (substituir)
4. Atualize também:
   - `index.html` (com o link "Esqueci minha senha")
5. Commit changes

---

## ⏱️ Passo 3: Aguardar Deploy (2-3 minutos)

O GitHub Pages demora alguns minutos para atualizar. Aguarde e depois teste.

---

## 🧪 Passo 4: Testar

1. Acesse: https://natanjs01.github.io/projetopowerbiv1/index.html
2. Clique em **"Esqueci minha senha"**
3. Digite um email cadastrado
4. Verifique se funciona!

---

## 📧 Configurar Email Templates (OPCIONAL)

Se quiser personalizar o email de recuperação:

1. Vá em: Authentication > Email Templates > Reset Password
2. Personalize o template:

```html
<h2>🔐 Recuperação de Senha - BI Portal Secure</h2>
<p>Olá,</p>
<p>Você solicitou a recuperação de senha no BI Portal Secure - Grupo Líder.</p>
<p><a href="{{ .ConfirmationURL }}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Redefinir Senha</a></p>
<p><small>Este link expira em 1 hora.</small></p>
<p>Se você não solicitou esta recuperação, ignore este email.</p>
<hr>
<p><small>Controladoria - Grupo Líder</small></p>
```

---

## 🔒 Configurar SMTP (OPCIONAL)

Se quiser enviar emails automáticos:

### Para Gmail:

1. Vá em: Settings > Auth > SMTP Settings
2. Preencha:
   ```
   Host: smtp.gmail.com
   Port: 587
   User: seu-email@gmail.com
   Password: [senha de app do Gmail]
   ```

### Para gerar senha de app no Gmail:
1. Acesse: https://myaccount.google.com/apppasswords
2. Gere uma senha de app
3. Use essa senha no Supabase

---

## 🎨 Arquivos Atualizados

✅ **index.html** - Adicionado link "Esqueci minha senha"
✅ **esqueci-senha.html** - Nova página de recuperação
✅ **redefinir-senha.html** - Nova página de redefinição
✅ **assets/js/auth.js** - Funções de recuperação com URLs corretas
✅ **assets/css/login.css** - Estilos de alerta

---

## 📱 URLs do Sistema

| Página | URL |
|--------|-----|
| **Login** | https://natanjs01.github.io/projetopowerbiv1/index.html |
| **Esqueci Senha** | https://natanjs01.github.io/projetopowerbiv1/esqueci-senha.html |
| **Redefinir Senha** | https://natanjs01.github.io/projetopowerbiv1/redefinir-senha.html |
| **Admin** | https://natanjs01.github.io/projetopowerbiv1/admin/index.html |

---

## ✅ Checklist Final

- [ ] Executar SQL no Supabase (database_setup_recuperacao_senha.sql)
- [ ] Configurar Site URL no Supabase
- [ ] Adicionar todas as Redirect URLs
- [ ] Salvar configurações no Supabase
- [ ] Fazer upload dos arquivos novos no GitHub
- [ ] Aguardar deploy do GitHub Pages (2-3 min)
- [ ] Testar fluxo completo
- [ ] Configurar SMTP (opcional)
- [ ] Personalizar template de email (opcional)

---

## 🆘 Se tiver problemas:

### Email não chega:
1. Verifique spam
2. Configure SMTP
3. Use o token manual (aparece no console F12)

### Link de recuperação não funciona:
1. Verifique se adicionou TODAS as Redirect URLs
2. Aguarde 2-3 minutos após salvar no Supabase
3. Limpe o cache do navegador (Ctrl+Shift+Del)

### Token expirado:
1. Tokens expiram em 1 hora
2. Solicite nova recuperação

---

## 🎉 Pronto!

Depois de seguir esses passos, seu sistema de recuperação de senha estará funcionando perfeitamente no GitHub Pages!

**Dúvidas?** Verifique os logs no console (F12) para mais detalhes.

---

**Desenvolvido para Controladoria - Grupo Líder**  
**BI Portal Secure v1.0**
