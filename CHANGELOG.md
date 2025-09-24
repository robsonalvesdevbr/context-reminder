# Change Log

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.9] - 2025-09-24

### Corrigido
- 🐛 Erro no pipeline GitHub Actions - configurado xvfb para testes em ambiente headless
- 🔧 Suporte para execução de testes VS Code no CI sem interface gráfica

## [0.0.8] - 2025-09-24

### Adicionado
- 🚀 GitHub Actions workflow para deploy automático
- 📦 Pipeline CI/CD completo com testes e publicação automática

### Melhorado
- ⬆️ Dependências atualizadas para versões mais recentes
- 🧪 Execução de testes no pipeline de deploy
- 🔧 Configuração otimizada do workflow com cache npm

## [0.0.7] - 2025-09-23

### Melhorado
- 📝 Documentação CONTRIBUTING.md reorganizada e simplificada (reduzida de 676 para 349 linhas)
- 🗂️ Adicionado índice de navegação no guia de contribuição
- 📖 Estrutura mais clara e concisa para desenvolvedores
- ✨ Atualizada seção de "Últimas atualizações" no README.md

### Alterado
- 🔄 Removida referência específica de versão do README.md para manter informações sempre atuais

## [0.0.6] - 2025-09-24

### Adicionado
- Icon with transparent background

## [0.0.5] - 2025-09-23

### Adicionado
- ✨ Documentação completa de changelog no CONTRIBUTING.md
- 📝 Arquivo LICENSE (MIT) adicionado ao projeto

### Corrigido
- 🐛 Corrigido comportamento do script de changelog

### Alterado
- 📝 Seção de licença expandida no README.md com detalhes da MIT License

## [0.0.4] - 2025-09-23

### Adicionado
- ✨ Novos comandos:
  - `context-reminder.checkTokens` - Verificar contagem de tokens manual
  - `context-reminder.toggleModel` - Alternar entre Claude e GPT
  - `context-reminder.setTokenLimit` - Definir limite personalizado de tokens
- 🎯 Ícone da extensão (`images/icon.png`)
- 🧪 Suite abrangente de testes (64 testes passando)
- 📦 Configuração completa para publicação no marketplace

### Melhorado
- 🚀 Performance da contagem de tokens otimizada
- 🛡️ Tratamento robusto de erros do tokenizer
- 📱 Validação de entrada null/undefined
- ⚡ Fallback inteligente para contagem por caracteres
- 🔄 Sincronização em tempo real de configurações

### Corrigido
- 🐛 Problema de registro de comandos
- 🔧 Stubbing issues nos testes
- ⏱️ Timeouts em testes de performance
- 🎛️ Sincronização de variáveis locais com configuração

### Técnico
- 📊 Cobertura de testes: 100% funcionalidade core
- 🏗️ Arquitetura de testes melhorada
- 🧹 Código refatorado para melhor manutenibilidade

## [0.0.3] - 2025-09-20

### Adicionado
- 📝 Documentação inicial
- ⚙️ Configurações básicas

### Corrigido
- 🐛 Bugs iniciais de desenvolvimento

## [0.0.2] - 2025-09-18

### Adicionado
- 🎯 Contagem de tokens para modelos Claude e GPT
- ⚠️ Alertas quando limite de tokens é excedido
- ⚙️ Configurações personalizáveis

## [0.0.1] - 2025-09-15

### Adicionado
- 🚀 Versão inicial da extensão
- 📊 Contagem básica de tokens
- 🔄 Monitoramento em tempo real de documentos