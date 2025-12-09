# 💍 Nosso Casamento - Plataforma de Organização

Uma plataforma completa e moderna para organização de casamentos, desenvolvida com Next.js 14, TypeScript, PostgreSQL e Prisma.

## 🚀 Funcionalidades

### 1. Dashboard do Casamento
- Visão geral do andamento
- Percentual concluído das tarefas
- Próximos itens a resolver
- Contagem regressiva para a data do casamento
- Resumo financeiro rápido

### 2. Lista do Enxoval da Casa
- Itens divididos por categorias
- Controle de preço, loja e status
- Possibilidade de adicionar links

### 3. Planejamento do Evento
- Locais de cerimônia e recepção com Google Maps
- Lista completa de fornecedores
- Controle de pagamentos e contatos

### 4. Tarefas do Casamento
- Organizadas por etapas (12-9 meses, 9-6 meses, etc.)
- Sistema de prioridades
- Alertas para tarefas atrasadas ou urgentes

### 5. Financeiro do Casamento
- Controle de gastos por categoria
- Sistema de depósitos (total juntado)
- Comparativo estimado x real
- Gráficos e resumos visuais

### 6. Lista de Convidados
- Controle completo de convidados e acompanhantes
- Status de confirmação
- Filtros por status

### 7. Documentos e Itens Importantes
- Checklist de documentos
- Links e anotações importantes
- Cronograma do dia do casamento

### 8. Anotações e Inspirações
- Área livre para ideias
- Categorias: decoração, música, cartas, votos, playlist

### 9. Área ADM
- Configuração inicial do casamento
- Edição de dados principais
- Controle de usuários

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM
- **Tailwind CSS** - Estilização
- **date-fns** - Manipulação de datas
- **lucide-react** - Ícones

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório** (ou use os arquivos criados)

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o banco de dados:**

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/casamento_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-key-aqui-gerar-com-openssl-rand-base64-32"
APP_NAME="Nosso Casamento"
```

**Importante:** Substitua:
- `usuario` pelo seu usuário do PostgreSQL
- `senha` pela sua senha do PostgreSQL
- `casamento_db` pelo nome do banco de dados que você criou
- Gere um `NEXTAUTH_SECRET` usando: `openssl rand -base64 32`

4. **Crie o banco de dados no PostgreSQL:**

```sql
CREATE DATABASE casamento_db;
```

5. **Execute as migrações do Prisma:**

```bash
npx prisma generate
npx prisma db push
```

6. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

7. **Acesse a aplicação:**

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📱 Uso

1. **Primeiro acesso:**
   - Acesse `/register` para criar uma conta
   - Faça login em `/login`

2. **Configuração inicial:**
   - Após o login, você será redirecionado para `/admin`
   - Configure os dados principais do casamento (nome do casal, data, local, meta financeira)

3. **Comece a usar:**
   - Navegue pelos módulos através do menu
   - Adicione informações conforme necessário
   - Tudo será sincronizado automaticamente

## 🎨 Design

- **Mobile-first**: Interface otimizada para celular
- **Cores suaves**: Tons de casamento (wedding-500, rose-500)
- **Tipografia moderna**: Playfair Display para títulos, Inter para textos
- **Botões grandes**: Fácil de tocar em telas pequenas (mínimo 44x44px)

## 📁 Estrutura do Projeto

```
casamento/
├── app/                    # Páginas Next.js (App Router)
│   ├── api/               # Rotas da API
│   ├── admin/             # Área administrativa
│   ├── dashboard/         # Dashboard principal
│   ├── enxoval/           # Lista de enxoval
│   ├── planejamento/      # Planejamento do evento
│   ├── tarefas/           # Tarefas do casamento
│   ├── financeiro/        # Controle financeiro
│   ├── convidados/       # Lista de convidados
│   ├── documentos/        # Documentos importantes
│   └── anotacoes/         # Anotações e inspirações
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── prisma/                # Schema do Prisma
└── public/                # Arquivos estáticos
```

## 🔐 Segurança

- Autenticação baseada em cookies
- Senhas criptografadas com bcrypt
- Validação de dados no servidor
- Proteção de rotas privadas

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente no seu provedor
2. Execute `npm run build`
3. Execute `npm start`

**Recomendações:**
- Use um serviço de banco de dados gerenciado (ex: Supabase, Railway)
- Configure HTTPS
- Use variáveis de ambiente seguras

## 📝 Licença

Este projeto foi criado para uso pessoal. Sinta-se livre para usar e modificar conforme necessário.

## 💡 Próximos Passos (Sugestões)

- Login social (Google, Facebook)
- Backup automático
- Exportação em PDF
- Notificações por e-mail
- Compartilhamento de convites
- Galeria de fotos

---

Desenvolvido com 💕 para tornar a organização do casamento mais fácil e especial!

