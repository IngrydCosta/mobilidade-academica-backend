# Checklist de Implementação: Sistema de Toasts e Padronização de E-mail

> Este documento detalha o plano de ação para a substituição de alertas nativos do navegador (`alert()`) por um sistema moderno e estilizado de **Toasts**, além da padronização cromática dos e-mails enviados pelo backend.

---

## 🎨 1. Padronização Visual & Paleta da Aplicação

Para garantir coerência em toda a aplicação (telas, notificações e e-mails), os seguintes valores hexadecimais da marca serão aplicados:

| Elemento / Aplicação | Hex Code | Descrição |
| :--- | :--- | :--- |
| **Azul Primário (Sidebar/Botões)** | `#173764` | Cor principal da marca |
| **Azul Escuro (Títulos/Header)** | `#0E284E` | Destaque em cabeçalhos e títulos |
| **Azul Texto Profundo** | `#0C2445` | Utilizado para textos com alto contraste |
| **Dourado / Accent** | `#D9A95E` / `#D3A969` | Cor de destaque / estado ativo |
| **Sucesso (Toast)** | Fundo `#F0FDF4` / Borda `#22C55E` / Ícone `#15803D` | Verdes harmônicos |
| **Erro (Toast)** | Fundo `#FEF2F2` / Borda `#EF4444` / Ícone `#B91C1C` | Vermelhos de alerta |
| **Aviso (Toast)** | Fundo `#FFFBEB` / Borda `#F59E0B` / Ícone `#B45309` | Amarelos/Laranjas de atenção |

---

## 📋 2. Checklist Detalhado das Tarefas

### Fase 1: Padronização das Cores do E-mail (Back-end)
- [x] Atualizar o template HTML em `src/services/emailService.ts` no backend:
  - [x] Ajustar o azul do cabeçalho de `#0E284E` para o azul primário do front-end `#173764`.
  - [x] Padronizar bordas e elementos de destaque com o tom dourado `#D9A95E` e azul escuro `#0E284E`.
  - [x] Garantir formatação limpa e moderna para o e-mail de boas-vindas e de recuperação de senha.

### Fase 2: Desenvolvimento do Componente de Toast (Front-end)
- [x] Criar um sistema de Toasts customizado em `src/components/ui/Toast.tsx` e `src/context/ToastContext.tsx`:
  - [x] Suporte aos tipos: `success`, `error`, `info`, `warning`.
  - [x] Animações suaves de entrada/saída.
  - [x] Temporizador automático (ex: 4.5 segundos) com botão de fechar manual.
  - [x] Tipografia e cores alinhadas estritamente aos padrões do design do projeto (`#173764`, `#0E284E`, `font-sans` / `font-serif`).
- [x] Envolver a aplicação no `ToastProvider` em `src/App.tsx`.

### Fase 3: Substituição de `alert()` por Toasts (34 ocorrências)
- [x] **`src/pages/Login.tsx`** (2 alertas):
  - [x] Credenciais incorretas / Erro ao realizar login.
- [x] **`src/pages/CadastroUtilizador.tsx`** (8 alertas):
  - [x] Validações de campos obrigatórios (nome, e-mail, perfil, universidade).
  - [x] Sucesso e erro ao criar utilizador.
  - [x] Sucesso e erro ao atualizar utilizador.
  - [x] Sucesso e erro ao excluir utilizador.
- [x] **`src/pages/CadastroUniversidades.tsx`** (6 alertas):
  - [x] Validação de nome da universidade e país.
  - [x] Sucesso e erro ao cadastrar universidade.
  - [x] Sucesso e erro ao atualizar universidade.
- [x] **`src/pages/CadastroMobilidade.tsx`** (18 alertas):
  - [x] Validações de seleção de universidade/ano/semestre.
  - [x] Validações e erros de importação de planilha Excel/CSV.
  - [x] Sucesso e erro ao registrar/atualizar/excluir mobilidades.

### Fase 4: Testes & Validação
- [x] Testar disparos de Toast em todas as ações de sucesso e erro no front-end.
- [x] Executar suíte de testes automatizados (`vitest`) no back-end e front-end para garantir ausência de regressões.

### Fase 5: Agrupamento Inteligente & Edição Completa de Mobilidades
- [x] **Agrupamento Automático por Universidade, Ano e Semestre (Back-end)**:
  - [x] No `mobilityService.ts` (`create`), verificar se já existe um registro de `Mobility` para `(universityId, ano, semestre)`.
  - [x] Se já existir, mesclar/agrupar: vincular os novos estudantes ao registro existente e recalcular automaticamente `enviados` e `recebidos`.
  - [x] Se não existir, criar novo registro de mobilidade.
- [x] **Edição Completa da Mobilidade & Gestão de Estudantes (Back-end & Front-end)**:
  - [x] Permitir a edição dos dados do registro (`ano`, `semestre`, `universidade`).
  - [x] Bloquear edição manual de `enviados` e `recebidos` (quantidade sempre calculada automaticamente).
  - [x] Interface visual para expandir e gerenciar os estudantes de uma mobilidade:
    - [x] Editar dados do estudante (`nome`, `email`, `matricula`, `tipoMobilidade`, `cursoOrigem`, `cursoDestino`).
    - [x] Adicionar manualmente um estudante ao lote de mobilidade.
    - [x] Excluir um estudante do lote de mobilidade.
  - [x] Recálculo automático instantâneo dos totais de `enviados` e `recebidos` ao adicionar, editar tipo ou excluir um estudante.

### Fase 6: Dashboard Multidisciplinar & Privacidade LGPD
- [x] **Desbloqueio do Filtro de Universidade no Dashboard**:
  - [x] Permitir que o `GESTOR_MOBILIDADE` selecione qualquer universidade no `<UniversityFilter>` no `DashboardInterno.tsx`.
  - [x] Atualizar a consulta da API `/dashboard/private` para aceitar a universidade filtrada.
- [x] **Ocultação de Dados Sensíveis (LGPD) no Backend & Frontend**:
  - [x] No `dashboardsService.ts`, identificar se o registro pertence a outra universidade quando o usuário for `GESTOR_MOBILIDADE`.
  - [x] Omitir/ofuscar `nome`, `email` e `matricula` para mobilidades de outras universidades.
  - [x] Preservar `tipoMobilidade`, `paisOrigem`, `universidadeOrigem`, `paisDestino`, `universidadeDestino`, `cursoOrigem` e `cursoDestino`.
  - [x] No `UniversityModal.tsx`, adaptar a exibição para apresentar com clareza os dados analíticos sem expor dados pessoais dos alunos de terceiros.
- [x] **Proteção Reforçada nas Mutações via Postman/API**:
  - [x] Garantir validação estrita em `addStudent`, `updateStudent` e `deleteStudent` para bloquear manipulações de alunos de outras universidades.

