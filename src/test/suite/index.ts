import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

export function run(): Promise<void> {
	// Criar a instância do Mocha
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot })
			.then((files) => {
				// Adicionar arquivos à suite de teste
				files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

				try {
					// Executar os testes do mocha
					mocha.run((failures: number) => {
						if (failures > 0) {
							e(new Error(`${failures} tests failed.`));
						} else {
							c();
						}
					});
				} catch (err) {
					console.error(err);
					e(err);
				}
			})
			.catch(e);
	});
}