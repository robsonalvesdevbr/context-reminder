import * as assert from "assert";
import * as vscode from "vscode";
import * as sinon from "sinon";

suite("Configuration Tests", () => {
  let getConfigurationStub: sinon.SinonStub;
  let configMock: any;

  setup(() => {
    // Mock da configuração
    configMock = {
      get: sinon.stub(),
      has: sinon.stub(),
      inspect: sinon.stub(),
      update: sinon.stub(),
    };

    // Stub do workspace.getConfiguration
    getConfigurationStub = sinon
      .stub(vscode.workspace, "getConfiguration")
      .returns(configMock);
  });

  teardown(() => {
    getConfigurationStub.restore();
    sinon.restore();
  });

  test("should read default model configuration", () => {
    // Configurar mock para retornar valor padrão
    configMock.get.withArgs("model", "claude").returns("claude");

    const config = vscode.workspace.getConfiguration("contextReminder");
    const model = config.get("model", "claude");

    assert.strictEqual(model, "claude", "Default model should be claude");
    assert.ok(
      getConfigurationStub.calledWith("contextReminder"),
      "Should request contextReminder config"
    );
  });

  test("should read default token limit configuration", () => {
    // Configurar mock para retornar valor padrão
    configMock.get.withArgs("tokenLimit", 2000).returns(2000);

    const config = vscode.workspace.getConfiguration("contextReminder");
    const tokenLimit = config.get("tokenLimit", 2000);

    assert.strictEqual(tokenLimit, 2000, "Default token limit should be 2000");
    assert.ok(
      getConfigurationStub.calledWith("contextReminder"),
      "Should request contextReminder config"
    );
  });

  test("should read custom model configuration", () => {
    // Configurar mock para retornar valor customizado
    configMock.get.withArgs("model", "claude").returns("gpt");

    const config = vscode.workspace.getConfiguration("contextReminder");
    const model = config.get("model", "claude");

    assert.strictEqual(model, "gpt", "Should return custom model value");
  });

  test("should read custom token limit configuration", () => {
    // Configurar mock para retornar valor customizado
    configMock.get.withArgs("tokenLimit", 2000).returns(5000);

    const config = vscode.workspace.getConfiguration("contextReminder");
    const tokenLimit = config.get("tokenLimit", 2000);

    assert.strictEqual(
      tokenLimit,
      5000,
      "Should return custom token limit value"
    );
  });

  test("should handle invalid model configuration", () => {
    // Configurar mock para retornar valor inválido
    configMock.get.withArgs("model", "claude").returns("invalid-model");

    const config = vscode.workspace.getConfiguration("contextReminder");
    const model = config.get("model", "claude");

    // A extensão deveria tratar isso, mas por agora apenas verificamos que recebe o valor
    assert.strictEqual(model, "invalid-model", "Should receive invalid value");
    // TODO: Implementar validação na extensão para valores inválidos
  });

  test("should handle invalid token limit configuration", () => {
    // Configurar mock para retornar valor negativo
    configMock.get.withArgs("tokenLimit", 2000).returns(-100);

    const config = vscode.workspace.getConfiguration("contextReminder");
    const tokenLimit = config.get("tokenLimit", 2000);

    assert.strictEqual(tokenLimit, -100, "Should receive negative value");
    // TODO: Implementar validação na extensão para valores inválidos
  });

  test("should handle configuration section request", () => {
    const config = vscode.workspace.getConfiguration("contextReminder");

    assert.ok(
      getConfigurationStub.calledOnce,
      "Should call getConfiguration once"
    );
    assert.ok(
      getConfigurationStub.calledWith("contextReminder"),
      "Should request correct section"
    );
  });

  test("should handle empty configuration section", () => {
    const config = vscode.workspace.getConfiguration();

    assert.ok(
      getConfigurationStub.calledOnce,
      "Should call getConfiguration once"
    );
    assert.ok(getConfigurationStub.calledWith(), "Should handle empty section");
  });
});
