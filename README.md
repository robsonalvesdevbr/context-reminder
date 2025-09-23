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

### Via VS Code Marketplace (em breve)
```
Em desenvolvimento - aguarde publicação
```

### Via arquivo .vsix
```bash
code --install-extension context-reminder-0.0.2.vsix
```

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

## 🛠️ Para Desenvolvedores

### Desenvolvimento local
```bash
git clone https://github.com/robsonalvesdevbr/context-reminder.git
cd context-reminder
npm install
npm run watch  # Compilação automática
# Pressione F5 no VS Code para testar
```

### Construir extensão
```bash
npm run compile
vsce package
```

## 🤝 Contribuindo

1. Fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Robson Candido dos Santos Alves**
- GitHub: [@robsonalvesdevbr](https://github.com/robsonalvesdevbr)
- Email: robson.curitibapr@gmail.com

---

⭐ **Gostou da extensão?** Deixe uma estrela no repositório!