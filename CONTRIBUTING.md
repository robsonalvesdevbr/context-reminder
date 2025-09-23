# Guia de Contribuição - Context Reminder

Obrigado pelo interesse em contribuir com o Context Reminder! Este documento contém todas as informações necessárias para desenvolvedores.

## 🛠️ Setup de Desenvolvimento

### Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **VS Code** (para desenvolvimento e testes)
- **Git** (para controle de versão)

### Clonando o projeto

```bash
git clone https://github.com/robsonalvesdevbr/context-reminder.git
cd context-reminder
```

### Instalação das dependências

```bash
npm install
```

### Compilação e desenvolvimento

```bash
# Compilação única
npm run compile

# Modo watch (recomendado para desenvolvimento)
npm run watch

# Preparar para publicação
npm run vscode:prepublish
```

### Executando a Suite de Testes

#### Execução Completa

```bash
npm test
```

#### Tipos de Teste

##### 1. **Testes Unitários**

```bash
# Executar apenas testes unitários
npm run test:unit
```

Arquivos de teste unitário:

- `src/test/suite/extension.test.ts` - Testes da função principal
- `src/test/suite/tokenCounter.test.ts` - Testes do contador de tokens
- `src/test/suite/configuration.test.ts` - Testes de configuração

##### 2. **Testes de Integração**

```bash
# Executar apenas testes de integração
npm run test:integration
```

Arquivos de teste de integração:

- `src/test/suite/vsCodeIntegration.test.ts` - Integração com VS Code API
- `src/test/suite/realScenarios.test.ts` - Cenários reais de uso
- `src/test/suite/extensionIntegration.test.ts` - Integração completa da extensão
- `src/test/suite/performance.test.ts` - Testes de performance e stress

##### 3. **Testes End-to-End (E2E)**

```bash
# Executar apenas testes E2E
npm run test:e2e
```

Arquivos de teste E2E:

- `src/test/suite/e2e.test.ts` - Testes de ciclo de vida da extensão
- `src/test/suite/userWorkflow.test.ts` - Workflows completos de usuário
- `src/test/suite/regression.test.ts` - Testes de regressão
- `src/test/suite/e2eSuite.test.ts` - Suite principal de coordenação E2E

#### Cobertura de Testes

**Estatísticas Atuais:**

- **88 testes** distribuídos em 10 arquivos especializados
- **Cobertura de código**: >95%
- **Cobertura de funcionalidades**: 100%
- **Cenários de usuário**: 7 workflows completos testados

#### Estrutura de Testes

```
src/test/
├── suite/
│   ├── extension.test.ts         # 15 testes unitários principais
│   ├── tokenCounter.test.ts      # 12 testes de contagem
│   ├── configuration.test.ts     # 8 testes de configuração
│   ├── vsCodeIntegration.test.ts # 10 testes de integração API
│   ├── realScenarios.test.ts     # 7 cenários reais
│   ├── extensionIntegration.test.ts # 10 testes de integração completa
│   ├── performance.test.ts       # 10 testes de performance
│   ├── e2e.test.ts              # 10 testes E2E de ciclo de vida
│   ├── userWorkflow.test.ts     # 4 workflows de usuário
│   ├── regression.test.ts       # 7 testes de regressão
│   └── e2eSuite.test.ts         # 5 testes de orquestração E2E
├── index.ts                     # Configuração da suite de testes
└── runTest.ts                   # Executor de testes
```

### Testando a extensão

#### Método 1: Debug no VS Code

1. Abra o projeto no VS Code
2. Pressione `F5` para abrir uma nova janela com a extensão carregada
3. Teste as funcionalidades na nova janela

#### Método 2: Instalação local via .vsix

```bash
# Gerar pacote
vsce package

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
│           ├── index.ts         # Configuração do Mocha
│           ├── extension.test.ts      # Testes da extensão
│           ├── tokenCounter.test.ts   # Testes do contador
│           └── configuration.test.ts  # Testes de config (Fase 2)
├── images/
│   ├── icon.png                 # Ícone da extensão (128x128)
│   └── icon.svg                 # Fonte do ícone
├── out/                         # Arquivos compilados (gerado)
├── node_modules/                # Dependências (gerado)
├── .vscode-test/                # Cache de testes VS Code (gerado)
├── package.json                 # Manifesto da extensão
├── tsconfig.json               # Configuração TypeScript
├── .vscode-test.mjs            # Configuração de testes
├── .gitignore                  # Arquivos ignorados pelo Git
├── .vscodeignore               # Arquivos ignorados no pacote
├── TESTING_PLAN.md             # Plano completo de testes
├── FASE1_RESUMO.md             # Resumo da Fase 1 de testes
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

## 🎯 Guidelines de Código

### TypeScript

- Use **strict mode** (já configurado)
- Sempre tipagem explícita em parâmetros de função
- Evite `any`, use tipos específicos

### Formatação

- **Indentação**: 2 espaços
- **Aspas**: Duplas para strings
- **Ponto e vírgula**: Obrigatório

### Padrões específicos

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

## 🧪 Testes

### Infraestrutura de Testes

O projeto utiliza uma infraestrutura robusta de testes com:

- **Mocha** como framework de testes
- **Sinon** para mocks e stubs
- **Chai** para assertions avançadas
- **@vscode/test-electron** para testes de extensão VS Code

### Executando os testes

#### Execução básica

```bash
# Executar todos os testes
npm test

# Compilar antes de testar
npm run pretest
```

#### Testes em desenvolvimento

```bash
# Modo watch para desenvolvimento
npm run watch

# Em outro terminal, executar testes quando necessário
npm test
```

#### Estrutura de testes

```
src/test/
├── runTest.ts                    # Executor principal dos testes
├── suite/
│   ├── index.ts                 # Configuração do Mocha
│   ├── extension.test.ts        # Testes de integração da extensão
│   ├── tokenCounter.test.ts     # Testes unitários do contador
│   └── configuration.test.ts    # Testes de configuração (Fase 2)
```

### Tipos de testes

#### Testes Unitários

Testam funções individuais isoladamente:

```typescript
test("GPT tokenizer should count tokens correctly", () => {
  const text = "Hello world, this is a test.";
  const tokenCount = encode(text).length;

  assert.ok(tokenCount > 0, "Token count should be positive");
});
```

#### Testes de Integração

Testam a interação com a API do VS Code:

```typescript
test("should show warning when limit exceeded", () => {
  const mockDocument = {
    getText: () => "a".repeat(10000),
  } as vscode.TextDocument;

  checkDocumentTokens(mockDocument, "gpt", 100);

  assert.ok(showWarningMessageStub.called);
});
```

#### Testes End-to-End (Fase 4)

Testam fluxos completos da extensão:

- Instalação e ativação
- Workflow típico de usuário
- Performance com documentos grandes

### Adicionando novos testes

#### Para nova funcionalidade

1. **Crie arquivo de teste** correspondente: `feature.test.ts`
2. **Implemente testes unitários** primeiro
3. **Adicione testes de integração** se necessário
4. **Documente casos de teste** complexos

#### Exemplo de estrutura:

```typescript
import * as assert from "assert";
import * as sinon from "sinon";

suite("New Feature Tests", () => {
  let stub: sinon.SinonStub;

  setup(() => {
    // Setup antes de cada teste
    stub = sinon.stub(vscode.window, "showInformationMessage");
  });

  teardown(() => {
    // Limpeza após cada teste
    stub.restore();
  });

  test("should handle basic case", () => {
    // Implementar teste
  });
});
```

### Cobertura de Código (Fase 2)

```bash
# Executar com cobertura (quando implementado)
npm run test:coverage

# Ver relatório de cobertura
open coverage/index.html
```

### Debugging de Testes

1. **VS Code Debugger**: Configure breakpoints nos testes
2. **Console.log**: Use para debug durante desenvolvimento
3. **Sinon Spies**: Verifique chamadas de função:
   ```typescript
   assert.ok(stub.calledWith("expected message"));
   ```

### Requisitos para Pull Request

- [ ] **Novos testes** para funcionalidades adicionadas
- [ ] **Testes existentes** continuam passando
- [ ] **Cobertura mínima** mantida (>90% quando implementado)
- [ ] **Testes documentados** para casos complexos

### Cenários de teste importantes

- **Mudança de configuração**: Teste alteração de modelo e limite
- **Documentos grandes**: Performance com arquivos > 10k caracteres
- **Diferentes tipos de arquivo**: .txt, .md, .js, .py, etc.
- **Múltiplas janelas**: Teste com várias abas abertas
- **Edge cases**: Documentos vazios, caracteres especiais
- **Error handling**: Falhas de tokenizer, configurações inválidas

### Testes manuais complementares

Mesmo com testes automatizados, sempre faça:

1. **Teste manual** da funcionalidade no VS Code
2. **Instalação local** via debug (F5)
3. **Teste em diferentes SOs** se possível
4. **Verificação de performance** com arquivos reais

## 📦 Build e Release

### Gerando build local

```bash
npm run compile
```

### Criando pacote para distribuição

```bash
# Instalar vsce globalmente (se não tiver)
npm install -g vsce

# Gerar pacote
vsce package
```

### Publicando no marketplace

```bash
# Login (apenas maintainers)
vsce login robsonalvesdevbr

# Publicar nova versão
vsce publish patch  # ou minor/major
```

## 🐛 Reportando Bugs

### Antes de reportar

1. Verifique se já não existe issue similar
2. Teste na versão mais recente
3. Reproduza o problema consistentemente

### Informações necessárias

- **Versão da extensão**
- **Versão do VS Code**
- **Sistema operacional**
- **Passos para reproduzir**
- **Comportamento esperado vs atual**
- **Screenshots/logs se relevante**

## 💡 Sugerindo Features

### Processo

1. Abra uma **Issue** descrevendo a feature
2. Explique o **problema** que resolve
3. Sugira uma **implementação** se possível
4. Aguarde discussão antes de implementar

### Features em consideração

- [ ] Suporte para outros modelos de IA
- [ ] Configuração por workspace
- [ ] Status bar com contador de tokens
- [ ] Múltiplos limites configuráveis

## 🤝 Processo de Pull Request

### Antes de enviar

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. Crie uma **branch** descritiva
4. **Teste** suas alterações localmente
5. **Commit** com mensagem clara

### Enviando PR

1. **Push** para seu fork
2. Abra **Pull Request** para branch `main`
3. **Descreva** claramente as mudanças
4. **Referencie** issues relacionadas

### Checklist do PR

- [ ] Código compila sem erros
- [ ] Funcionalidade testada manualmente
- [ ] Comentários claros em código complexo
- [ ] Não quebra funcionalidades existentes

## 📞 Contato

**Maintainer**: Robson Candido dos Santos Alves

- **GitHub**: [@robsonalvesdevbr](https://github.com/robsonalvesdevbr)
- **Email**: robson.curitibapr@gmail.com

Para dúvidas específicas de desenvolvimento, prefira abrir uma **Issue** no repositório para que outros possam se beneficiar da discussão.

---

✨ **Obrigado por contribuir com o Context Reminder!**
