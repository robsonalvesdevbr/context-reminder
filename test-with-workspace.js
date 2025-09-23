const { runTests } = require('@vscode/test-electron');
const path = require('path');

async function main() {
  try {
    // O caminho para o diretório da extensão
    const extensionDevelopmentPath = path.resolve(__dirname);

    // O caminho para o diretório de testes
    const extensionTestsPath = path.resolve(__dirname, './out/test/suite/index');

    // O workspace de teste
    const testWorkspace = path.resolve(__dirname, 'test-workspace');

    console.log('🚀 Executando testes com workspace:', testWorkspace);

    // Executar testes com workspace
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [testWorkspace, '--disable-extensions']
    });

    console.log('✅ Todos os testes executados com sucesso!');
  } catch (err) {
    console.error('❌ Falha ao executar testes:', err);
    process.exit(1);
  }
}

main();