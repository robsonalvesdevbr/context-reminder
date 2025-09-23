import * as vscode from "vscode";
import { encode } from "gpt-tokenizer";

export function activate(context: vscode.ExtensionContext) {
  // Lê configuração inicial
  let config = vscode.workspace.getConfiguration("contextReminder");
  let model = config.get<string>("model", "claude");
  let tokenLimit = config.get<number>("tokenLimit", 2000);

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

function checkDocumentTokens(
  document: vscode.TextDocument,
  model: string,
  tokenLimit: number
) {
  const text = document.getText();
  let tokenCount = 0;

  try {
    // Usa configuração específica do modelo para contagem de tokens
    if (model === "claude") {
      // Para Claude, usa o tokenizer padrão (similar ao GPT)
      tokenCount = encode(text).length;
    } else {
      // Para GPT, usa o tokenizer padrão
      tokenCount = encode(text).length;
    }
  } catch (error) {
    console.error("Erro ao contar tokens:", error);
  }

  if (tokenCount > tokenLimit) {
    vscode.window.showWarningMessage(
      `⚠️ Seu prompt possui ${tokenCount} tokens (limite: ${tokenLimit}). Considere iniciar um novo chat!`
    );
  }
}

export function deactivate() {}
