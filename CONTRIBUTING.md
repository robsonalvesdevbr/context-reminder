# Guia de Contribuição - Context Reminder

Obrigado pelo interesse em contribuir com o Context Reminder! Este documento contém todas as informações necessárias para desenvolvedores.

## 📋 Índice

- [Setup de Desenvolvimento](#-setup-de-desenvolvimento)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura da Extensão](#-arquitetura-da-extensão)
- [Executando Testes](#-executando-testes)
- [Guidelines de Código](#-guidelines-de-código)
- [Build e Release](#-build-e-release)
- [Changelog e Versionamento](#-changelog-e-versionamento)
- [Processo de Pull Request](#-processo-de-pull-request)
- [Contato](#-contato)

## 🛠️ Setup de Desenvolvimento

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **VS Code** (para desenvolvimento e testes)
- **Git** (para controle de versão)

### Configuração inicial

```bash
# Clonando o projeto
git clone https://github.com/robsonalvesdevbr/context-reminder.git
cd context-reminder

# Instalação das dependências
npm install

# Build com esbuild para desenvolvimento (recomendado)
npm run esbuild

# Modo watch com esbuild (recomendado para desenvolvimento)
npm run esbuild-watch

# Alternativa: Compilação TypeScript tradicional
npm run compile
npm run watch
```

### Testando a extensão

#### Método 1: Debug no VS Code
1. Abra o projeto no VS Code
2. Pressione `F5` para abrir uma nova janela com a extensão carregada
3. Teste as funcionalidades na nova janela

#### Método 2: Instalação local via .vsix
```bash
# Gerar pacote
npm run package

# Instalar localmente
code --install-extension context-reminder-X.X.X.vsix
```

## 📁 Estrutura do Projeto

```
context-reminder/
├── src/
│   ├── extension.ts             # Código principal da extensão
│   └── test/                    # Testes automatizados
│       ├── runTest.ts           # Executor de testes
│       └── suite/               # Suites de teste
├── images/
│   ├── icon.png                 # Ícone da extensão (128x128)
│   └── icon.svg                 # Fonte do ícone
├── out/                         # Arquivos compilados (gerado)
├── package.json                 # Manifesto da extensão
├── tsconfig.json               # Configuração TypeScript
├── .vscode-test.mjs            # Configuração de testes
├── TESTING_PLAN.md             # Plano completo de testes
├── CLAUDE.md                   # Instruções para Claude Code
├── CONTRIBUTING.md             # Este arquivo
└── README.md                   # Documentação principal
```

## 🧩 Arquitetura da Extensão

### Componentes principais

**Extension Entry Point (`src/extension.ts`)**:
- `activate()`: Inicializa a extensão e configura listeners
- `checkDocumentTokens()`: Função principal de contagem e alertas
- `deactivate()`: Limpeza ao desativar a extensão

**Sistema de Configuração**:
- `contextReminder.model`: Tipo de modelo ("claude" | "gpt")
- `contextReminder.tokenLimit`: Limite de tokens (número)
- Atualização em tempo real via `onDidChangeConfiguration`

**Monitoramento de Tokens**:
- Usa biblioteca `gpt-tokenizer` como base
- Aplica fator de correção para Claude (75% do valor GPT)
- Monitoramento contínuo via `onDidChangeTextDocument`

### Fluxo de funcionamento

1. **Ativação**: Extension ativa quando VS Code inicia
2. **Configuração**: Lê settings do usuário
3. **Monitoramento**: Escuta mudanças no documento ativo
4. **Contagem**: Calcula tokens baseado no modelo selecionado
5. **Alerta**: Mostra warning se exceder limite configurado

## 🧪 Executando Testes

### Execução Completa

```bash
npm test
```

### Arquivos de Teste Atuais

Estrutura de testes do projeto:

#### Testes Unitários
- `extension.test.ts` - Testes da função principal
- `tokenCounter.test.ts` - Testes do contador de tokens
- `configuration.test.ts` - Testes de configuração

#### Testes de Integração
- `vsCodeIntegration.test.ts` - Integração com VS Code API
- `realScenarios.test.ts` - Cenários reais de uso
- `extensionIntegration.test.ts` - Integração completa da extensão
- `performance.test.ts` - Testes de performance e stress

### Cobertura de Testes

**Estatísticas Atuais:**
- **7 arquivos de teste** especializados
- **Cobertura de funcionalidades**: Completa
- **Tipos**: Testes unitários e de integração
- **Performance e cenários reais**: Incluídos

## 🎯 Guidelines de Código

### TypeScript
- Use **strict mode** (já configurado)
- Sempre tipagem explícita em parâmetros de função
- Evite `any`, use tipos específicos

### Formatação
- **Indentação**: 2 espaços
- **Aspas**: Duplas para strings
- **Ponto e vírgula**: Obrigatório

### Exemplo de código correto
```typescript
// ✅ Bom
function checkDocumentTokens(
  document: vscode.TextDocument,
  model: string,
  tokenLimit: number
): void {
  // código aqui
}

// ❌ Evitar
function checkDocumentTokens(document, model, tokenLimit) {
  // código aqui
}
```

### Tratamento de erros
- Sempre use try-catch para operações que podem falhar
- Tenha fallbacks para situações de erro
- Log erros no console para debug

```typescript
try {
  const tokenCount = encode(text).length;
} catch (error) {
  console.error("Erro ao contar tokens:", error);
  // Fallback: estimativa baseada em caracteres
  tokenCount = Math.ceil(text.length / 4);
}
```

## 📦 Build e Release

### Compilação local

```bash
# Build com esbuild (recomendado)
npm run esbuild

# Build para produção (minificado)
npm run vscode:prepublish

# Alternativa: Compilação TypeScript tradicional
npm run compile
```

### Sistema de Build (esbuild)

A partir da versão 0.1.0, utilizamos **esbuild** para bundling:

**Vantagens:**
- ✅ **Bundling completo** - Todas dependências incluídas no arquivo final
- ✅ **Performance** - Build mais rápido que TypeScript
- ✅ **Minificação** - Código otimizado para produção
- ✅ **Resolução de dependências** - Sem erros de "module not found"

**Scripts disponíveis:**
- `npm run esbuild` - Build com sourcemap (desenvolvimento)
- `npm run esbuild-watch` - Build em modo watch
- `npm run esbuild-base` - Build base (sem sourcemap)
- `npm run vscode:prepublish` - Build minificado (produção)

### Preparando Release

#### 1. Atualizar Changelog
```bash
# Usar scripts automatizados para changelog
npm run changelog:add X.Y.Z added "✨ Nova funcionalidade"
npm run changelog:add X.Y.Z fixed "🐛 Bug corrigido"
```

#### 2. Atualizar package.json
```bash
# Atualizar versão manualmente em package.json
# ou usar npm version
npm version patch  # ou minor/major
```

#### 3. Compilar e testar
```bash
# Build com esbuild (recomendado)
npm run esbuild

# Executar testes
npm test
```

### Criando pacote para distribuição

```bash
# Instalar vsce globalmente (se não tiver)
npm install -g vsce

# Gerar pacote
npm run package
```

### Publicando no marketplace

```bash
# Login (apenas maintainers)
vsce login robsonalvesdevbr

# Publicar nova versão
npm run publish
```

#### Checklist pré-publicação

- [ ] ✅ Changelog atualizado com todas as mudanças
- [ ] ✅ Versão atualizada no package.json
- [ ] ✅ README.md atualizado se necessário
- [ ] ✅ Todos os testes passando (`npm test`)
- [ ] ✅ Build local funcionando (`npm run esbuild`)
- [ ] ✅ Build de produção funcionando (`npm run vscode:prepublish`)
- [ ] ✅ Testado manualmente no VS Code
- [ ] ✅ Pacote gerado sem erros (`npm run package`)
- [ ] ✅ Verificar se bundle inclui todas dependências (arquivo ~3MB)

## 📋 Changelog e Versionamento

### Mantendo o Changelog

Este projeto segue o padrão [Keep a Changelog](https://keepachangelog.com/) com versionamento [semântico](https://semver.org/).

#### Scripts para Changelog

```bash
# Adicionar nova funcionalidade
npm run changelog:add 0.1.0 added "✨ Novo comando para exportar estatísticas"

# Corrigir bug
npm run changelog:add 0.0.5 fixed "🐛 Corrigido problema na contagem de emojis"

# Melhorar performance
npm run changelog:add 0.0.5 changed "🚀 Performance 50% mais rápida"
```

#### Tipos de Mudança

| Tipo | Quando usar | Emoji |
|------|-------------|--------|
| `added` | Novas funcionalidades | ✨ |
| `changed` | Mudanças em funcionalidades existentes | 🔄 |
| `deprecated` | Funcionalidades que serão removidas | ⚠️ |
| `removed` | Funcionalidades removidas | ❌ |
| `fixed` | Correções de bugs | 🐛 |
| `security` | Correções de segurança | 🔒 |

### Versionamento Semântico

Seguimos [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0): Mudanças que quebram compatibilidade
- **MINOR** (0.1.0): Novas funcionalidades compatíveis
- **PATCH** (0.0.1): Correções de bugs compatíveis

## 🐛 Reportando Bugs

### Informações necessárias

- **Versão da extensão**
- **Versão do VS Code**
- **Sistema operacional**
- **Passos para reproduzir**
- **Comportamento esperado vs atual**
- **Screenshots/logs se relevante**

## 💡 Sugerindo Features

1. Abra uma **Issue** descrevendo a feature
2. Explique o **problema** que resolve
3. Sugira uma **implementação** se possível
4. Aguarde discussão antes de implementar

## 🤝 Processo de Pull Request

### Antes de enviar

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. Crie uma **branch** descritiva
4. **Teste** suas alterações localmente
5. **Commit** com mensagem clara

### Checklist do PR

- [ ] Código compila sem erros
- [ ] Funcionalidade testada manualmente
- [ ] Comentários claros em código complexo
- [ ] Não quebra funcionalidades existentes
- [ ] Testes adicionados para novas funcionalidades

## 📞 Contato

**Maintainer**: Robson Candido dos Santos Alves

- **GitHub**: [@robsonalvesdevbr](https://github.com/robsonalvesdevbr)
- **Email**: robson.curitibapr@gmail.com

Para dúvidas específicas de desenvolvimento, prefira abrir uma **Issue** no repositório para que outros possam se beneficiar da discussão.

---

✨ **Obrigado por contribuir com o Context Reminder!**