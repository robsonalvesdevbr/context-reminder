# Change Log

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-09-25

### Adicionado
- ✨ **Sistema de bundling com esbuild** - Implementação completa para resolver dependências
- 🔧 **Logs de debug detalhados** - Rastreamento completo da ativação da extensão
- 🎯 **activationEvents para comandos** - Ativação automática quando comandos são executados

### Corrigido
- 🐛 **Erro crítico "Cannot find module 'gpt-tokenizer'"** - Dependência agora bundled corretamente
- 🔧 **Comandos não funcionavam via Command Palette** - Problema de ativação da extensão resolvido
- 📦 **Dependências externas não incluídas no package** - Sistema de bundling resolve completamente

### Melhorado
- 🚀 **Sistema de build completamente reformulado** - Migração do TypeScript puro para esbuild
- 📊 **Package agora inclui todas dependências** - Size: 898KB → 3.19MB (funcional)
- ⚡ **Performance da extensão otimizada** - Bundle minificado para produção
- 🎛️ **Scripts de desenvolvimento atualizados** - esbuild-watch para desenvolvimento em tempo real

### Alterado
- 🔄 **Scripts do package.json** - `vscode:prepublish` agora usa esbuild com minificação
- 🛠️ **Processo de desenvolvimento** - `npm run esbuild-watch` para desenvolvimento
- 📦 **Estrutura de build** - Bundle único em vez de múltiplos arquivos compilados

### Técnico
- 🏗️ **esbuild configuration** - Bundle, minificação, CommonJS, Node platform
- 🧪 **Todos comandos agora funcionais** - checkTokens, toggleModel, setTokenLimit
- 🔍 **Try-catch melhorado** - Captura erros durante ativação da extensão
- 📈 **Bundle analysis** - gpt-tokenizer confirmadamente incluído (18 ocorrências)

## [0.0.11] - 2025-09-24

### Melhorado
- 📄 README.md reformatado com design profissional e layout moderno
- 🎨 Cabeçalho centralizado com ícone e badges estilizados
- 🌐 Tradução completa para inglês para alcance internacional
- 📊 Tabelas estruturadas para features e configurações
- 🔗 Links e badges do Marketplace e GitHub aprimorados
- 📱 Layout responsivo com elementos visuais melhorados

### Atualizado
- ⬆️ **Dependências atualizadas para versões mais recentes**:
  - `typescript`: 5.6.0 → 5.9.2 (versão mais recente estável)
  - `@vscode/test-electron`: 2.4.5 → 2.5.2 (melhorias na execução de testes)
  - `@types/sinon`: 17.0.3 → 17.0.4 (tipos atualizados)
  - `@types/node`: 20.x → 22.15.1 (compatibilidade com Node.js v22 do VS Code 2025)
  - `@types/chai`: 4.3.20 → 5.2.2 (major update com novas funcionalidades)
  - `chai`: 5.3.3 → 6.0.1 (major update com melhorias de performance)
  - `mocha`: 10.8.2 → 11.7.2 (major update com novos recursos)
  - `sinon`: 19.0.5 → 21.0.0 (major update com correções e melhorias)

### Testado
- 🧪 Suite completa de 64 testes executada com sucesso após atualizações
- ✅ Compatibilidade verificada com todas as novas versões de dependências
- 🔧 Funcionalidade core mantida íntegra após major updates

## [0.0.10] - 2025-09-24

### Melhorado
- 🚀 Workflow GitHub Actions otimizado com extração automática de changelog
- 📝 Release notes estruturadas combinando changelog manual e notas automáticas
- 🧪 Testes configurados para ambiente headless com xvfb-run
- 🔧 Padronização de configuração do workflow

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