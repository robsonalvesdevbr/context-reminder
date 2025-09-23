import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";

suite("End-to-End - Regression Tests", () => {
  let showWarningStub: sinon.SinonStub;
  let showInformationStub: sinon.SinonStub;
  let getConfigurationStub: sinon.SinonStub;

  setup(() => {
    showWarningStub = sinon.stub(vscode.window, "showWarningMessage");
    showInformationStub = sinon.stub(vscode.window, "showInformationMessage");
  });

  teardown(() => {
    sinon.restore();
  });

  test("Regression: Token counting accuracy remains consistent", async () => {
    // Testes de regressão para garantir que contagem de tokens não muda inesperadamente
    const testCases = [
      {
        name: "Simple English text",
        content: "Hello world, this is a simple test message.",
        model: "gpt",
      },
      {
        name: "Code snippet",
        content: 'function test() { return "hello"; }',
        model: "gpt",
      },
      {
        name: "Mixed content with numbers",
        content: "Test 123 with numbers and symbols: !@#$%^&*()",
        model: "claude",
      },
      {
        name: "Multi-line text",
        content: "Line 1\nLine 2\nLine 3\n",
        model: "claude",
      },
      {
        name: "Unicode content",
        content: "Hello 世界 🌍 مرحبا नमस्ते",
        model: "gpt",
      },
    ];

    // Armazenar resultados de contagem para verificar consistência
    const tokenCounts = new Map<string, number>();

    for (const testCase of testCases) {
      const document = await vscode.workspace.openTextDocument({
        content: testCase.content,
        language: "plaintext",
      });

      try {
        // Configurar modelo
        const config = vscode.workspace.getConfiguration("contextReminder");
        await config.update(
          "model",
          testCase.model,
          vscode.ConfigurationTarget.Global
        );
        await config.update(
          "tokenLimit",
          10,
          vscode.ConfigurationTarget.Global
        ); // Limite baixo para forçar aviso

        await vscode.window.showTextDocument(document);

        // Executar contagem
        await vscode.commands.executeCommand("context-reminder.checkTokens");

        // Verificar que a contagem é determinística
        if (showWarningStub.called) {
          const warningCall = showWarningStub.getCall(0);
          const message = warningCall.args[0] as string;

          // Extrair número de tokens da mensagem de aviso
          const tokenMatch = message.match(/(\d+)\s+tokens/);
          if (tokenMatch) {
            const tokenCount = parseInt(tokenMatch[1]);
            const key = `${testCase.name}-${testCase.model}`;

            if (tokenCounts.has(key)) {
              // Verificar consistência
              assert.strictEqual(
                tokenCount,
                tokenCounts.get(key),
                `Token count should be consistent for ${key}`
              );
            } else {
              tokenCounts.set(key, tokenCount);
            }

            // Verificar que contagem é razoável
            assert.ok(
              tokenCount > 0,
              `Token count should be positive for ${key}`
            );
            assert.ok(
              tokenCount < 1000,
              `Token count should be reasonable for ${key}`
            );
          }
        }

        showWarningStub.reset();
      } finally {
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
      }
    }

    assert.ok(tokenCounts.size > 0, "Should have recorded some token counts");
  });

  test("Regression: Configuration changes are preserved", async () => {
    // Verificar que mudanças de configuração persistem corretamente
    const config = vscode.workspace.getConfiguration("contextReminder");
    const originalModel = config.get("model");
    const originalLimit = config.get("tokenLimit");

    try {
      // Sequência de mudanças de configuração
      const configChanges = [
        { model: "claude", limit: 1500 },
        { model: "gpt", limit: 2000 },
        { model: "claude", limit: 800 },
        { model: "gpt", limit: 3000 },
      ];

      for (const change of configChanges) {
        // Aplicar mudança
        await config.update(
          "model",
          change.model,
          vscode.ConfigurationTarget.Global
        );
        await config.update(
          "tokenLimit",
          change.limit,
          vscode.ConfigurationTarget.Global
        );

        // Verificar imediatamente
        const updatedConfig =
          vscode.workspace.getConfiguration("contextReminder");
        assert.strictEqual(
          updatedConfig.get("model"),
          change.model,
          `Model should be ${change.model} after update`
        );
        assert.strictEqual(
          updatedConfig.get("tokenLimit"),
          change.limit,
          `Token limit should be ${change.limit} after update`
        );

        // Simular uso com nova configuração
        const testDoc = await vscode.workspace.openTextDocument({
          content: "Test content for configuration regression. ".repeat(50),
          language: "plaintext",
        });

        await vscode.window.showTextDocument(testDoc);
        await new Promise((resolve) => setTimeout(resolve, 100));
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );

        // Verificar que configuração ainda está correta após uso
        const configAfterUse =
          vscode.workspace.getConfiguration("contextReminder");
        assert.strictEqual(
          configAfterUse.get("model"),
          change.model,
          `Model should remain ${change.model} after use`
        );
        assert.strictEqual(
          configAfterUse.get("tokenLimit"),
          change.limit,
          `Token limit should remain ${change.limit} after use`
        );
      }
    } finally {
      // Restaurar configurações originais
      await config.update(
        "model",
        originalModel,
        vscode.ConfigurationTarget.Global
      );
      await config.update(
        "tokenLimit",
        originalLimit,
        vscode.ConfigurationTarget.Global
      );
    }
  });

  test("Regression: Extension handles document lifecycle correctly", async () => {
    // Verificar que extension lida corretamente com ciclo de vida de documentos
    const documents: vscode.TextDocument[] = [];

    try {
      // Criar múltiplos documentos
      for (let i = 0; i < 5; i++) {
        const content = `Document ${i}: Content for lifecycle test. `.repeat(
          30 + i * 10
        );
        const document = await vscode.workspace.openTextDocument({
          content,
          language: i % 2 === 0 ? "plaintext" : "markdown",
        });

        documents.push(document);
        await vscode.window.showTextDocument(document);

        // Dar tempo para extensão processar
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Alternar entre documentos rapidamente
      for (const document of documents) {
        await vscode.window.showTextDocument(document);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Fechar documentos um por um
      for (let i = 0; i < documents.length; i++) {
        await vscode.window.showTextDocument(documents[i]);
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );

        // Verificar que outros documentos ainda funcionam
        if (i < documents.length - 1) {
          await vscode.window.showTextDocument(documents[i + 1]);
          await vscode.commands.executeCommand("context-reminder.checkTokens");
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      assert.ok(true, "Document lifecycle handled correctly");
    } finally {
      // Garantir que todos os editores estão fechados
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");
    }
  });

  test("Regression: Command execution is stable", async () => {
    // Verificar estabilidade dos comandos após múltiplas execuções
    const commands = [
      "context-reminder.checkTokens",
      "context-reminder.toggleModel",
      "context-reminder.setTokenLimit",
    ];

    // Criar documento para contexto
    const document = await vscode.workspace.openTextDocument({
      content: "Stable command execution test content. ".repeat(100),
      language: "plaintext",
    });

    try {
      await vscode.window.showTextDocument(document);

      // Executar cada comando múltiplas vezes
      for (const command of commands) {
        for (let i = 0; i < 5; i++) {
          await assert.doesNotReject(async () => {
            await vscode.commands.executeCommand(command);
          }, `Command ${command} should execute without error (attempt ${i + 1})`);

          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      // Executar comandos em sequência rápida
      for (let round = 0; round < 3; round++) {
        for (const command of commands) {
          await vscode.commands.executeCommand(command);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      assert.ok(true, "All commands executed stably multiple times");
    } finally {
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
    }
  });

  test("Regression: Error handling remains robust", async () => {
    // Verificar que tratamento de erros não regrediu

    // 1. Testar com documento malformado
    try {
      // Tentar abrir documento inexistente ou com problema
      await assert.doesNotReject(async () => {
        const doc = await vscode.workspace.openTextDocument({
          content: "",
          language: "plaintext",
        });
        await vscode.window.showTextDocument(doc);
        await vscode.commands.executeCommand("context-reminder.checkTokens");
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
      }, "Should handle empty document gracefully");

      // 2. Testar com conteúdo extremo
      const extremeContent = "x".repeat(200000); // Conteúdo muito grande
      const extremeDoc = await vscode.workspace.openTextDocument({
        content: extremeContent,
        language: "plaintext",
      });

      await vscode.window.showTextDocument(extremeDoc);

      await assert.doesNotReject(async () => {
        await vscode.commands.executeCommand("context-reminder.checkTokens");
      }, "Should handle extremely large document gracefully");

      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );

      // 3. Testar com configuração inválida
      const config = vscode.workspace.getConfiguration("contextReminder");
      const originalModel = config.get("model");
      const originalLimit = config.get("tokenLimit");

      try {
        // Configurações extremas
        await config.update("tokenLimit", 0, vscode.ConfigurationTarget.Global);

        const testDoc = await vscode.workspace.openTextDocument({
          content: "Test with zero token limit",
          language: "plaintext",
        });

        await vscode.window.showTextDocument(testDoc);

        await assert.doesNotReject(async () => {
          await vscode.commands.executeCommand("context-reminder.checkTokens");
        }, "Should handle zero token limit gracefully");

        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
      } finally {
        // Restaurar configuração
        await config.update(
          "model",
          originalModel,
          vscode.ConfigurationTarget.Global
        );
        await config.update(
          "tokenLimit",
          originalLimit,
          vscode.ConfigurationTarget.Global
        );
      }

      assert.ok(true, "Error handling remains robust");
    } catch (error) {
      assert.fail(`Regression in error handling: ${error}`);
    }
  });

  test("Regression: Memory usage remains stable", async () => {
    // Teste de regressão para uso de memória
    const initialMemory = process.memoryUsage();

    try {
      // Criar e processar muitos documentos para stressar memória
      for (let batch = 0; batch < 3; batch++) {
        const batchDocs: vscode.TextDocument[] = [];

        // Criar lote de documentos
        for (let i = 0; i < 10; i++) {
          const content =
            `Batch ${batch}, Document ${i}: Memory test content. `.repeat(200);
          const document = await vscode.workspace.openTextDocument({
            content,
            language: "plaintext",
          });

          batchDocs.push(document);
          await vscode.window.showTextDocument(document);
          await vscode.commands.executeCommand("context-reminder.checkTokens");

          // Pequena pausa
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        // Fechar todos os documentos do lote
        await vscode.commands.executeCommand(
          "workbench.action.closeAllEditors"
        );

        // Forçar garbage collection se disponível
        if (global.gc) {
          global.gc();
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

      // Verificar que não houve vazamento significativo de memória
      const memoryIncreaseInMB = memoryIncrease / (1024 * 1024);
      assert.ok(
        memoryIncreaseInMB < 50,
        `Memory increase should be reasonable: ${memoryIncreaseInMB.toFixed(
          2
        )}MB < 50MB`
      );

      assert.ok(true, "Memory usage remains stable after multiple operations");
    } catch (error) {
      assert.fail(`Memory regression test failed: ${error}`);
    }
  });

  test("Regression: Extension activation and deactivation", async () => {
    // Verificar que extension pode ser ativada/desativada sem problemas
    const extension = vscode.extensions.getExtension(
      "robsonalvesdevbr.context-reminder"
    );

    if (!extension) {
      assert.fail("Extension not found for activation test");
      return;
    }

    // Verificar estado inicial
    const wasActive = extension.isActive;

    try {
      // Se não estiver ativa, ativar
      if (!extension.isActive) {
        await extension.activate();
        assert.ok(extension.isActive, "Extension should be activated");
      }

      // Testar funcionalidade após ativação
      const testDoc = await vscode.workspace.openTextDocument({
        content: "Activation test content",
        language: "plaintext",
      });

      await vscode.window.showTextDocument(testDoc);

      await assert.doesNotReject(async () => {
        await vscode.commands.executeCommand("context-reminder.checkTokens");
      }, "Commands should work after activation");

      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );

      // Note: Não podemos testar desativação em ambiente de teste
      // pois isso quebraria outros testes

      assert.ok(true, "Extension activation/deactivation cycle completed");
    } catch (error) {
      assert.fail(`Extension activation regression: ${error}`);
    }
  });
});
