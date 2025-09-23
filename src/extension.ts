import * as vscode from "vscode";
import { encode } from "gpt-tokenizer";

export function activate(context: vscode.ExtensionContext) {
  // Lê configuração inicial
  let config = vscode.workspace.getConfiguration("contextReminder");
  let model = config.get<string>("model", "claude");
  let tokenLimit = config.get<number>("tokenLimit", 2000);

  // Registra os comandos
  const checkTokensCommand = vscode.commands.registerCommand(
    "context-reminder.checkTokens",
    () => {
      if (vscode.window.activeTextEditor) {
        checkDocumentTokens(
          vscode.window.activeTextEditor.document,
          model,
          tokenLimit
        );
      } else {
        vscode.window.showInformationMessage("No active editor found.");
      }
    }
  );
  context.subscriptions.push(checkTokensCommand);

  const toggleModelCommand = vscode.commands.registerCommand(
    "context-reminder.toggleModel",
    async () => {
      const newModel = model === "claude" ? "gpt" : "claude";
      await vscode.workspace.getConfiguration("contextReminder").update("model", newModel, vscode.ConfigurationTarget.Global);
      model = newModel; // Atualizar variável local
      vscode.window.showInformationMessage(`Model switched to: ${newModel}`);
    }
  );
  context.subscriptions.push(toggleModelCommand);

  const setTokenLimitCommand = vscode.commands.registerCommand(
    "context-reminder.setTokenLimit",
    async () => {
      const input = await vscode.window.showInputBox({
        prompt: "Enter new token limit",
        value: tokenLimit.toString(),
        validateInput: (value) => {
          const num = parseInt(value);
          if (isNaN(num) || num <= 0) {
            return "Please enter a valid positive number";
          }
          return null;
        }
      });

      if (input) {
        const newLimit = parseInt(input);
        await vscode.workspace.getConfiguration("contextReminder").update("tokenLimit", newLimit, vscode.ConfigurationTarget.Global);
        tokenLimit = newLimit; // Atualizar variável local
        vscode.window.showInformationMessage(`Token limit set to: ${newLimit}`);
      }
    }
  );
  context.subscriptions.push(setTokenLimitCommand);

  // Atualiza configuração se alterada nas Settings
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (
      e.affectsConfiguration("contextReminder.model") ||
      e.affectsConfiguration("contextReminder.tokenLimit")
    ) {
      config = vscode.workspace.getConfiguration("contextReminder");
      model = config.get<string>("model", "claude");
      tokenLimit = config.get<number>("tokenLimit", 2000);
    }
  });

  // Monitora alterações de documento
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document === vscode.window.activeTextEditor?.document) {
      checkDocumentTokens(event.document, model, tokenLimit);
    }
  });

  // Checa ao abrir a extensão
  if (vscode.window.activeTextEditor) {
    checkDocumentTokens(
      vscode.window.activeTextEditor.document,
      model,
      tokenLimit
    );
  }
}

export function checkDocumentTokens(
  document: vscode.TextDocument,
  model: string,
  tokenLimit: number
) {
  const text = document.getText();
  let tokenCount = 0;

  // Handle null, undefined, or empty text
  if (!text || typeof text !== 'string') {
    return;
  }

  try {
    // Contagem de tokens baseada no modelo selecionado
    const gptTokenCount = encode(text).length;

    if (model === "claude") {
      // Claude geralmente usa ~25% menos tokens que GPT para o mesmo texto
      // Esta é uma aproximação baseada no tokenizer GPT
      tokenCount = Math.floor(gptTokenCount * 0.75);
    } else {
      // GPT usa contagem direta do tokenizer
      tokenCount = gptTokenCount;
    }
  } catch (error) {
    console.error("Erro ao contar tokens:", error);
    // Fallback: estima baseado em caracteres (1 token ≈ 4 caracteres)
    tokenCount = Math.ceil(text.length / 4);
  }

  if (tokenCount > tokenLimit) {
    vscode.window.showWarningMessage(
      `⚠️ Seu prompt possui ${tokenCount} tokens (limite: ${tokenLimit}). Considere iniciar um novo chat!`
    );
  }
}

export function deactivate() {}
