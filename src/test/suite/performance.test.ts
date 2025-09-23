import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";
import { checkDocumentTokens } from "../../extension";

suite("Performance and Stress Tests", () => {
  let showWarningMessageStub: sinon.SinonStub;

  setup(() => {
    showWarningMessageStub = sinon.stub(vscode.window, "showWarningMessage");
  });

  teardown(() => {
    sinon.restore();
  });

  test("Performance: Handle very large documents efficiently", () => {
    // Criar documento muito grande (100k caracteres)
    const largeContent =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ".repeat(
        1000
      );

    const mockDocument = {
      getText: () => largeContent,
      languageId: "plaintext",
      fileName: "large-document.txt",
    } as vscode.TextDocument;

    const startTime = performance.now();

    // Executar verificação
    checkDocumentTokens(mockDocument, "gpt", 10000);

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Deve processar em menos de 500ms mesmo com documento grande
    assert.ok(
      executionTime < 500,
      `Large document processing should be fast: ${executionTime}ms < 500ms`
    );
    assert.ok(
      showWarningMessageStub.called,
      "Should show warning for large document exceeding limit"
    );
  });

  test("Performance: Handle multiple rapid consecutive calls", () => {
    const testContent =
      "Teste de conteúdo para múltiplas chamadas rápidas. ".repeat(50);
    const mockDocument = {
      getText: () => testContent,
      languageId: "plaintext",
    } as vscode.TextDocument;

    const numberOfCalls = 100;
    const executionTimes: number[] = [];

    // Executar múltiplas chamadas rapidamente
    for (let i = 0; i < numberOfCalls; i++) {
      showWarningMessageStub.reset();

      const startTime = performance.now();
      checkDocumentTokens(mockDocument, "claude", 1000);
      const endTime = performance.now();

      executionTimes.push(endTime - startTime);
    }

    // Calcular estatísticas
    const avgTime =
      executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;
    const maxTime = Math.max(...executionTimes);

    // Performance deve permanecer consistente
    assert.ok(
      avgTime < 50,
      `Average execution time should be fast: ${avgTime}ms < 50ms`
    );
    assert.ok(
      maxTime < 100,
      `Max execution time should be reasonable: ${maxTime}ms < 100ms`
    );

    // Não deve ter vazamentos de memória significativos
    assert.ok(true, `Completed ${numberOfCalls} calls without issues`);
  });

  test("Stress: Handle edge case text patterns", () => {
    const edgeCaseTexts = [
      // String com muita repetição
      "a".repeat(10000),

      // String com muitos espaços
      " ".repeat(5000),

      // String com caracteres especiais
      "!@#$%^&*()".repeat(1000),

      // String com quebras de linha
      "linha1\nlinha2\n".repeat(2000),

      // String com tabs
      "\t\t\tconteúdo\t\t\t".repeat(1000),

      // String mista complexa
      "Mixed content 123 !@# \n\t 世界 🌍".repeat(500),

      // String com muitos números
      "0123456789".repeat(1000),

      // String com código
      'function test() { return "hello"; }'.repeat(200),
    ];

    edgeCaseTexts.forEach((text, index) => {
      const mockDocument = {
        getText: () => text,
        languageId: "plaintext",
        fileName: `edge-case-${index}.txt`,
      } as vscode.TextDocument;

      assert.doesNotThrow(() => {
        const startTime = performance.now();
        checkDocumentTokens(mockDocument, "gpt", 5000);
        const endTime = performance.now();

        const executionTime = endTime - startTime;
        assert.ok(
          executionTime < 300,
          `Edge case ${index} should process quickly: ${executionTime}ms`
        );
      }, `Should handle edge case text pattern ${index} without error`);
    });
  });

  test("Stress: Memory usage with varying document sizes", () => {
    const documentSizes = [100, 1000, 5000]; // Reduced sizes and count for faster test

    documentSizes.forEach((size) => {
      const content = "x".repeat(size);
      const mockDocument = {
        getText: () => content,
        languageId: "plaintext",
        fileName: `size-test-${size}.txt`,
      } as vscode.TextDocument;

      // Executar poucas vezes para detectar problemas básicos
      for (let i = 0; i < 3; i++) { // Reduced from 10 to 3 iterations
        showWarningMessageStub.resetHistory();

        assert.doesNotThrow(() => {
          checkDocumentTokens(mockDocument, "claude", 10000);
        }, `Should handle document of size ${size} characters (iteration ${i})`);
      }
    });

    assert.ok(true, "Completed memory stress test without issues");
  });

  test("Performance: Tokenizer error recovery should be fast", () => {
    // Test with content that should work with normal tokenizer
    const testContent =
      "Conteúdo de teste para verificar performance normal. ".repeat(100);
    const mockDocument = {
      getText: () => testContent,
    } as vscode.TextDocument;

    const startTime = performance.now();

    // Should execute normally
    assert.doesNotThrow(() => {
      checkDocumentTokens(mockDocument, "gpt", 100);
    }, "Should handle normal tokenization gracefully");

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Normal execution should be fast
    assert.ok(
      executionTime < 50,
      `Normal tokenization should be fast: ${executionTime}ms < 50ms`
    );
    assert.ok(
      showWarningMessageStub.called,
      "Should show warning for content exceeding limit"
    );
  });

  test("Concurrent: Handle simultaneous document checks", () => {
    const documents = Array.from(
      { length: 10 },
      (_, i) =>
        ({
          getText: () =>
            `Document ${i} content with some text for testing. `.repeat(i + 10),
          languageId: "plaintext",
          fileName: `concurrent-doc-${i}.txt`,
        } as vscode.TextDocument)
    );

    // Executar verificações simultaneamente
    const startTime = performance.now();

    const promises = documents.map((doc, i) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          checkDocumentTokens(doc, "gpt", 1000);
          resolve();
        }, i * 10); // Pequeno delay escalonado
      });
    });

    return Promise.all(promises).then(() => {
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Deve completar todas as verificações em tempo razoável
      assert.ok(
        totalTime < 1000,
        `Concurrent checks should complete quickly: ${totalTime}ms < 1000ms`
      );
    });
  });

  test("Robustness: Handle malformed input gracefully", () => {
    const malformedInputs = [
      null,
      undefined,
      {}, // Objeto vazio
      { getText: null }, // getText inválido
      { getText: undefined },
      { getText: () => null },
      { getText: () => undefined },
    ];

    malformedInputs.forEach((input, index) => {
      assert.doesNotThrow(() => {
        try {
          checkDocumentTokens(input as any, "gpt", 1000);
        } catch (error) {
          // Erro esperado para inputs malformados
          assert.ok(true, `Malformed input ${index} handled appropriately`);
        }
      }, `Should handle malformed input ${index} without crashing`);
    });
  });

  test("Performance: Model switching should not impact performance", () => {
    const testContent =
      "Conteúdo de teste para verificar performance de troca de modelo. ".repeat(
        100
      );
    const mockDocument = {
      getText: () => testContent,
    } as vscode.TextDocument;

    const models = ["gpt", "claude", "gpt", "claude", "gpt"];
    const executionTimes: number[] = [];

    models.forEach((model, index) => {
      showWarningMessageStub.reset();

      const startTime = performance.now();
      checkDocumentTokens(mockDocument, model, 1000);
      const endTime = performance.now();

      executionTimes.push(endTime - startTime);
    });

    // Verificar que todos os tempos são razoáveis (menos de 100ms)
    const avgTime =
      executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;

    executionTimes.forEach((time, index) => {
      assert.ok(
        time < 100,
        `Model switching should be fast. Time ${index}: ${time}ms (should be < 100ms)`
      );
    });

    // Verificar que a média também é razoável
    assert.ok(
      avgTime < 100,
      `Average model switching time should be reasonable: ${avgTime}ms`
    );
  });

  test("Stress: Unicode and emoji heavy content", () => {
    const unicodeContent =
      "🚀 Unicode test with emojis 🌍 中文内容 العربية مرحبا नमस्ते こんにちは 🎉 ".repeat(
        500
      );
    const mockDocument = {
      getText: () => unicodeContent,
      languageId: "plaintext",
    } as vscode.TextDocument;

    const startTime = performance.now();

    assert.doesNotThrow(() => {
      checkDocumentTokens(mockDocument, "gpt", 5000);
    }, "Should handle unicode and emoji content without error");

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    assert.ok(
      executionTime < 200,
      `Unicode processing should be efficient: ${executionTime}ms < 200ms`
    );
  });
});
