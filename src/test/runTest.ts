import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		// O caminho para a pasta contendo o package.json da extensão
		// Passado para `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// O caminho para o test runner
		// Passado para --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip e executar a integração de testes
		await runTests({ extensionDevelopmentPath, extensionTestsPath });
	} catch (err) {
		console.error('Failed to run tests', err);
		process.exit(1);
	}
}

main();