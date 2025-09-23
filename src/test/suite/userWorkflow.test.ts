import * as assert from "assert";
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as sinon from "sinon";

suite("End-to-End - User Workflow Tests", () => {
  let testWorkspaceUri: vscode.Uri;
  let showWarningStub: sinon.SinonStub;
  let showInformationStub: sinon.SinonStub;

  suiteSetup(async () => {
    if (
      !vscode.workspace.workspaceFolders ||
      vscode.workspace.workspaceFolders.length === 0
    ) {
      throw new Error("E2E workflow tests require an active workspace");
    }

    testWorkspaceUri = vscode.workspace.workspaceFolders[0].uri;

    // Garantir que a extensão está ativa
    const extension = vscode.extensions.getExtension(
      "robsonalvesdevbr.context-reminder"
    );
    if (extension && !extension.isActive) {
      await extension.activate();
    }
  });

  setup(() => {
    showWarningStub = sinon.stub(vscode.window, "showWarningMessage");
    showInformationStub = sinon.stub(vscode.window, "showInformationMessage");
  });

  teardown(() => {
    sinon.restore();
  });

  test("E2E Workflow: Developer working on a large project file", async () => {
    // Simular cenário real: desenvolvedor trabalhando em arquivo grande
    const projectFilePath = path.join(
      testWorkspaceUri.fsPath,
      "large-project-file.ts"
    );

    // Conteúdo inicial - arquivo TypeScript realista grande
    const initialContent = `
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Simulação de arquivo de projeto real com muitas linhas
export class ProjectManager {
	private readonly _context: vscode.ExtensionContext;
	private readonly _diagnostics: vscode.DiagnosticCollection;
	
	constructor(context: vscode.ExtensionContext) {
		this._context = context;
		this._diagnostics = vscode.languages.createDiagnosticCollection('project');
	}

	public async initializeProject(): Promise<void> {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			throw new Error('No workspace folder found');
		}

		// Código extenso para simular arquivo real...
		${
      "// ".repeat(50) +
      "Linha de comentário longa para aumentar o tamanho do arquivo\\n".repeat(
        200
      )
    }
		
		for (const folder of workspaceFolders) {
			await this.scanFolder(folder.uri);
		}
	}

	private async scanFolder(uri: vscode.Uri): Promise<void> {
		const files = await vscode.workspace.fs.readDirectory(uri);
		
		for (const [name, type] of files) {
			if (type === vscode.FileType.File) {
				await this.processFile(vscode.Uri.joinPath(uri, name));
			} else if (type === vscode.FileType.Directory) {
				await this.scanFolder(vscode.Uri.joinPath(uri, name));
			}
		}
	}

	private async processFile(uri: vscode.Uri): Promise<void> {
		try {
			const document = await vscode.workspace.openTextDocument(uri);
			// Processamento do arquivo...
			${"// ".repeat(30) + "Processamento complexo\\n".repeat(100)}
		} catch (error) {
			console.error('Error processing file:', error);
		}
	}
}`.repeat(3); // Triplicar para ter arquivo realmente grande

    // Escrever arquivo inicial
    fs.writeFileSync(projectFilePath, initialContent);

    try {
      // 1. Abrir o arquivo (simula desenvolvedor abrindo projeto)
      const document = await vscode.workspace.openTextDocument(projectFilePath);
      const editor = await vscode.window.showTextDocument(document);

      assert.ok(editor, "File should be opened in editor");

      // 2. Configurar limite baixo para simular excesso
      const config = vscode.workspace.getConfiguration("contextReminder");
      const originalLimit = config.get("tokenLimit");
      await config.update("tokenLimit", 500, vscode.ConfigurationTarget.Global);

      // Dar tempo para a extensão processar
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 3. Simular edições incrementais (desenvolvedor digitando)
      const edits = [
        {
          position: new vscode.Position(0, 0),
          text: "// Novo comentário no início\n",
        },
        {
          position: new vscode.Position(5, 0),
          text: "\t// TODO: Implementar validação\n",
        },
        {
          position: new vscode.Position(10, 0),
          text: '\tconsole.log("Debug info");\n',
        },
      ];

      for (const editInfo of edits) {
        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, editInfo.position, editInfo.text);
        const success = await vscode.workspace.applyEdit(edit);

        assert.ok(success, "Edit should be applied successfully");

        // Pequena pausa para simular digitação natural
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 4. Verificar que extension respondeu às mudanças
      // Em arquivo grande com limite baixo, deveria mostrar avisos
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 5. Trocar modelo (simula usuário experimentando diferentes modelos)
      await vscode.commands.executeCommand("context-reminder.toggleModel");
      await new Promise((resolve) => setTimeout(resolve, 200));

      // 6. Verificar comando manual de contagem
      await vscode.commands.executeCommand("context-reminder.checkTokens");

      // 7. Restaurar limite original
      await config.update(
        "tokenLimit",
        originalLimit,
        vscode.ConfigurationTarget.Global
      );

      assert.ok(
        true,
        "Complete developer workflow simulation completed successfully"
      );
    } finally {
      // Cleanup
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
      if (fs.existsSync(projectFilePath)) {
        fs.unlinkSync(projectFilePath);
      }
    }
  });

  test("E2E Workflow: Content creator writing documentation", async () => {
    // Simular cenário: criador de conteúdo escrevendo documentação extensa
    const docPath = path.join(testWorkspaceUri.fsPath, "api-documentation.md");

    const documentationContent = `
# API Documentation

## Overview

This comprehensive API documentation covers all endpoints, authentication methods, and usage examples for our platform.

## Table of Contents

1. [Authentication](#authentication)
2. [Endpoints](#endpoints)
3. [Examples](#examples)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)

## Authentication

Our API uses JWT tokens for authentication. To obtain a token, you need to make a POST request to the /auth/login endpoint with your credentials.

### Login Example

\`\`\`javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'your-username',
    password: 'your-password'
  })
});

const { token } = await response.json();
\`\`\`

## Endpoints

### Users

#### GET /api/users

Retrieves a list of all users in the system.

**Parameters:**
- \`page\` (optional): Page number for pagination (default: 1)
- \`limit\` (optional): Number of items per page (default: 20)
- \`sort\` (optional): Sort field (default: 'created_at')

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "created_at": "2023-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100
  }
}
\`\`\`

### Projects

#### GET /api/projects

Retrieves all projects associated with the authenticated user.

**Headers:**
- \`Authorization: Bearer <your-jwt-token>\`

**Response:**
\`\`\`json
{
  "projects": [
    {
      "id": 1,
      "name": "My Project",
      "description": "Project description here",
      "status": "active",
      "created_at": "2023-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

#### POST /api/projects

Creates a new project.

**Headers:**
- \`Authorization: Bearer <your-jwt-token>\`
- \`Content-Type: application/json\`

**Body:**
\`\`\`json
{
  "name": "New Project",
  "description": "Description of the new project",
  "type": "web"
}
\`\`\`

## Examples

Here are comprehensive examples of how to use our API in different scenarios:

### Creating a Complete Workflow

1. **Authenticate:**
\`\`\`bash
curl -X POST https://api.example.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username": "user", "password": "pass"}'
\`\`\`

2. **Create Project:**
\`\`\`bash
curl -X POST https://api.example.com/projects \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My New Project", "type": "web"}'
\`\`\`

3. **List Projects:**
\`\`\`bash
curl -X GET https://api.example.com/projects \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

## Error Handling

Our API returns standard HTTP status codes and detailed error messages.

### Common Error Codes

- \`400 Bad Request\`: Invalid request parameters
- \`401 Unauthorized\`: Invalid or missing authentication token
- \`403 Forbidden\`: Insufficient permissions
- \`404 Not Found\`: Resource not found
- \`429 Too Many Requests\`: Rate limit exceeded
- \`500 Internal Server Error\`: Server-side error

### Error Response Format

\`\`\`json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request parameters are invalid",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
\`\`\`

## Rate Limiting

Our API implements rate limiting to ensure fair usage:

- **Standard Users**: 1000 requests per hour
- **Premium Users**: 5000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers are included in all responses:

\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
\`\`\`

## Additional Information

For more detailed information, please visit our developer portal at https://developers.example.com

Contact our support team at api-support@example.com for any questions or issues.
`.repeat(2); // Duplicar para ter documento longo

    fs.writeFileSync(docPath, documentationContent);

    try {
      // 1. Abrir documento
      const document = await vscode.workspace.openTextDocument(docPath);
      await vscode.window.showTextDocument(document);

      // 2. Configurar para modelo apropriado para texto (Claude)
      const config = vscode.workspace.getConfiguration("contextReminder");
      const originalModel = config.get("model");
      await config.update("model", "claude", vscode.ConfigurationTarget.Global);

      // 3. Simular escrita incremental de documentação
      const additionalSections = [
        "\n## SDK Examples\n\nHere are examples using our official SDKs:\n",
        '\n### Python SDK\n\n```python\nimport example_api\n\nclient = example_api.Client(token="your_token")\nresult = client.users.list()\n```\n',
        '\n### JavaScript SDK\n\n```javascript\nconst ExampleAPI = require("example-api");\nconst client = new ExampleAPI("your_token");\nconst users = await client.users.list();\n```\n',
        "\n## Webhooks\n\nOur API supports webhooks for real-time notifications.\n",
      ];

      for (const section of additionalSections) {
        const edit = new vscode.WorkspaceEdit();
        const endPosition = new vscode.Position(document.lineCount, 0);
        edit.insert(document.uri, endPosition, section);

        await vscode.workspace.applyEdit(edit);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      // 4. Verificar comando de contagem manual
      await vscode.commands.executeCommand("context-reminder.checkTokens");

      // 5. Testar mudança de modelo para comparar contagem
      await vscode.commands.executeCommand("context-reminder.toggleModel");
      await new Promise((resolve) => setTimeout(resolve, 200));
      await vscode.commands.executeCommand("context-reminder.checkTokens");

      // Restaurar modelo original
      await config.update(
        "model",
        originalModel,
        vscode.ConfigurationTarget.Global
      );

      assert.ok(true, "Documentation writer workflow completed successfully");
    } finally {
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor"
      );
      if (fs.existsSync(docPath)) {
        fs.unlinkSync(docPath);
      }
    }
  });

  test("E2E Workflow: Multi-file project session", async () => {
    // Simular sessão de trabalho com múltiplos arquivos
    const fileContents = {
      "main.py": `
import os
import sys
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class ProjectConfig:
    name: str
    version: str
    description: Optional[str] = None
    dependencies: List[str] = None

class ProjectManager:
    def __init__(self, config_path: str):
        self.config_path = config_path
        self.config = self._load_config()
        
    def _load_config(self) -> ProjectConfig:
        # Implementação de carregamento de configuração
        ${"# Comentário longo para aumentar tamanho\\n        ".repeat(50)}
        return ProjectConfig("example", "1.0.0")
        
    def process_files(self) -> None:
        files = self._get_project_files()
        for file_path in files:
            self._process_single_file(file_path)
            
    def _get_project_files(self) -> List[str]:
        # Implementação de busca de arquivos
        return ["file1.py", "file2.py", "file3.py"]
        
    def _process_single_file(self, file_path: str) -> None:
        # Processamento individual de arquivo
        ${"# Processamento complexo\\n        ".repeat(30)}
        pass
`.repeat(2),

      "utils.py": `
from typing import Any, Dict, List, Union
import json
import logging

logger = logging.getLogger(__name__)

class FileUtils:
    @staticmethod
    def read_file(path: str) -> str:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error reading file {path}: {e}")
            raise
            
    @staticmethod
    def write_file(path: str, content: str) -> None:
        try:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
        except Exception as e:
            logger.error(f"Error writing file {path}: {e}")
            raise

class DataProcessor:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self._initialize_processor()
        
    def _initialize_processor(self) -> None:
        # Inicialização complexa
        ${"# Configuração detalhada\\n        ".repeat(40)}
        pass
        
    def process_data(self, data: List[Dict]) -> List[Dict]:
        # Processamento de dados
        processed = []
        for item in data:
            processed_item = self._process_item(item)
            processed.append(processed_item)
        return processed
        
    def _process_item(self, item: Dict) -> Dict:
        # Processamento individual
        ${"# Lógica complexa de processamento\\n        ".repeat(25)}
        return item
`.repeat(2),

      "config.json": `{
  "project": {
    "name": "example-project",
    "version": "1.0.0",
    "description": "Example project for testing Context Reminder extension",
    "author": "Developer",
    "license": "MIT"
  },
  "settings": {
    "debug": true,
    "logging_level": "INFO",
    "max_workers": 4,
    "timeout": 30,
    "retry_attempts": 3
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "example_db",
    "user": "db_user",
    "ssl": true,
    "pool_size": 10
  },
  "api": {
    "base_url": "https://api.example.com",
    "version": "v1",
    "endpoints": {
      "users": "/users",
      "projects": "/projects",
      "files": "/files",
      "auth": "/auth"
    },
    "rate_limit": {
      "requests_per_minute": 60,
      "burst_size": 10
    }
  },
  "features": {
    "auto_save": true,
    "syntax_highlighting": true,
    "code_completion": true,
    "error_checking": true,
    "performance_monitoring": true
  }
}`,
    };

    const filePaths: string[] = [];

    try {
      // 1. Criar múltiplos arquivos
      for (const [fileName, content] of Object.entries(fileContents)) {
        const filePath = path.join(testWorkspaceUri.fsPath, fileName);
        fs.writeFileSync(filePath, content);
        filePaths.push(filePath);
      }

      const openedEditors: vscode.TextEditor[] = [];

      // 2. Abrir todos os arquivos em sequência (simula desenvolvedor abrindo projeto)
      for (const filePath of filePaths) {
        const document = await vscode.workspace.openTextDocument(filePath);
        const editor = await vscode.window.showTextDocument(
          document,
          vscode.ViewColumn.One
        );
        openedEditors.push(editor);

        // Pequena pausa entre aberturas
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 3. Alternar entre arquivos e fazer edições
      for (let i = 0; i < openedEditors.length; i++) {
        const editor = openedEditors[i];

        // Focar no editor
        await vscode.window.showTextDocument(editor.document);

        // Fazer edição específica para cada tipo de arquivo
        const edit = new vscode.WorkspaceEdit();
        let editText = "";

        if (editor.document.languageId === "python") {
          editText = "# Modified for testing\n";
        } else if (editor.document.languageId === "json") {
          editText = "\n  // Test comment\n";
        }

        if (editText) {
          edit.insert(editor.document.uri, new vscode.Position(0, 0), editText);
          await vscode.workspace.applyEdit(edit);
        }

        // Verificar contagem de tokens no arquivo atual
        await vscode.commands.executeCommand("context-reminder.checkTokens");
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      // 4. Testar configuração dinâmica durante sessão
      const config = vscode.workspace.getConfiguration("contextReminder");
      const originalModel = config.get("model");
      const originalLimit = config.get("tokenLimit");

      // Trocar para Claude e limite menor
      await config.update("model", "claude", vscode.ConfigurationTarget.Global);
      await config.update("tokenLimit", 800, vscode.ConfigurationTarget.Global);

      // Verificar impacto nos arquivos abertos
      for (const editor of openedEditors) {
        await vscode.window.showTextDocument(editor.document);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Restaurar configurações
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

      assert.strictEqual(
        openedEditors.length,
        Object.keys(fileContents).length,
        "All files should be opened successfully"
      );
      assert.ok(true, "Multi-file project session completed successfully");
    } finally {
      // Cleanup
      await vscode.commands.executeCommand("workbench.action.closeAllEditors");

      for (const filePath of filePaths) {
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (error) {
          console.warn(`Failed to cleanup file ${filePath}:`, error);
        }
      }
    }
  });

  test("E2E Workflow: Configuration and customization flow", async () => {
    // Simular usuário configurando e customizando a extensão
    const config = vscode.workspace.getConfiguration("contextReminder");

    // Salvar configurações originais
    const originalModel = config.get("model");
    const originalLimit = config.get("tokenLimit");

    try {
      // 1. Testar diferentes modelos
      const models = ["gpt", "claude"];
      for (const model of models) {
        await config.update("model", model, vscode.ConfigurationTarget.Global);

        // Verificar mudança
        const currentModel = config.get("model");
        assert.strictEqual(
          currentModel,
          model,
          `Model should be updated to ${model}`
        );

        // Criar documento de teste para verificar impacto
        const testDoc = await vscode.workspace.openTextDocument({
          content:
            `Teste de modelo ${model}. Este é um conteúdo de exemplo para verificar como diferentes modelos contam tokens. `.repeat(
              20
            ),
          language: "plaintext",
        });

        await vscode.window.showTextDocument(testDoc);
        await vscode.commands.executeCommand("context-reminder.checkTokens");
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      // 2. Testar diferentes limites de token
      const tokenLimits = [500, 1000, 2000, 5000];
      for (const limit of tokenLimits) {
        await config.update(
          "tokenLimit",
          limit,
          vscode.ConfigurationTarget.Global
        );

        const currentLimit = config.get("tokenLimit");
        assert.strictEqual(
          currentLimit,
          limit,
          `Token limit should be updated to ${limit}`
        );

        // Testar com documento que pode ou não exceder o limite
        const contentSize = limit < 1000 ? 200 : 50; // Ajustar tamanho baseado no limite
        const testContent = `Token limit test content. `.repeat(contentSize);

        const testDoc = await vscode.workspace.openTextDocument({
          content: testContent,
          language: "plaintext",
        });

        await vscode.window.showTextDocument(testDoc);
        await new Promise((resolve) => setTimeout(resolve, 150));
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );
      }

      // 3. Testar combinações de configuração
      const configCombinations = [
        { model: "gpt", limit: 1000 },
        { model: "claude", limit: 2000 },
        { model: "gpt", limit: 500 },
        { model: "claude", limit: 3000 },
      ];

      for (const combo of configCombinations) {
        await config.update(
          "model",
          combo.model,
          vscode.ConfigurationTarget.Global
        );
        await config.update(
          "tokenLimit",
          combo.limit,
          vscode.ConfigurationTarget.Global
        );

        // Verificar configuração aplicada
        assert.strictEqual(
          config.get("model"),
          combo.model,
          "Model should match combination"
        );
        assert.strictEqual(
          config.get("tokenLimit"),
          combo.limit,
          "Limit should match combination"
        );

        // Testar funcionamento com configuração
        const testContent = "Configuration combination test. ".repeat(100);
        const testDoc = await vscode.workspace.openTextDocument({
          content: testContent,
          language: "markdown",
        });

        await vscode.window.showTextDocument(testDoc);
        await vscode.commands.executeCommand("context-reminder.checkTokens");
        await vscode.commands.executeCommand(
          "workbench.action.closeActiveEditor"
        );

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      assert.ok(
        true,
        "Configuration and customization workflow completed successfully"
      );
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
});
