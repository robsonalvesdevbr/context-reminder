# Change Log

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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