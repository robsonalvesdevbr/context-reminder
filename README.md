# Context Reminder

Uma extensão para VS Code que avisa quando seu prompt está ficando muito longo para modelos de IA como Claude ou GPT.

## Funcionalidades

- ⚠️ Aviso automático quando o número de tokens excede o limite configurado
- 🔧 Suporte para modelos Claude e GPT com contagem específica de tokens
- ⚙️ Configurável através das configurações do VS Code
- 🔄 Monitoramento em tempo real de alterações no documento

## Configurações

- `contextReminder.model`: Modelo para contagem de tokens ("claude" ou "gpt") - padrão: "claude"
- `contextReminder.tokenLimit`: Limite de tokens antes do aviso - padrão: 2000

## Compilação e Desenvolvimento

### Pré-requisitos
- Node.js (versão 14 ou superior)
- VS Code

### Instalação das dependências
```bash
npm install
```

### Compilação
```bash
# Compilar uma vez
npm run compile

# Compilar em modo watch (recomendado para desenvolvimento)
npm run watch
```

### Preparar para publicação
```bash
npm run vscode:prepublish
```

## Instalação da Extensão

### Opção 1: Instalar localmente a partir do código fonte

1. Clone o repositório:
```bash
git clone https://github.com/robsonalvesdevbr/context-reminder.git
cd context-reminder
```

2. Instale as dependências:
```bash
npm install
```

3. Compile a extensão:
```bash
npm run compile
```

4. Abra o VS Code na pasta do projeto:
```bash
code .
```

5. Pressione `F5` para abrir uma nova janela do VS Code com a extensão carregada

### Opção 2: Instalar através do arquivo .vsix

1. Gere o arquivo .vsix:
```bash
# Instalar vsce globalmente (se não tiver)
npm install -g vsce

# Gerar o pacote
vsce package
```

2. Instale a extensão:
```bash
code --install-extension context-reminder-0.0.1.vsix
```

### Opção 3: Instalação manual pelo VS Code

1. Abra o VS Code
2. Vá em `Extensions` (Ctrl+Shift+X)
3. Clique nos três pontos (...) no topo da barra lateral
4. Selecione "Install from VSIX..."
5. Escolha o arquivo `context-reminder-0.0.1.vsix`

## Como usar

1. A extensão é ativada automaticamente quando o VS Code inicia
2. Configure o modelo e limite de tokens nas configurações do VS Code:
   - Abra as configurações (`Ctrl+,`)
   - Procure por "Context Reminder"
   - Ajuste as configurações conforme necessário
3. A extensão monitorará automaticamente o documento ativo e mostrará avisos quando o limite for excedido

## Estrutura do Projeto

```
context-reminder/
├── src/
│   └── extension.ts          # Código principal da extensão
├── out/                      # Arquivos compilados
├── package.json             # Manifesto da extensão
├── tsconfig.json           # Configuração TypeScript
└── README.md               # Este arquivo
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request