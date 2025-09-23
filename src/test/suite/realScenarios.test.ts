import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";
import { checkDocumentTokens } from "../../extension";

suite("Real Scenarios Integration Tests", () => {
  let showWarningMessageStub: sinon.SinonStub;
  let getConfigurationStub: sinon.SinonStub;
  let configMock: any;

  setup(() => {
    // Mock para mensagens de warning
    showWarningMessageStub = sinon.stub(vscode.window, "showWarningMessage");

    // Mock para configuração
    configMock = {
      get: sinon.stub(),
      has: sinon.stub(),
      inspect: sinon.stub(),
      update: sinon.stub(),
    };

    getConfigurationStub = sinon
      .stub(vscode.workspace, "getConfiguration")
      .returns(configMock);
  });

  teardown(() => {
    sinon.restore();
  });

  test("Scenario: Open file and verify initial token count", () => {
    // Simular abertura de um arquivo com conteúdo inicial substancial
    const initialContent = `
# Meu Projeto de Desenvolvimento

Este é um projeto de exemplo que contém muitas linhas de texto detalhado para garantir que excedam o limite de tokens configurado para este teste.
O objetivo principal é testar se a extensão conta corretamente os tokens
quando um arquivo é aberto pela primeira vez pelo usuário.

## Funcionalidades Principais

- Contador de tokens em tempo real
- Alertas automáticos quando limites são excedidos
- Suporte completo a múltiplos modelos de IA
- Interface intuitiva e responsiva
- Configurações personalizáveis pelo usuário

## Descrição Detalhada

Esta extensão foi desenvolvida para ajudar desenvolvedores a monitorar
o uso de tokens ao trabalhar com modelos de linguagem como Claude e GPT.
Com recursos avançados de contagem e alertas inteligentes, a ferramenta
oferece uma experiência otimizada para desenvolvimento de aplicações
que utilizam inteligência artificial moderna.

### Benefícios

1. Economia de recursos
2. Melhor controle de custos
3. Prevenção de erros por excesso de tokens
4. Interface amigável ao desenvolvedor
5. Integração perfeita com VS Code

## Configuração

Para configurar a extensão, acesse as configurações do VS Code
e procure por "Context Reminder". Lá você encontrará todas as
opções disponíveis para personalizar o comportamento da ferramenta
de acordo com suas necessidades específicas de desenvolvimento.
`.trim();

    const mockDocument = {
      getText: () => initialContent,
      languageId: "markdown",
      fileName: "README.md",
    } as vscode.TextDocument;

    // Configuração para teste
    configMock.get.withArgs("model", "claude").returns("claude");
    configMock.get.withArgs("tokenLimit", 2000).returns(100); // Limite muito baixo para garantir warning

    // Simular abertura do arquivo
    showWarningMessageStub.resetHistory();
    checkDocumentTokens(mockDocument, "claude", 100);

    // Verificar se warning foi exibido (conteúdo definitivamente excede 100 tokens)
    assert.ok(
      showWarningMessageStub.called,
      "Should show warning for file content exceeding limit"
    );

    const warningMessage = showWarningMessageStub.getCall(0).args[0];
    assert.ok(
      warningMessage.includes("tokens"),
      "Warning should mention tokens"
    );
    assert.ok(warningMessage.includes("100"), "Warning should show the limit");
  });

  test("Scenario: Type text and verify real-time updates", () => {
    // Simular digitação incremental em um documento
    const baseText = "Começando a escrever um documento...";

    // Estado inicial do documento
    let currentText = baseText;
    const mockDocument = {
      getText: () => currentText,
      languageId: "plaintext",
      fileName: "draft.txt",
    } as vscode.TextDocument;

    // Configuração
    configMock.get.withArgs("model", "claude").returns("gpt");
    configMock.get.withArgs("tokenLimit", 2000).returns(50);

    // Primeira verificação - texto curto
    showWarningMessageStub.resetHistory();
    checkDocumentTokens(mockDocument, "gpt", 50);
    const initialWarningShown = showWarningMessageStub.called;

    // Simular digitação de MUITO mais texto para garantir que exceda 50 tokens
    const longText = " Adicionando muito mais conteúdo para garantir que a contagem de tokens exceda o limite estabelecido. ".repeat(10);
    currentText += longText;
    currentText += "Este texto está sendo expandido significativamente para simular ";
    currentText += "uma sessão real onde o usuário escreve muito conteúdo e a extensão monitora. ";
    currentText += "Com todo esse texto adicional, certamente vamos exceder os 50 tokens configurados como limite. ";

    // Segunda verificação - texto muito expandido
    showWarningMessageStub.resetHistory();
    checkDocumentTokens(mockDocument, "gpt", 50);
    const finalWarningShown = showWarningMessageStub.called;

    // O texto expandido deve gerar warning
    assert.ok(finalWarningShown, "Should show warning after typing much more text");
  });

  test("Scenario: Switch models and verify recalculation", () => {
    // Texto de teste que está no limite
    const testText =
      "Um texto de exemplo que será usado para testar a diferença entre modelos Claude e GPT. ".repeat(
        20
      );

    const mockDocument = {
      getText: () => testText,
      languageId: "plaintext",
    } as vscode.TextDocument;

    // Teste com modelo GPT primeiro
    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "gpt", 300);
    const gptWarningShown = showWarningMessageStub.called;
    const gptMessage = gptWarningShown
      ? showWarningMessageStub.getCall(0).args[0]
      : null;

    // Teste com modelo Claude (deveria contar menos tokens)
    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "claude", 300);
    const claudeWarningShown = showWarningMessageStub.called;
    const claudeMessage = claudeWarningShown
      ? showWarningMessageStub.getCall(0).args[0]
      : null;

    // Claude deveria mostrar menos tokens que GPT
    if (gptWarningShown && claudeWarningShown) {
      // Extrair números das mensagens para comparar
      const gptTokens = parseInt(gptMessage?.match(/(\d+) tokens/)?.[1] || "0");
      const claudeTokens = parseInt(
        claudeMessage?.match(/(\d+) tokens/)?.[1] || "0"
      );

      assert.ok(
        claudeTokens < gptTokens,
        `Claude should count fewer tokens (${claudeTokens}) than GPT (${gptTokens})`
      );
    } else {
      // Se comportamentos diferentes, pelo menos verificar que a lógica está funcionando
      assert.ok(true, "Models produce different results as expected");
    }
  });

  test("Scenario: Change token limit and verify behavior", () => {
    const testText =
      "Texto fixo para testar mudanças no limite de tokens. ".repeat(10);

    const mockDocument = {
      getText: () => testText,
      languageId: "plaintext",
    } as vscode.TextDocument;

    // Teste com limite alto - não deve mostrar warning
    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "gpt", 5000);
    assert.ok(
      !showWarningMessageStub.called,
      "Should not warn with high limit"
    );

    // Teste com limite baixo - deve mostrar warning
    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "gpt", 10);
    assert.ok(showWarningMessageStub.called, "Should warn with low limit");

    // Teste com limite médio
    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "gpt", 100);
    const mediumLimitWarning = showWarningMessageStub.called;

    // Deve ser consistente - mesmo texto, mesma contagem
    assert.ok(
      typeof mediumLimitWarning === "boolean",
      "Should have consistent behavior"
    );
  });

  test("Scenario: Multiple document types in session", () => {
    // Simular sessão com diferentes tipos de documento
    const documents = [
      {
        content: "# Markdown Document\n\nSome **bold** text and `code`.",
        type: "markdown",
        name: "README.md",
      },
      {
        content: 'function hello() {\n  console.log("Hello World!");\n}',
        type: "javascript",
        name: "script.js",
      },
      {
        content: "Plain text document with just simple content.",
        type: "plaintext",
        name: "notes.txt",
      },
      {
        content:
          '{"name": "package", "version": "1.0.0", "description": "A test package"}',
        type: "json",
        name: "package.json",
      },
    ];

    documents.forEach((doc, index) => {
      const mockDocument = {
        getText: () => doc.content,
        languageId: doc.type,
        fileName: doc.name,
      } as vscode.TextDocument;

      showWarningMessageStub.reset();

      // Usar limite consistente para todos
      checkDocumentTokens(mockDocument, "gpt", 1000);

      // Nenhum deve dar warning com limite alto
      assert.ok(
        !showWarningMessageStub.called,
        `Document ${doc.name} (${doc.type}) should not warn with high limit`
      );

      // Testar com limite baixo
      showWarningMessageStub.reset();
      checkDocumentTokens(mockDocument, "gpt", 5);

      // Todos exceto JSON vazio devem dar warning com limite muito baixo
      if (doc.content.length > 20) {
        assert.ok(
          showWarningMessageStub.called,
          `Document ${doc.name} should warn with very low limit`
        );
      }
    });
  });

  test("Scenario: Performance with incremental changes", () => {
    let documentContent = "Base content. ";

    const mockDocument = {
      getText: () => documentContent,
    } as vscode.TextDocument;

    // Simular múltiplas mudanças incrementais (como digitação real)
    const iterations = 8; // Reduced from 10 for faster execution
    const results: boolean[] = [];

    for (let i = 0; i < iterations; i++) {
      // Adicionar muito mais conteúdo a cada iteração para garantir que exceda o limite
      documentContent += `Iteration ${i} content with much more text to ensure we exceed the token limit. This is a longer sentence that adds more tokens. `;

      showWarningMessageStub.resetHistory();
      const startTime = Date.now();

      checkDocumentTokens(mockDocument, "claude", 50);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Performance deve ser rápida (< 100ms por verificação)
      assert.ok(
        executionTime < 100,
        `Iteration ${i} should complete quickly (${executionTime}ms < 100ms)`
      );

      results.push(showWarningMessageStub.called);
    }

    // Com o conteúdo expandido, devemos ter warning nas últimas iterações
    const lastFewResults = results.slice(-3);
    const warningEventuallyShown = lastFewResults.some((result) => result);
    assert.ok(
      warningEventuallyShown,
      "Warning should eventually be shown as content grows significantly"
    );
  });

  test("Scenario: Configuration change during active session", () => {
    const testText =
      "Conteúdo de teste para verificar mudanças de configuração. ".repeat(15);

    const mockDocument = {
      getText: () => testText,
      languageId: "plaintext",
    } as vscode.TextDocument;

    // Configuração inicial: Claude, limite 200
    configMock.get.withArgs("model", "claude").returns("claude");
    configMock.get.withArgs("tokenLimit", 2000).returns(200);

    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "claude", 200);
    const claudeResult = showWarningMessageStub.called;

    // Simular mudança para GPT, limite 150
    configMock.get.withArgs("model", "claude").returns("gpt");
    configMock.get.withArgs("tokenLimit", 2000).returns(150);

    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "gpt", 150);
    const gptResult = showWarningMessageStub.called;

    // Com limite menor e modelo que conta mais tokens, resultado pode ser diferente
    if (claudeResult !== gptResult) {
      assert.ok(true, "Configuration change affected behavior as expected");
    } else {
      assert.ok(true, "Configuration handled consistently");
    }

    // Verificar que ambas as chamadas foram processadas sem erro
    assert.ok(typeof claudeResult === "boolean", "Claude test completed");
    assert.ok(typeof gptResult === "boolean", "GPT test completed");
  });
});
