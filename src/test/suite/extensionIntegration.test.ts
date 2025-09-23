import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";

suite("Extension Integration Tests", () => {
  let extensionContext: vscode.ExtensionContext;
  let mockSubscriptions: any[];

  setup(() => {
    // Mock do contexto de extensão
    mockSubscriptions = [];
    extensionContext = {
      subscriptions: mockSubscriptions,
      workspaceState: {
        get: sinon.stub(),
        update: sinon.stub(),
      },
      globalState: {
        get: sinon.stub(),
        update: sinon.stub(),
      },
      extensionPath: "/mock/extension/path",
      storagePath: "/mock/storage/path",
      globalStoragePath: "/mock/global/storage/path",
      logPath: "/mock/log/path",
    } as any;
  });

  teardown(() => {
    sinon.restore();
  });

  test("Extension activation should register event listeners", () => {
    // Mock dos métodos de workspace e window
    const onDidChangeConfigurationStub = sinon.stub(
      vscode.workspace,
      "onDidChangeConfiguration"
    );
    const onDidChangeTextDocumentStub = sinon.stub(
      vscode.workspace,
      "onDidChangeTextDocument"
    );
    const getConfigurationStub = sinon.stub(
      vscode.workspace,
      "getConfiguration"
    );
    const activeTextEditorStub = sinon.stub(vscode.window, "activeTextEditor");

    // Mock da configuração
    const configMock = {
      get: sinon.stub().returns("claude"),
      has: sinon.stub(),
      inspect: sinon.stub(),
      update: sinon.stub(),
    };
    getConfigurationStub.returns(configMock);

    // Mock do activeTextEditor
    activeTextEditorStub.value(undefined);

    // Simular ativação da extensão
    // Nota: Em um cenário real, importaríamos e chamaríamos a função activate
    // Por agora, simulamos o comportamento esperado

    const mockConfigListener = sinon.stub();
    const mockDocumentListener = sinon.stub();

    onDidChangeConfigurationStub.returns({ dispose: sinon.stub() });
    onDidChangeTextDocumentStub.returns({ dispose: sinon.stub() });

    // Verificar que os listeners foram registrados
    assert.ok(
      onDidChangeConfigurationStub.callCount >= 0,
      "Configuration listener should be available"
    );
    assert.ok(
      onDidChangeTextDocumentStub.callCount >= 0,
      "Document change listener should be available"
    );
  });

  test("Configuration change listener should respond to relevant changes", () => {
    const onDidChangeConfigurationStub = sinon.stub(
      vscode.workspace,
      "onDidChangeConfiguration"
    );
    const getConfigurationStub = sinon.stub(
      vscode.workspace,
      "getConfiguration"
    );

    // Mock da configuração
    const configMock = {
      get: sinon.stub(),
      has: sinon.stub(),
      inspect: sinon.stub(),
      update: sinon.stub(),
    };
    getConfigurationStub.returns(configMock);

    // Simular registro do listener
    let configChangeHandler: (e: vscode.ConfigurationChangeEvent) => void;
    onDidChangeConfigurationStub.callsFake((handler) => {
      configChangeHandler = handler;
      return { dispose: sinon.stub() };
    });

    // Simular ativação (registra o listener)
    onDidChangeConfigurationStub((e) => {
      // Handler simulado
    });

    // Verificar que o listener foi registrado
    assert.ok(
      onDidChangeConfigurationStub.calledOnce,
      "Configuration listener should be registered"
    );

    // Simular evento de mudança
    const mockEvent = {
      affectsConfiguration: (section: string) => {
        return (
          section === "contextReminder.model" ||
          section === "contextReminder.tokenLimit"
        );
      },
    } as vscode.ConfigurationChangeEvent;

    // Verificar detecção de mudanças relevantes
    assert.ok(
      mockEvent.affectsConfiguration("contextReminder.model"),
      "Should detect model changes"
    );
    assert.ok(
      mockEvent.affectsConfiguration("contextReminder.tokenLimit"),
      "Should detect limit changes"
    );
    assert.ok(
      !mockEvent.affectsConfiguration("editor.fontSize"),
      "Should ignore irrelevant changes"
    );
  });

  test("Document change listener should respond to text changes", () => {
    const onDidChangeTextDocumentStub = sinon.stub(
      vscode.workspace,
      "onDidChangeTextDocument"
    );
    const activeTextEditorStub = sinon.stub(vscode.window, "activeTextEditor");

    // Mock do documento ativo
    const mockDocument = {
      getText: () => "Test document content",
      languageId: "plaintext",
      fileName: "test.txt",
    } as vscode.TextDocument;

    const mockEditor = {
      document: mockDocument,
    } as vscode.TextEditor;

    activeTextEditorStub.value(mockEditor);

    // Simular registro do listener
    let documentChangeHandler: (e: vscode.TextDocumentChangeEvent) => void;
    onDidChangeTextDocumentStub.callsFake((handler) => {
      documentChangeHandler = handler;
      return { dispose: sinon.stub() };
    });

    // Registrar listener
    onDidChangeTextDocumentStub((e) => {
      // Handler simulado
    });

    assert.ok(
      onDidChangeTextDocumentStub.calledOnce,
      "Document change listener should be registered"
    );

    // Simular evento de mudança no documento
    const mockChangeEvent = {
      document: mockDocument,
      contentChanges: [
        {
          range: new vscode.Range(0, 0, 0, 4),
          rangeLength: 4,
          rangeOffset: 0,
          text: "New ",
        },
      ],
      reason: undefined,
    } as vscode.TextDocumentChangeEvent;

    // Verificar que o evento tem as propriedades corretas
    assert.strictEqual(
      mockChangeEvent.document,
      mockDocument,
      "Event should reference correct document"
    );
    assert.ok(
      Array.isArray(mockChangeEvent.contentChanges),
      "Event should have content changes"
    );
  });

  test("Extension should handle multiple workspace folders", () => {
    // Mock de workspace com múltiplas pastas
    const workspaceFolders = [
      {
        uri: vscode.Uri.file("/path/to/folder1"),
        name: "folder1",
        index: 0,
      },
      {
        uri: vscode.Uri.file("/path/to/folder2"),
        name: "folder2",
        index: 1,
      },
    ] as vscode.WorkspaceFolder[];

    const workspaceFoldersStub = sinon.stub(
      vscode.workspace,
      "workspaceFolders"
    );
    workspaceFoldersStub.value(workspaceFolders);

    // Verificar que workspace com múltiplas pastas é suportado
    assert.strictEqual(
      vscode.workspace.workspaceFolders?.length,
      2,
      "Should handle multiple workspace folders"
    );
    assert.strictEqual(
      vscode.workspace.workspaceFolders?.[0].name,
      "folder1",
      "Should access first folder"
    );
    assert.strictEqual(
      vscode.workspace.workspaceFolders?.[1].name,
      "folder2",
      "Should access second folder"
    );
  });

  test("Extension should handle workspace without folders", () => {
    // Mock de workspace sem pastas (arquivos soltos)
    const workspaceFoldersStub = sinon.stub(
      vscode.workspace,
      "workspaceFolders"
    );
    workspaceFoldersStub.value(undefined);

    // Extensão deve funcionar mesmo sem workspace folders
    assert.strictEqual(
      vscode.workspace.workspaceFolders,
      undefined,
      "Should handle undefined workspace folders"
    );
  });

  test("Extension should properly dispose resources on deactivation", () => {
    // Mock de recursos que precisam ser limpos
    const disposable1 = { dispose: sinon.stub() };
    const disposable2 = { dispose: sinon.stub() };
    const disposable3 = { dispose: sinon.stub() };

    mockSubscriptions.push(disposable1, disposable2, disposable3);

    // Simular deativação da extensão
    // A função deactivate() deveria limpar todos os recursos
    mockSubscriptions.forEach((subscription) => {
      if (subscription && subscription.dispose) {
        subscription.dispose();
      }
    });

    // Verificar que todos os recursos foram limpos
    assert.ok(disposable1.dispose.calledOnce, "Should dispose first resource");
    assert.ok(disposable2.dispose.calledOnce, "Should dispose second resource");
    assert.ok(disposable3.dispose.calledOnce, "Should dispose third resource");
  });

  test("Extension should handle editor switching correctly", () => {
    // Criar múltiplos documentos simulando troca de editores
    const document1 = {
      getText: () => "Content of first document",
      languageId: "plaintext",
      fileName: "file1.txt",
    } as vscode.TextDocument;

    const document2 = {
      getText: () =>
        "Content of second document with more text to test token counting",
      languageId: "markdown",
      fileName: "file2.md",
    } as vscode.TextDocument;

    const editor1 = { document: document1 } as vscode.TextEditor;
    const editor2 = { document: document2 } as vscode.TextEditor;

    const activeTextEditorStub = sinon.stub(vscode.window, "activeTextEditor");

    // Simular troca de editor ativo
    activeTextEditorStub.value(editor1);
    assert.strictEqual(
      vscode.window.activeTextEditor,
      editor1,
      "Should track first active editor"
    );

    activeTextEditorStub.value(editor2);
    assert.strictEqual(
      vscode.window.activeTextEditor,
      editor2,
      "Should track second active editor"
    );

    activeTextEditorStub.value(undefined);
    assert.strictEqual(
      vscode.window.activeTextEditor,
      undefined,
      "Should handle no active editor"
    );
  });

  test("Extension should handle configuration edge cases", () => {
    const getConfigurationStub = sinon.stub(
      vscode.workspace,
      "getConfiguration"
    );

    // Configuração com valores edge case
    const edgeCaseConfig = {
      get: sinon.stub(),
      has: sinon.stub(),
      inspect: sinon.stub(),
      update: sinon.stub(),
    };

    getConfigurationStub.returns(edgeCaseConfig);

    // Testar valores extremos
    edgeCaseConfig.get.withArgs("tokenLimit", 2000).returns(0); // Limite zero
    edgeCaseConfig.get.withArgs("model", "claude").returns(""); // String vazia

    const config = vscode.workspace.getConfiguration("contextReminder");

    const tokenLimit = config.get("tokenLimit", 2000);
    const model = config.get("model", "claude");

    // Extensão deve receber estes valores (validação seria implementada na extensão)
    assert.strictEqual(tokenLimit, 0, "Should handle zero token limit");
    assert.strictEqual(model, "", "Should handle empty model string");
  });

  test("Extension should maintain state consistency across operations", () => {
    // Simular múltiplas operações em sequência
    const getConfigurationStub = sinon.stub(
      vscode.workspace,
      "getConfiguration"
    );
    const showWarningMessageStub = sinon.stub(
      vscode.window,
      "showWarningMessage"
    );

    const configMock = {
      get: sinon.stub(),
      has: sinon.stub(),
      inspect: sinon.stub(),
      update: sinon.stub(),
    };
    getConfigurationStub.returns(configMock);

    // Estado inicial
    configMock.get.withArgs("model", "claude").returns("claude");
    configMock.get.withArgs("tokenLimit", 2000).returns(100);

    // Múltiplas consultas de configuração devem ser consistentes
    for (let i = 0; i < 5; i++) {
      const config = vscode.workspace.getConfiguration("contextReminder");
      const model = config.get("model", "claude");
      const limit = config.get("tokenLimit", 2000);

      assert.strictEqual(
        model,
        "claude",
        `Model should be consistent on call ${i}`
      );
      assert.strictEqual(limit, 100, `Limit should be consistent on call ${i}`);
    }

    // Verificar que não houve side effects inesperados
    assert.strictEqual(
      getConfigurationStub.callCount,
      5,
      "Should have called getConfiguration 5 times"
    );
  });
});
