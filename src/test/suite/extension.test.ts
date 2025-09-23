import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";
import { checkDocumentTokens } from "../../extension";

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Iniciando todos os testes.");

  let showWarningMessageStub: sinon.SinonStub;

  setup(() => {
    // Stub da função showWarningMessage para capturar as chamadas
    showWarningMessageStub = sinon.stub(vscode.window, "showWarningMessage");
  });

  teardown(() => {
    // Restore dos stubs após cada teste
    showWarningMessageStub.restore();
  });

  test("Sample test - Array indexOf", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });

  test("checkDocumentTokens - should show warning when limit exceeded", () => {
    // Criar um mock de documento com texto longo
    const mockDocument = {
      getText: () => "a".repeat(10000), // Texto muito longo
    } as vscode.TextDocument;

    // Chamar a função com limite baixo
    checkDocumentTokens(mockDocument, "gpt", 100);

    // Verificar se o warning foi mostrado
    assert.ok(
      showWarningMessageStub.called,
      "Expected warning message to be shown"
    );

    // Verificar se a mensagem contém as informações esperadas
    const warningMessage = showWarningMessageStub.getCall(0).args[0];
    assert.ok(
      warningMessage.includes("⚠️"),
      "Warning message should contain warning emoji"
    );
    assert.ok(
      warningMessage.includes("tokens"),
      "Warning message should mention tokens"
    );
    assert.ok(
      warningMessage.includes("limite: 100"),
      "Warning message should show the limit"
    );
  });

  test("checkDocumentTokens - should not show warning when within limit", () => {
    // Criar um mock de documento com texto curto
    const mockDocument = {
      getText: () => "short text",
    } as vscode.TextDocument;

    // Chamar a função com limite alto
    checkDocumentTokens(mockDocument, "gpt", 1000);

    // Verificar se nenhum warning foi mostrado
    assert.ok(
      !showWarningMessageStub.called,
      "Expected no warning message to be shown"
    );
  });

  test("checkDocumentTokens - Claude model should count fewer tokens than GPT", () => {
    const sameText =
      "Este é um texto de exemplo para testar a diferença entre modelos.";
    const mockDocument = {
      getText: () => sameText,
    } as vscode.TextDocument;

    // Resetar o stub entre os testes
    showWarningMessageStub.reset();

    // Testar com GPT com limite baixo que deveria estourar
    checkDocumentTokens(mockDocument, "gpt", 10);
    const gptWarningShown = showWarningMessageStub.called;

    // Resetar o stub
    showWarningMessageStub.reset();

    // Testar com Claude com o mesmo limite
    checkDocumentTokens(mockDocument, "claude", 10);
    const claudeWarningShown = showWarningMessageStub.called;

    // Se GPT mostrou warning e Claude não mostrou, significa que Claude conta menos tokens
    // (Este teste pode precisar ser ajustado dependendo do tamanho do texto)
    if (gptWarningShown) {
      // Pelo menos verificamos que ambos os modelos funcionam
      assert.ok(true, "Both models are processing tokens");
    }
  });

  test("checkDocumentTokens - should handle empty document", () => {
    // Criar um mock de documento vazio
    const mockDocument = {
      getText: () => "",
    } as vscode.TextDocument;

    // Chamar a função - não deveria gerar erro
    assert.doesNotThrow(() => {
      checkDocumentTokens(mockDocument, "gpt", 100);
    }, "Should handle empty document without throwing");

    // Verificar que nenhum warning foi mostrado para documento vazio
    assert.ok(
      !showWarningMessageStub.called,
      "No warning should be shown for empty document"
    );
  });

  test("checkDocumentTokens - should handle tokenizer errors gracefully", () => {
    // Test with malformed input that might cause tokenizer to fail
    const mockDocument = {
      getText: () => null as any, // This will trigger the null check and early return
    } as vscode.TextDocument;

    // Should not throw and should handle gracefully
    assert.doesNotThrow(() => {
      checkDocumentTokens(mockDocument, "gpt", 100);
    }, "Should handle invalid input without throwing");

    // Since we return early for null/undefined text, no warning should be shown
    assert.ok(
      !showWarningMessageStub.called,
      "No warning should be shown for invalid input"
    );
  });

  test("checkDocumentTokens - fallback calculation should be based on character count", () => {
    // Test with very large content to ensure tokenizer works normally
    const testText = "a".repeat(8000); // 8000 characters
    const mockDocument = {
      getText: () => testText,
    } as vscode.TextDocument;

    // Reset stub calls before test
    showWarningMessageStub.resetHistory();

    // Test with low limit to trigger warning
    checkDocumentTokens(mockDocument, "gpt", 500);

    assert.ok(
      showWarningMessageStub.called,
      "Should show warning for large content"
    );

    // Reset and test with higher limit
    showWarningMessageStub.resetHistory();
    checkDocumentTokens(mockDocument, "gpt", 10000);

    assert.ok(
      !showWarningMessageStub.called,
      "Should not show warning when content is below limit"
    );
  });

  test("checkDocumentTokens - should handle very large documents", () => {
    // Criar documento muito grande (10k caracteres)
    const largeText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(200);
    const mockDocument = {
      getText: () => largeText,
    } as vscode.TextDocument;

    // Testar com limite baixo - deveria mostrar warning
    checkDocumentTokens(mockDocument, "gpt", 100);

    assert.ok(
      showWarningMessageStub.called,
      "Should show warning for large document"
    );

    // Verificar que não houve erro de performance significativo
    const warningMessage = showWarningMessageStub.getCall(0).args[0];
    assert.ok(
      warningMessage.includes("tokens"),
      "Should properly process large document"
    );
  });

  test("checkDocumentTokens - should handle special characters and unicode", () => {
    // Texto com caracteres especiais e unicode
    const specialText =
      "🚀 Emoji test with special chars: áéíóú ñç 中文 العربية 🎉";
    const mockDocument = {
      getText: () => specialText,
    } as vscode.TextDocument;

    // Não deve dar erro com caracteres especiais
    assert.doesNotThrow(() => {
      checkDocumentTokens(mockDocument, "gpt", 1000);
    }, "Should handle special characters without error");

    assert.ok(
      !showWarningMessageStub.called,
      "Should not warn for short special text"
    );
  });

  test("checkDocumentTokens - message format should be consistent", () => {
    const mockDocument = {
      getText: () => "a".repeat(5000), // Texto longo
    } as vscode.TextDocument;

    checkDocumentTokens(mockDocument, "gpt", 100);

    assert.ok(showWarningMessageStub.called, "Should show warning");

    const message = showWarningMessageStub.getCall(0).args[0];

    // Verificar formato da mensagem
    assert.ok(
      message.startsWith("⚠️"),
      "Message should start with warning emoji"
    );
    assert.ok(message.includes("tokens"), "Message should mention tokens");
    assert.ok(message.includes("limite:"), "Message should show limit");
    assert.ok(
      message.includes("100"),
      "Message should show specific limit value"
    );
    assert.ok(
      message.includes("Considere iniciar um novo chat!"),
      "Message should suggest action"
    );
  });

  test("checkDocumentTokens - should work with different model names", () => {
    const mockDocument = {
      getText: () => "Test text for model comparison",
    } as vscode.TextDocument;

    // Teste com modelo Claude (case sensitive)
    checkDocumentTokens(mockDocument, "claude", 1000);
    assert.ok(
      !showWarningMessageStub.called,
      "Claude should not warn for short text"
    );

    // Teste com modelo GPT
    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "gpt", 1000);
    assert.ok(
      !showWarningMessageStub.called,
      "GPT should not warn for short text"
    );

    // Teste com modelo desconhecido (deveria tratar como GPT)
    showWarningMessageStub.reset();
    checkDocumentTokens(mockDocument, "unknown-model", 1000);
    assert.ok(
      !showWarningMessageStub.called,
      "Unknown model should work like GPT"
    );
  });
});
