# Context Reminder

⚠️ **Nunca mais perca o contexto da sua conversa com IA!**

Uma extensão para VS Code que monitora o tamanho do seu prompt e te avisa quando está próximo dos limites de contexto do Claude ou GPT.

## ✨ Funcionalidades

- 🚨 **Alertas inteligentes** - Aviso automático quando tokens excedem o limite
- 🤖 **Multi-modelo** - Suporte para Claude e GPT com contagem específica
- ⚙️ **Configurável** - Ajuste limites e modelos nas Settings
- 🔄 **Tempo real** - Monitoramento contínuo enquanto você digita
- 🎯 **Não intrusivo** - Funciona silenciosamente até precisar avisar

## 🚀 Instalação

### Via VS Code Marketplace
```bash
ext install robsonalvesdevbr.context-reminder
```

**Ou instale diretamente pelo VS Code:**
1. Abra o VS Code
2. Vá em Extensions (`Ctrl+Shift+X`)
3. Pesquise por "Context Reminder"
4. Clique em "Install"

🔗 **[Ver no Marketplace](https://marketplace.visualstudio.com/items?itemName=robsonalvesdevbr.context-reminder)**

## ⚙️ Configuração

Acesse `File → Preferences → Settings` e procure por "Context Reminder":

- **Modelo**: Escolha entre "claude" ou "gpt" (padrão: claude)
- **Limite de tokens**: Defina quando mostrar o alerta (padrão: 2000)

## 📖 Como usar

1. **Instalação automática** - A extensão ativa sozinha quando o VS Code inicia
2. **Digite normalmente** - Continue trabalhando em seus arquivos
3. **Receba alertas** - Quando passar do limite, verá: "⚠️ Seu prompt possui X tokens (limite: Y). Considere iniciar um novo chat!"
4. **Ajuste conforme necessário** - Mude as configurações nas Settings

## 🎯 Casos de uso

- **Prompts para Claude/GPT** - Evite perder contexto em conversas longas
- **Documentação técnica** - Monitore tamanho antes de enviar para IA
- **Code reviews** - Saiba se o código cabe no contexto do modelo
- **Análise de logs** - Verifique se logs são pequenos o suficiente

## 💡 Dicas

- **Modelos diferentes** - Claude e GPT têm limites de contexto diferentes, ajuste conforme sua necessidade
- **Documentos longos** - Use a extensão para quebrar documentos grandes em partes menores
- **Desenvolvimento** - Monitore scripts e códigos antes de pedir análise à IA

## 📋 Changelog

Veja todas as mudanças e novas funcionalidades no [CHANGELOG.md](CHANGELOG.md).

### Últimas atualizações (v0.0.4):
- ✨ Novos comandos (`Check Token Count`, `Toggle Model`, `Set Token Limit`)
- 🚀 Performance otimizada
- 🛡️ Tratamento robusto de erros
- 🧪 Suite completa de testes

## 🤝 Contribuindo

Interessado em contribuir? Veja nosso [Guia de Contribuição](CONTRIBUTING.md) para desenvolvedores.

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Robson Candido dos Santos Alves**
- GitHub: [@robsonalvesdevbr](https://github.com/robsonalvesdevbr)
- Email: robson.curitibapr@gmail.com

---

⭐ **Gostou da extensão?** Deixe uma estrela no repositório!