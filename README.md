# 🔐 BI Portal Secure

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-stable-success.svg)

**Sistema completo de autenticação e controle de acesso para relatórios Power BI**

[Documentação](INDEX.md) • [Instalação](INSTALACAO.md) • [Exemplos](EXEMPLOS.md)

</div>

---

## 📊 Visão Geral

BI Portal Secure é uma solução completa para gerenciar o acesso a relatórios Power BI com autenticação segura, controle granular de permissões e auditoria completa.

### ✨ Principais Recursos

- 🔐 **Autenticação Segura** - Senhas criptografadas com Bcrypt
- 👥 **Gestão de Usuários** - CRUD completo com tipos (comum/admin)
- 📊 **Gestão de Relatórios** - Adicione relatórios Power BI facilmente
- 🏢 **Organização por Setores** - Controle de acesso departamental
- 🔑 **Permissões Granulares** - Por usuário ou setor
- 📋 **Auditoria Completa** - Logs de todas as ações
- 🎨 **Interface Moderna** - Design responsivo e intuitivo
- ⚡ **Sem Dependências** - Tudo via CDN, pronto para usar

---

## 🚀 Início Rápido

### Pré-requisitos

- Conta no [Supabase](https://supabase.com) (plano free funciona!)
- Relatórios publicados no Power BI
- Navegador moderno

### Instalação em 3 Passos

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/bi-portal-secure.git
cd bi-portal-secure

# 2. Configure suas credenciais
cp assets/js/config.example.js assets/js/config.js
# Edite config.js e adicione URL e Key do Supabase

# 3. Execute o SQL no Supabase
# Copie o conteúdo de SUPABASE_SETUP.sql
# Execute no SQL Editor do Supabase
```

### Primeiro Acesso

1. Abra `index.html` no navegador
2. Login: `admin@empresa.com`
3. Senha: `Admin@2025`
4. Troque a senha (obrigatório)

✅ **Pronto! Sistema funcionando em ~10 minutos!**

---

## 📚 Documentação

-  [**INSTALACAO.md**](INSTALACAO.md) - Guia completo de configuração e uso
- �️ [**SUPABASE_SETUP.sql**](SUPABASE_SETUP.sql) - Script do banco de dados

---

## 🎯 Funcionalidades Detalhadas

### 🔐 Autenticação
- Login seguro com email/senha
- Criptografia Bcrypt (salt rounds: 10)
- Troca obrigatória no primeiro acesso
- Validação de força de senha
- Sessão persistente
- Logout em todas páginas

### 👥 Gestão de Usuários
- Criar/editar/desativar usuários
- Resetar senha (gera temporária)
- Organização por setores
- Tipos: comum e administrador
- Busca e filtros avançados

### 📊 Gestão de Relatórios
- Adicionar relatórios do Power BI
- Extração automática de Report ID
- Editar título e descrição
- Ativar/desativar relatórios
- Visualização em modal fullscreen

### 🏢 Gestão de Setores
- Criar/editar/excluir setores
- Contagem de usuários por setor
- Proteção contra exclusão acidental

### 🔑 Controle de Acesso
- Permissões por usuário individual
- Permissões por setor completo
- Combinação de ambas
- Interface visual para configurar

### 📋 Auditoria
- Log de login
- Log de troca de senha
- Log de visualização de relatórios
- Dashboard com estatísticas
- Histórico completo

---

## 🗄️ Banco de Dados

### Tabelas (PostgreSQL via Supabase)

```
├── setores (departamentos)
├── usuarios (autenticação)
├── relatorios (catálogo Power BI)
├── permissoes (controle de acesso)
└── logs_acesso (auditoria)
```

### Recursos do Banco
- Row Level Security (RLS)
- Índices otimizados
- Foreign Keys
- Timestamps automáticos
- UUID para IDs

---

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Backend:** Supabase (PostgreSQL + REST API)
- **Autenticação:** Bcrypt.js v2.4.3
- **BI:** Power BI Embedded (iframes)
- **Design:** CSS Grid, Flexbox, Variables
- **CDN:** Supabase Client, Bcrypt.js

---

## 📦 Estrutura do Projeto

```
BI_PORTAL_SECURE/
├── 📄 Documentação (9 arquivos .md + SQL)
├── 🌐 Páginas HTML (7 páginas)
│   ├── index.html (login)
│   ├── trocar-senha.html
│   ├── dashboard.html (usuário)
│   └── admin/
│       ├── index.html (dashboard)
│       ├── usuarios.html
│       ├── relatorios.html
│       └── setores.html
├── 🎨 Estilos CSS (3 arquivos)
│   ├── style.css (global)
│   ├── login.css
│   └── admin.css
└── ⚙️ JavaScript (5 módulos)
    ├── config.js (configurações)
    ├── auth.js (autenticação)
    ├── reports.js (relatórios)
    ├── admin.js (administração)
    └── main.js (utilitários)
```

---

## 🔒 Segurança

### Implementado
- ✅ Bcrypt para senhas (salt rounds: 10)
- ✅ Validação de força de senha
- ✅ Troca obrigatória no 1º acesso
- ✅ Proteção de rotas
- ✅ Row Level Security no Supabase
- ✅ Logs imutáveis de auditoria
- ✅ Sessão segura (localStorage)

### Boas Práticas
- ⚠️ Use HTTPS em produção
- ⚠️ Nunca comite `config.js` com credenciais
- ⚠️ Rotacione credenciais periodicamente
- ⚠️ Revise logs regularmente
- ⚠️ Desative usuários inativos

---

## 🎨 Screenshots

### Login
Interface moderna com validação de senha e troca obrigatória

### Dashboard Usuário
Cards com relatórios autorizados, visualização em modal

### Painel Admin
Sidebar navegável, estatísticas, gestão completa

---

## 💰 Custo

### Supabase (Banco de Dados)
- **Free:** R$ 0/mês (até 500MB + 2GB storage)
- **Pro:** ~R$ 100/mês (8GB + backup automático)

### Hospedagem
- **Netlify/Vercel:** R$ 0/mês (plano free)
- **Servidor próprio:** Custo existente

**Total:** R$ 0 a R$ 100/mês

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Minha nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

### Planejado
- [ ] Recuperação de senha por email
- [ ] Tema escuro/claro
- [ ] Exportar logs para Excel
- [ ] Favoritos de relatórios
- [ ] Notificações

### Futuro
- [ ] SSO (Single Sign-On)
- [ ] Active Directory
- [ ] App Mobile
- [ ] Multi-tenancy

---

## ❓ FAQ

**P: Precisa de servidor?**  
R: Não! Apenas hospedagem de arquivos estáticos.

**P: Funciona offline?**  
R: Não, precisa de internet para acessar Supabase e Power BI.

**P: Quantos usuários suporta?**  
R: Ilimitados (depende do plano Supabase).

**P: É seguro?**  
R: Sim! Usa criptografia Bcrypt e RLS no banco.

**P: Posso customizar?**  
R: Sim! Código aberto e bem documentado.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido para facilitar o gerenciamento seguro de relatórios Power BI.

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) - Backend as a Service
- [Power BI](https://powerbi.microsoft.com) - Business Intelligence
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Criptografia

---

## 📞 Suporte

- 📚 [Documentação Completa](INDEX.md)
- 💡 [Exemplos Práticos](EXEMPLOS.md)
- 🐛 [Reportar Bug](https://github.com/SEU_USUARIO/bi-portal-secure/issues)

---

<div align="center">

**🎉 Pronto para usar! Sistema 100% funcional!**

[⬆ Voltar ao topo](#-bi-portal-secure)

</div>
