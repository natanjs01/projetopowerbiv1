# 🔐 BI PORTAL SECURE

Sistema de Gerenciamento de Relatórios Power BI com Controle de Acesso por Usuário e Setor

## 📋 Funcionalidades

✅ **Autenticação Segura**
- Login com email e senha
- Senhas criptografadas (bcrypt)
- Troca obrigatória de senha no primeiro acesso
- Reset de senha pelo admin

✅ **Controle de Acesso**
- Permissões por usuário individual
- Permissões por setor
- Níveis: Admin e Usuário Comum

✅ **Gerenciamento de Relatórios**
- Adicionar relatórios Power BI (cola iframe)
- Extração automática do Report ID
- Categorização de relatórios
- Ativar/desativar relatórios

✅ **Painel Administrativo**
- Criar/editar usuários
- Gerenciar permissões
- Resetar senhas
- Visualizar logs de acesso
- Estatísticas do sistema

✅ **Auditoria**
- Logs completos de todas as ações
- Registro de acessos
- Histórico de mudanças

## 🚀 Configuração Inicial

### 1. Configurar Banco de Dados no Supabase

1. Acesse [Supabase](https://supabase.com)
2. Crie um novo projeto (se ainda não criou)
3. Vá em **SQL Editor** > **New Query**
4. Abra o arquivo `SUPABASE_SETUP.sql`
5. Copie **TODO** o conteúdo
6. Cole no SQL Editor do Supabase
7. Clique em **RUN** ou pressione Ctrl+Enter
8. Aguarde mensagem de sucesso

### 2. Obter Credenciais do Supabase

1. No Supabase, vá em **Settings** (⚙️) > **API**
2. Copie os seguintes valores:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon/public** key (chave pública longa)

### 3. Configurar Aplicação

1. Abra o arquivo `assets/js/config.js`
2. Substitua os valores:

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-chave-publica-aqui';
```

3. Se necessário, atualize o `ctid` (Tenant ID do Power BI):

```javascript
const POWERBI_CONFIG = {
    ...
    ctid: 'SEU-TENANT-ID-AQUI'
};
```

### 4. Incluir Bibliotecas Necessárias

Certifique-se de incluir estas bibliotecas nos arquivos HTML:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Bcrypt.js para criptografia -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js"></script>
```

## 🔑 Primeiro Acesso

**Credenciais Admin Padrão:**
- **Email:** `admin@empresa.com`
- **Senha:** `Admin@2025`

⚠️ **IMPORTANTE:** 
- No primeiro login, você será obrigado a trocar a senha
- Use uma senha forte (mín. 8 caracteres, maiúsculas, minúsculas, números e símbolos)

## 📁 Estrutura do Projeto

```
BI_PORTAL_SECURE/
├── index.html                 # Tela de login (ponto de entrada)
├── dashboard.html             # Dashboard usuário comum
├── trocar-senha.html          # Troca de senha obrigatória
├── admin/
│   ├── index.html            # Painel administrativo
│   ├── usuarios.html         # Gerenciar usuários
│   └── relatorios.html       # Gerenciar relatórios
├── assets/
│   ├── css/
│   │   ├── style.css         # Estilos globais
│   │   ├── login.css         # Estilos da tela de login
│   │   └── admin.css         # Estilos do painel admin
│   └── js/
│       ├── config.js         # Configurações (EDITAR AQUI!)
│       ├── auth.js           # Autenticação
│       ├── reports.js        # Gerenciamento de relatórios
│       ├── admin.js          # Funções administrativas
│       └── main.js           # Funções auxiliares
├── SUPABASE_SETUP.sql        # Script de criação do banco
└── README.md                 # Este arquivo
```

## 🎯 Como Usar

### Para Administradores

#### Criar Usuário
1. Login como admin
2. Ir em **Gerenciar Usuários**
3. Clicar em **Novo Usuário**
4. Preencher dados (email, nome, setor, tipo)
5. Sistema gera senha temporária automaticamente
6. Copiar e enviar senha para o usuário

#### Adicionar Relatório Power BI
1. No Power BI, copie o código iframe do relatório
2. Ir em **Gerenciar Relatórios**
3. Clicar em **Novo Relatório**
4. **Colar o iframe completo** no campo
5. Preencher informações adicionais
6. Definir permissões (usuários ou setores)
7. Salvar

**Exemplo de iframe:**
```html
<iframe title="Relatório" width="1140" height="541.25" 
src="https://app.powerbi.com/reportEmbed?reportId=ABC123-..." 
frameborder="0" allowFullScreen="true"></iframe>
```

#### Resetar Senha de Usuário
1. Gerenciar Usuários
2. Encontrar usuário
3. Clicar em **Resetar Senha**
4. Nova senha temporária é gerada
5. Copiar e enviar para o usuário
6. Usuário deverá trocar no próximo login

### Para Usuários Comuns

1. Fazer login com credenciais
2. Se primeiro acesso: trocar senha obrigatoriamente
3. Visualizar relatórios disponíveis
4. Clicar para abrir relatório em tela cheia

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt (salt rounds: 10)
- ✅ Row Level Security (RLS) habilitado no Supabase
- ✅ Validação de sessão com timeout configurável
- ✅ Logs de auditoria de todas as ações
- ✅ Proteção contra XSS
- ✅ Validação de dados no frontend e backend

## 🗄️ Banco de Dados

### Tabelas Criadas

**usuarios**
- Armazena dados dos usuários
- Senhas hash com bcrypt
- Flag para forçar troca de senha

**relatorios**
- Catálogo de relatórios Power BI
- Report ID extraído automaticamente
- Iframe completo armazenado

**permissoes**
- Controle de quem vê o quê
- Permissões por usuário OU por setor

**logs_acesso**
- Auditoria completa
- Todas as ações registradas

**setores**
- Lista de setores da empresa
- Usado para agrupamento de permissões

## ❓ Resolução de Problemas

### Erro: "Configure as credenciais do Supabase"
- Edite `assets/js/config.js` com suas credenciais

### Erro ao fazer login
- Verifique se o SQL foi executado no Supabase
- Confirme que as credenciais estão corretas
- Abra o console do navegador (F12) para ver detalhes

### Relatório não aparece
- Verifique se usuário tem permissão
- Confirme que relatório está ativo
- Verifique se setores coincidem

### Iframe não carrega
- Verifique se Report ID foi extraído corretamente
- Confirme se Tenant ID está correto no config.js
- Veja erros no console (F12)

## 🔧 Personalização

### Alterar Timeout de Sessão
Em `config.js`:
```javascript
sessaoTimeout: 3600000  // 1 hora (em millisegundos)
```

### Adicionar Novos Setores
No Supabase, SQL Editor:
```sql
INSERT INTO setores (nome, descricao) 
VALUES ('Novo Setor', 'Descrição do setor');
```

### Alterar Regras de Senha
Em `config.js`:
```javascript
senhaMinLength: 8,
senhaDeveConter: {
    maiuscula: true,
    minuscula: true,
    numero: true,
    especial: true
}
```

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique este README
2. Consulte os comentários no código
3. Verifique logs no console do navegador (F12)
4. Consulte logs no Supabase (Table Editor > logs_acesso)

## 📄 Licença

Uso Interno - Controladoria  
Desenvolvido para gerenciamento de relatórios Power BI

---

**Versão:** 1.0.0  
**Última atualização:** Novembro 2025
