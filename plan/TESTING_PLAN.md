# 🧪 Plano de Implementação de Testes - Context Reminder

## 📊 Análise da Aplicação

A extensão Context Reminder possui:

- **Função principal**: `activate()` - inicializa a extensão e configura listeners
- **Função de verificação**: `checkDocumentTokens()` - conta tokens e exibe avisos
- **Configurações**: modelo (claude/gpt) e limite de tokens
- **Dependências**: VS Code API, gpt-tokenizer

## 🎯 Plano de Implementação de Testes

### **Fase 1: Configuração da Infraestrutura de Testes**

#### 1.1 Instalação de Dependências de Teste

```bash
# Framework de testes para extensões VS Code
npm install --save-dev @vscode/test-runner mocha @types/mocha

# Utilitários de teste
npm install --save-dev sinon @types/sinon chai @types/chai

# Coverage (opcional)
npm install --save-dev nyc
```

#### 1.2 Estrutura de Diretórios

```
src/
  test/
    suite/
      extension.test.ts
      tokenCounter.test.ts
      configuration.test.ts
    runTest.ts
    index.ts
```

#### 1.3 Configuração do package.json

Adicionar scripts de teste:

```json
{
  "scripts": {
    "test": "vscode-test",
    "test:watch": "vscode-test --watch",
    "test:coverage": "nyc npm test"
  }
}
```

### **Fase 2: Testes Unitários**

#### 2.1 Testes da Função `checkDocumentTokens`

- ✅ Contagem correta de tokens para texto simples
- ✅ Diferença entre modelos Claude e GPT
- ✅ Tratamento de erro no tokenizer (fallback)
- ✅ Exibição de warning quando limite é excedido
- ✅ Não exibir warning quando dentro do limite

#### 2.2 Testes de Configuração

- ✅ Leitura de configurações padrão
- ✅ Atualização de configurações em tempo real
- ✅ Valores inválidos de configuração

#### 2.3 Testes de Integração com VS Code API

- ✅ Ativação da extensão
- ✅ Registro de event listeners
- ✅ Resposta a mudanças de documento
- ✅ Resposta a mudanças de editor ativo

### **Fase 3: Testes de Integração**

#### 3.1 Cenários Reais

- ✅ Abrir arquivo e verificar contagem inicial
- ✅ Digitar texto e verificar atualizações em tempo real
- ✅ Alternar entre modelos e verificar recálculo
- ✅ Alternar limite de tokens e verificar comportamento

### **Fase 4: Testes End-to-End**

#### 4.1 Fluxos Completos

- ✅ Instalação e ativação da extensão
- ✅ Workflow típico de usuário
- ✅ Performance com documentos grandes

### **Fase 5: Refatoração para Testabilidade**

#### 5.1 Separação de Responsabilidades

```typescript
// Criar classes/módulos testáveis
export class TokenCounter {
  countTokens(text: string, model: string): number;
}

export class ConfigurationManager {
  getModel(): string;
  getTokenLimit(): number;
}
```

## 📝 Exemplos de Implementação

### Estrutura de Teste Básico

**src/test/suite/extension.test.ts**

```typescript
import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";
import { checkDocumentTokens } from "../../extension";

describe("Extension Tests", () => {
  let showWarningMessageStub: sinon.SinonStub;

  beforeEach(() => {
    showWarningMessageStub = sinon.stub(vscode.window, "showWarningMessage");
  });

  afterEach(() => {
    showWarningMessageStub.restore();
  });

  it("should show warning when token limit exceeded", () => {
    const mockDocument = {
      getText: () => "a".repeat(10000), // Texto longo
    } as vscode.TextDocument;

    checkDocumentTokens(mockDocument, "gpt", 100);

    assert(showWarningMessageStub.called);
  });

  it("should not show warning when within limit", () => {
    const mockDocument = {
      getText: () => "short text",
    } as vscode.TextDocument;

    checkDocumentTokens(mockDocument, "gpt", 1000);

    assert(!showWarningMessageStub.called);
  });
});
```

### Teste de Contagem de Tokens

**src/test/suite/tokenCounter.test.ts**

```typescript
import * as assert from "assert";
import { checkDocumentTokens } from "../../extension";

describe("Token Counter Tests", () => {
  it("should count tokens differently for Claude vs GPT", () => {
    const text = "Hello world, this is a test message";

    // Mock document
    const mockDoc = { getText: () => text } as any;

    // Teste que Claude conta menos tokens que GPT
    // (implementação específica depende da refatoração)
  });

  it("should handle tokenizer errors gracefully", () => {
    // Teste fallback para contagem de caracteres
  });
});
```

### Teste de Configuração

**src/test/suite/configuration.test.ts**

```typescript
import * as assert from "assert";
import * as vscode from "vscode";

describe("Configuration Tests", () => {
  it("should use default values when not configured", () => {
    // Teste valores padrão
  });

  it("should update when configuration changes", () => {
    // Teste mudanças dinâmicas de configuração
  });
});
```

## 🏗️ Cronograma de Implementação

1. **Semana 1**: Configuração da infraestrutura

   - Instalação de dependências
   - Estrutura de arquivos de teste
   - Configuração do package.json

2. **Semana 2**: Testes unitários básicos

   - Testes da função `checkDocumentTokens`
   - Testes de configuração
   - Mocks básicos

3. **Semana 3**: Testes de integração

   - Integração com VS Code API
   - Cenários de uso real
   - Event listeners

4. **Semana 4**: Refatoração e otimização
   - Separação de responsabilidades
   - Melhoria da testabilidade
   - Documentação de testes

## 🎯 Métricas de Cobertura Alvo

- **Cobertura de código**: >90%
- **Cobertura de funções**: 100%
- **Cobertura de branches**: >85%

## 📦 Dependências de Teste

### Principais

- `@vscode/test-runner`: Framework oficial para testes de extensões VS Code
- `mocha`: Framework de testes JavaScript
- `@types/mocha`: Tipos TypeScript para Mocha
- `sinon`: Library para mocks, stubs e spies
- `@types/sinon`: Tipos TypeScript para Sinon
- `chai`: Biblioteca de assertions
- `@types/chai`: Tipos TypeScript para Chai

### Opcionais

- `nyc`: Ferramenta de cobertura de código
- `@vscode/test-cli`: CLI para executar testes

## 🚀 Comandos de Execução

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes específicos
npm test -- --grep "Token Counter"
```

## 📁 Estrutura Final de Arquivos

```
context-reminder/
├── src/
│   ├── extension.ts
│   └── test/
│       ├── runTest.ts
│       ├── index.ts
│       └── suite/
│           ├── extension.test.ts
│           ├── tokenCounter.test.ts
│           └── configuration.test.ts
├── package.json
├── tsconfig.json
├── TESTING_PLAN.md
└── README.md
```

## 🔧 Configurações Adicionais

### TSConfig para Testes

Pode ser necessário ajustar o `tsconfig.json` para incluir os arquivos de teste:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2020",
    "outDir": "out",
    "rootDir": "src",
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", ".vscode-test"]
}
```

## ✅ Checklist de Implementação

### Fase 1

- [ ] Instalar dependências de teste
- [ ] Criar estrutura de diretórios
- [ ] Configurar scripts no package.json
- [ ] Configurar arquivos base de teste

### Fase 2

- [ ] Implementar testes unitários básicos
- [ ] Criar mocks para VS Code API
- [ ] Testar função checkDocumentTokens
- [ ] Testar configurações

### Fase 3

- [ ] Testes de integração com VS Code
- [ ] Cenários de uso real
- [ ] Event listeners

### Fase 4

- [ ] Testes end-to-end
- [ ] Performance testing
- [ ] Workflow completo

### Fase 5

- [ ] Refatoração para melhor testabilidade
- [ ] Separação de responsabilidades
- [ ] Documentação final

---

Este plano garante que a extensão Context Reminder seja robusta, confiável e facilite futuras manutenções e adições de funcionalidades.
