# Guia de Contribuição - Context Reminder

Obrigado pelo interesse em contribuir com o Context Reminder! Este documento contém todas as informações necessárias para desenvolvedores.

## 🛠️ Setup de Desenvolvimento

### Pré-requisitos
- **Node.js** (versão 16 ou superior)
- **VS Code** (para desenvolvimento e testes)
- **Git** (para controle de versão)

### Clonando o projeto
```bash
git clone https://github.com/robsonalvesdevbr/context-reminder.git
cd context-reminder
```

### Instalação das dependências
```bash
npm install
```

### Compilação e desenvolvimento
```bash
# Compilação única
npm run compile

# Modo watch (recomendado para desenvolvimento)
npm run watch

# Preparar para publicação
npm run vscode:prepublish
```

### Testando a extensão

#### Método 1: Debug no VS Code
1. Abra o projeto no VS Code
2. Pressione `F5` para abrir uma nova janela com a extensão carregada
3. Teste as funcionalidades na nova janela

#### Método 2: Instalação local via .vsix
```bash
# Gerar pacote
vsce package

# Instalar localmente
code --install-extension context-reminder-X.X.X.vsix
```

## 📁 Estrutura do Projeto

```
context-reminder/
├── src/
│   └── extension.ts          # Código principal da extensão
├── images/
│   ├── icon.png             # Ícone da extensão (128x128)
│   └── icon.svg             # Fonte do ícone
├── out/                     # Arquivos compilados (gerado)
├── node_modules/            # Dependências (gerado)
├── package.json             # Manifesto da extensão
├── tsconfig.json           # Configuração TypeScript
├── .gitignore              # Arquivos ignorados pelo Git
├── .vscodeignore           # Arquivos ignorados no pacote
├── CLAUDE.md               # Instruções para Claude Code
├── CONTRIBUTING.md         # Este arquivo
└── README.md               # Documentação principal
```

## 🧩 Arquitetura da Extensão

### Componentes principais

**Extension Entry Point (`src/extension.ts`)**:
- `activate()`: Inicializa a extensão e configura listeners
- `checkDocumentTokens()`: Função principal de contagem e alertas
- `deactivate()`: Limpeza ao desativar a extensão

**Sistema de Configuração**:
- `contextReminder.model`: Tipo de modelo ("claude" | "gpt")
- `contextReminder.tokenLimit`: Limite de tokens (número)
- Atualização em tempo real via `onDidChangeConfiguration`

**Monitoramento de Tokens**:
- Usa biblioteca `gpt-tokenizer` como base
- Aplica fator de correção para Claude (75% do valor GPT)
- Monitoramento contínuo via `onDidChangeTextDocument`

### Fluxo de funcionamento

1. **Ativação**: Extension ativa quando VS Code inicia
2. **Configuração**: Lê settings do usuário
3. **Monitoramento**: Escuta mudanças no documento ativo
4. **Contagem**: Calcula tokens baseado no modelo selecionado
5. **Alerta**: Mostra warning se exceder limite configurado

## 🎯 Guidelines de Código

### TypeScript
- Use **strict mode** (já configurado)
- Sempre tipagem explícita em parâmetros de função
- Evite `any`, use tipos específicos

### Formatação
- **Indentação**: 2 espaços
- **Aspas**: Duplas para strings
- **Ponto e vírgula**: Obrigatório

### Padrões específicos
```typescript
// ✅ Bom
function checkDocumentTokens(
  document: vscode.TextDocument,
  model: string,
  tokenLimit: number
): void {
  // código aqui
}

// ❌ Evitar
function checkDocumentTokens(document, model, tokenLimit) {
  // código aqui
}
```

### Tratamento de erros
- Sempre use try-catch para operações que podem falhar
- Tenha fallbacks para situações de erro
- Log erros no console para debug

```typescript
try {
  const tokenCount = encode(text).length;
} catch (error) {
  console.error("Erro ao contar tokens:", error);
  // Fallback: estimativa baseada em caracteres
  tokenCount = Math.ceil(text.length / 4);
}
```

## 🧪 Testes

### Teste manual
1. Instale a extensão em desenvolvimento
2. Abra um arquivo de texto
3. Configure diferentes modelos e limites
4. Digite até ultrapassar o limite
5. Verifique se o alerta aparece corretamente

### Cenários de teste importantes
- **Mudança de configuração**: Teste alteração de modelo e limite
- **Documentos grandes**: Teste performance com arquivos > 10k caracteres
- **Diferentes tipos de arquivo**: .txt, .md, .js, .py, etc.
- **Múltiplas janelas**: Teste com várias abas abertas

## 📦 Build e Release

### Gerando build local
```bash
npm run compile
```

### Criando pacote para distribuição
```bash
# Instalar vsce globalmente (se não tiver)
npm install -g vsce

# Gerar pacote
vsce package
```

### Publicando no marketplace
```bash
# Login (apenas maintainers)
vsce login robsonalvesdevbr

# Publicar nova versão
vsce publish patch  # ou minor/major
```

## 🐛 Reportando Bugs

### Antes de reportar
1. Verifique se já não existe issue similar
2. Teste na versão mais recente
3. Reproduza o problema consistentemente

### Informações necessárias
- **Versão da extensão**
- **Versão do VS Code**
- **Sistema operacional**
- **Passos para reproduzir**
- **Comportamento esperado vs atual**
- **Screenshots/logs se relevante**

## 💡 Sugerindo Features

### Processo
1. Abra uma **Issue** descrevendo a feature
2. Explique o **problema** que resolve
3. Sugira uma **implementação** se possível
4. Aguarde discussão antes de implementar

### Features em consideração
- [ ] Suporte para outros modelos de IA
- [ ] Configuração por workspace
- [ ] Status bar com contador de tokens
- [ ] Múltiplos limites configuráveis

## 🤝 Processo de Pull Request

### Antes de enviar
1. **Fork** o repositório
2. **Clone** seu fork localmente
3. Crie uma **branch** descritiva
4. **Teste** suas alterações localmente
5. **Commit** com mensagem clara

### Enviando PR
1. **Push** para seu fork
2. Abra **Pull Request** para branch `main`
3. **Descreva** claramente as mudanças
4. **Referencie** issues relacionadas

### Checklist do PR
- [ ] Código compila sem erros
- [ ] Funcionalidade testada manualmente
- [ ] Comentários claros em código complexo
- [ ] Não quebra funcionalidades existentes

## 📞 Contato

**Maintainer**: Robson Candido dos Santos Alves
- **GitHub**: [@robsonalvesdevbr](https://github.com/robsonalvesdevbr)
- **Email**: robson.curitibapr@gmail.com

Para dúvidas específicas de desenvolvimento, prefira abrir uma **Issue** no repositório para que outros possam se beneficiar da discussão.

---

✨ **Obrigado por contribuir com o Context Reminder!**