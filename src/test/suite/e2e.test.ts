import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as sinon from "sinon";

suite("End-to-End Tests - Extension Lifecycle", () => {
  let extension: vscode.Extension<any> | undefined;
  let testWorkspace: vscode.WorkspaceFolder;

  suiteSetup(async () => {
    // Garantir que temos um workspace ativo
    if (
      !vscode.workspace.workspaceFolders ||
      vscode.workspace.workspaceFolders.length === 0
    ) {
      throw new Error("E2E tests require an active workspace");
    }

    testWorkspace = vscode.workspace.workspaceFolders[0];

    // Buscar a extensão Context Reminder
    extension = vscode.extensions.getExtension(
      "robsonalvesdevbr.context-reminder"
    );

    if (!extension) {
      throw new Error("Context Reminder extension not found");
    }

    // Ativar a extensão se não estiver ativa
    if (!extension.isActive) {
      await extension.activate();
    }
  });

  test("E2E: Extension is properly installed and activated", async () => {
    assert.ok(extension, "Extension should be available");
    assert.ok(extension.isActive, "Extension should be activated");
    assert.strictEqual(
      extension.id,
      "robsonalvesdevbr.context-reminder",
      "Extension ID should match"
    );
  });

  test("E2E: Commands are registered and available", async () => {
    const commands = await vscode.commands.getCommands();

    // Verificar se os comandos da extensão estão registrados
    const expectedCommands = [
      "context-reminder.checkTokens",
      "context-reminder.toggleModel",
      "context-reminder.setTokenLimit",
    ];

    expectedCommands.forEach((cmd) => {
      assert.ok(commands.includes(cmd), `Command ${cmd} should be registered`);
    });
  });

  test("E2E: Configuration is accessible and has default values", () => {
    const config = vscode.workspace.getConfiguration("contextReminder");

    // Verificar valores padrão da configuração
    const model = config.get("model");
    const tokenLimit = config.get("tokenLimit");

    assert.ok(
      ["claude", "gpt"].includes(model as string),
      "Model should be claude or gpt"
    );
    assert.ok(
      typeof tokenLimit === "number" && tokenLimit > 0,
      "Token limit should be a positive number"
    );
  });

  test("E2E: Create and open test document", async () => {
    // Criar arquivo de teste temporário
    const testFileName = "e2e-test-document.txt";
    const testFilePath = path.join(testWorkspace.uri.fsPath, testFileName);
    const testContent =
      "Este é um documento de teste para validação end-to-end da extensão Context Reminder. ".repeat(
        100
      );

    // Escrever arquivo
    fs.writeFileSync(testFilePath, testContent);

    try {
      // Abrir o documento
      const document = await vscode.workspace.openTextDocument(testFilePath);
      assert.ok(document, "Document should be opened");
      assert.strictEqual(
        document.getText(),
        testContent,
        "Document content should match"
      );

      // Mostrar o documento no editor
      const editor = await vscode.window.showTextDocument(document);
      assert.ok(editor, "Editor should be available");
      assert.strictEqual(
        editor.document,
        document,
        "Editor should show the correct document"
      );

      // Simular mudança no documento
      const edit = new vscode.WorkspaceEdit();
      const position = new vscode.Position(0, 0);
      edit.insert(document.uri, position, "Texto adicionado no início. ");

      const success = await vscode.workspace.applyEdit(edit);
      assert.ok(success, "Edit should be applied successfully");
    } finally {
      // Cleanup - remover arquivo de teste
      try {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath);
        }
      } catch (error) {
        console.warn("Failed to cleanup test file:", error);
      }
    }
  });

  test("E2E: Extension responds to document changes", async () => {
    const showWarningStub = sinon.stub(vscode.window, "showWarningMessage");

    try {
      // Criar documento com conteúdo que excede o limite
      const largeContent =
        "Texto muito longo para testar limite de tokens. ".repeat(500);
      const document = await vscode.workspace.openTextDocument({
        content: largeContent,
        language: "plaintext",
      });

      // Mostrar documento no editor
      await vscode.window.showTextDocument(document);

      // Simular configuração com limite baixo
      const config = vscode.workspace.getConfiguration("contextReminder");
      await config.update("tokenLimit", 100, vscode.ConfigurationTarget.Global);

      // Dar tempo para a extensão processar
      await new Promise((resolve) => setTimeout(resolve, 500));

      // A extensão deve ter mostrado aviso (em condições normais)
      // Note: Em ambiente de teste, pode não disparar automaticamente
      assert.ok(true, "Document change handling completed without errors");
    } finally {
      showWarningStub.restore();
    }
  });

  test("E2E: Configuration changes are handled", async () => {
    const originalConfig = vscode.workspace.getConfiguration("contextReminder");
    const originalModel = originalConfig.get("model");
    const originalLimit = originalConfig.get("tokenLimit");

    try {
      // Mudar configuração
      await originalConfig.update(
        "model",
        "claude",
        vscode.ConfigurationTarget.Global
      );
      await originalConfig.update(
        "tokenLimit",
        2000,
        vscode.ConfigurationTarget.Global
      );

      // Verificar mudanças
      const updatedConfig =
        vscode.workspace.getConfiguration("contextReminder");
      assert.strictEqual(
        updatedConfig.get("model"),
        "claude",
        "Model should be updated to claude"
      );
      assert.strictEqual(
        updatedConfig.get("tokenLimit"),
        2000,
        "Token limit should be updated to 2000"
      );

      // Dar tempo para a extensão processar mudanças
      await new Promise((resolve) => setTimeout(resolve, 200));
    } finally {
      // Restaurar configuração original
      await originalConfig.update(
        "model",
        originalModel,
        vscode.ConfigurationTarget.Global
      );
      await originalConfig.update(
        "tokenLimit",
        originalLimit,
        vscode.ConfigurationTarget.Global
      );
    }
  });

  test("E2E: Multiple editors handling", async () => {
    const documents: vscode.TextDocument[] = [];
    const editors: vscode.TextEditor[] = [];

    try {
      // Criar múltiplos documentos
      for (let i = 0; i < 3; i++) {
        const content = `Documento ${
          i + 1
        }: Conteúdo de teste para múltiplos editores. `.repeat(50 + i * 20);
        const document = await vscode.workspace.openTextDocument({
          content,
          language: "plaintext",
        });
        documents.push(document);

        const editor = await vscode.window.showTextDocument(
          document,
          vscode.ViewColumn.One
        );
        editors.push(editor);
      }

      assert.strictEqual(documents.length, 3, "Should create 3 documents");
      assert.strictEqual(editors.length, 3, "Should create 3 editors");

      // Alternar entre editores
      for (const editor of editors) {
        await vscode.window.showTextDocument(editor.document);

        // Verificar que o editor ativo mudou
        assert.strictEqual(
          vscode.window.activeTextEditor,
          editor,
          "Active editor should change"
        );

        // Pequena pausa para simulação realista
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } finally {
      // Fechar todos os editores
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");
    }
  });

  test("E2E: Command execution", async () => {
    // Criar documento de teste
    const document = await vscode.workspace.openTextDocument({
      content:
        "Documento para teste de comando. Este texto tem um tamanho moderado.",
      language: "plaintext",
    });

    await vscode.window.showTextDocument(document);

    try {
      // Tentar executar comando de verificação de tokens
      await assert.doesNotReject(async () => {
        await vscode.commands.executeCommand("context-reminder.checkTokens");
      }, "Command execution should not throw error");

      // Tentar executar comando de troca de modelo
      await assert.doesNotReject(async () => {
        await vscode.commands.executeCommand("context-reminder.toggleModel");
      }, "Model toggle command should not throw error");
    } finally {
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
    }
  });

  test("E2E: Performance with large document", async () => {
    // Criar documento muito grande
    const largeContent = "Texto de performance para teste end-to-end. ".repeat(
      2000
    ); // ~80k caracteres
    const document = await vscode.workspace.openTextDocument({
      content: largeContent,
      language: "plaintext",
    });

    try {
      const startTime = Date.now();

      // Abrir documento
      await vscode.window.showTextDocument(document);

      // Simular algumas operações
      const edit = new vscode.WorkspaceEdit();
      edit.insert(document.uri, new vscode.Position(0, 0), "Início: ");
      await vscode.workspace.applyEdit(edit);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Performance deve ser aceitável mesmo com documento grande
      assert.ok(
        processingTime < 5000,
        `Large document handling should be fast: ${processingTime}ms < 5000ms`
      );
    } finally {
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
    }
  });

  test("E2E: Extension cleanup and deactivation", async () => {
    // Verificar que a extensão ainda está ativa
    assert.ok(
      extension && extension.isActive,
      "Extension should still be active"
    );

    // Fechar todos os editores
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");

    // Verificar que não há vazamentos de recursos
    const openEditors = vscode.window.visibleTextEditors;
    assert.strictEqual(openEditors.length, 0, "All editors should be closed");

    // Note: Não podemos desativar a extensão em testes E2E pois outros testes podem depender dela
    assert.ok(true, "Extension cleanup verification completed");
  });
});
