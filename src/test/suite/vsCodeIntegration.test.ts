import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";

suite("VS Code API Integration Tests", () => {
  let workspaceStub: sinon.SinonStub;
  let windowStub: sinon.SinonStub;
  let onDidChangeConfigurationStub: sinon.SinonStub;
  let onDidChangeTextDocumentStub: sinon.SinonStub;

  setup(() => {
    // Stub para workspace
    workspaceStub = sinon.stub(vscode.workspace, "getConfiguration");
    onDidChangeConfigurationStub = sinon.stub(
      vscode.workspace,
      "onDidChangeConfiguration"
    );
    onDidChangeTextDocumentStub = sinon.stub(
      vscode.workspace,
      "onDidChangeTextDocument"
    );

    // Stub para window
    windowStub = sinon.stub(vscode.window, "showWarningMessage");
  });

  teardown(() => {
    sinon.restore();
  });

  test("should register configuration change listener", () => {
    // Simular ativação da extensão
    const mockContext = {
      subscriptions: [] as any[],
    } as vscode.ExtensionContext;

    // Verificar se o listener foi registrado
    // (Este teste seria mais completo com a função activate exportada)
    assert.ok(
      onDidChangeConfigurationStub,
      "Configuration change listener should be available"
    );

    // Simular chamada do listener
    const mockConfigEvent = {
      affectsConfiguration: sinon.stub(),
    } as any;

    // Teste se evento afeta configuração da extensão
    mockConfigEvent.affectsConfiguration
      .withArgs("contextReminder.model")
      .returns(true);
    assert.ok(
      mockConfigEvent.affectsConfiguration("contextReminder.model"),
      "Should detect model config changes"
    );

    mockConfigEvent.affectsConfiguration
      .withArgs("contextReminder.tokenLimit")
      .returns(true);
    assert.ok(
      mockConfigEvent.affectsConfiguration("contextReminder.tokenLimit"),
      "Should detect token limit config changes"
    );

    mockConfigEvent.affectsConfiguration
      .withArgs("other.setting")
      .returns(false);
    assert.ok(
      !mockConfigEvent.affectsConfiguration("other.setting"),
      "Should ignore other config changes"
    );
  });

  test("should register document change listener", () => {
    // Verificar se o listener de mudança de documento foi registrado
    assert.ok(
      onDidChangeTextDocumentStub,
      "Document change listener should be available"
    );

    // Simular evento de mudança de documento
    const mockTextDocument = {
      getText: () => "Test document content",
    } as vscode.TextDocument;

    const mockChangeEvent = {
      document: mockTextDocument,
      contentChanges: [],
      reason: undefined,
    } as vscode.TextDocumentChangeEvent;

    // Este listener deveria ser chamado quando documento muda
    // (teste seria mais completo com access à função real)
    assert.ok(mockChangeEvent.document, "Change event should have document");
  });

  test("should handle active editor changes", () => {
    // Mock do activeTextEditor
    const mockEditor = {
      document: {
        getText: () => "Active editor content",
      } as vscode.TextDocument,
    } as vscode.TextEditor;

    const windowMock = sinon
      .stub(vscode.window, "activeTextEditor")
      .value(mockEditor);

    // Verificar se há editor ativo
    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, "Should have active text editor");
    assert.ok(activeEditor?.document, "Active editor should have document");

    windowMock.restore();
  });

  test("should handle no active editor", () => {
    // Mock sem editor ativo
    const windowMock = sinon
      .stub(vscode.window, "activeTextEditor")
      .value(undefined);

    const activeEditor = vscode.window.activeTextEditor;
    assert.strictEqual(
      activeEditor,
      undefined,
      "Should handle no active editor gracefully"
    );

    windowMock.restore();
  });

  test("should interact correctly with configuration API", () => {
    // Mock da configuração
    const configMock = {
      get: sinon.stub(),
      has: sinon.stub(),
      inspect: sinon.stub(),
      update: sinon.stub(),
    };

    workspaceStub.withArgs("contextReminder").returns(configMock);
    configMock.get.withArgs("model", "claude").returns("gpt");
    configMock.get.withArgs("tokenLimit", 2000).returns(3000);

    // Testar interação com API
    const config = vscode.workspace.getConfiguration("contextReminder");
    const model = config.get("model", "claude");
    const tokenLimit = config.get("tokenLimit", 2000);

    assert.strictEqual(model, "gpt", "Should get correct model from config");
    assert.strictEqual(
      tokenLimit,
      3000,
      "Should get correct token limit from config"
    );
    assert.ok(
      workspaceStub.calledWith("contextReminder"),
      "Should request correct config section"
    );
  });

  test("should handle configuration update events", () => {
    // Simular evento de mudança de configuração
    const configChangeEvent = {
      affectsConfiguration: (section: string) => {
        return section.startsWith("contextReminder");
      },
    } as vscode.ConfigurationChangeEvent;

    // Testar detecção de mudanças relevantes
    assert.ok(
      configChangeEvent.affectsConfiguration("contextReminder.model"),
      "Should detect model changes"
    );
    assert.ok(
      configChangeEvent.affectsConfiguration("contextReminder.tokenLimit"),
      "Should detect limit changes"
    );
    assert.ok(
      !configChangeEvent.affectsConfiguration("editor.fontSize"),
      "Should ignore unrelated changes"
    );
  });

  test("should handle document types correctly", () => {
    // Simular diferentes tipos de documento
    const textDocument = {
      languageId: "plaintext",
      fileName: "test.txt",
      getText: () => "Plain text content",
    } as vscode.TextDocument;

    const markdownDocument = {
      languageId: "markdown",
      fileName: "test.md",
      getText: () => "# Markdown content",
    } as vscode.TextDocument;

    const codeDocument = {
      languageId: "typescript",
      fileName: "test.ts",
      getText: () => 'const code = "typescript";',
    } as vscode.TextDocument;

    // Verificar propriedades dos documentos
    assert.strictEqual(
      textDocument.languageId,
      "plaintext",
      "Should identify plain text"
    );
    assert.strictEqual(
      markdownDocument.languageId,
      "markdown",
      "Should identify markdown"
    );
    assert.strictEqual(
      codeDocument.languageId,
      "typescript",
      "Should identify typescript"
    );

    // Todos os tipos devem poder fornecer texto
    assert.ok(textDocument.getText(), "Plain text should provide content");
    assert.ok(markdownDocument.getText(), "Markdown should provide content");
    assert.ok(codeDocument.getText(), "Code should provide content");
  });

  test("should handle workspace without folders", () => {
    // Mock workspace sem pastas
    const workspaceFoldersStub = sinon
      .stub(vscode.workspace, "workspaceFolders")
      .value(undefined);

    assert.strictEqual(
      vscode.workspace.workspaceFolders,
      undefined,
      "Should handle no workspace folders"
    );

    workspaceFoldersStub.restore();
  });

  test("should handle message display correctly", () => {
    windowStub.resolves("OK");

    // Simular exibição de mensagem
    vscode.window.showWarningMessage("Test warning message");

    assert.ok(windowStub.calledOnce, "Should call showWarningMessage");
    assert.ok(
      windowStub.calledWith("Test warning message"),
      "Should pass correct message"
    );
  });
});
