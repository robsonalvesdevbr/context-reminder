#!/usr/bin/env node

/**
 * Script para atualizar automaticamente o CHANGELOG.md
 * Uso: node scripts/update-changelog.js [version] [type] [description]
 *
 * Exemplos:
 * node scripts/update-changelog.js 0.1.0 added "Novo comando para exportar tokens"
 * node scripts/update-changelog.js 0.1.1 fixed "Corrigido bug na contagem de tokens"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Uso: node update-changelog.js [version] [type] [description]');
  console.log('Tipos: added, changed, deprecated, removed, fixed, security');
  process.exit(1);
}

const [version, type, description] = args;
const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

// Ler changelog atual
let changelog = fs.readFileSync(changelogPath, 'utf8');

// Criar entrada de nova versão se necessário
const versionHeader = `## [${version}] - ${new Date().toISOString().split('T')[0]}`;

if (!changelog.includes(versionHeader)) {
  // Adicionar nova versão
  const insertPoint = changelog.indexOf('\n## [');
  if (insertPoint === -1) {
    // Primeiro changelog
    changelog = changelog.replace(
      /# Change Log.*?\n\n/s,
      `# Change Log\n\nTodas as mudanças notáveis deste projeto serão documentadas neste arquivo.\n\n${versionHeader}\n\n`
    );
  } else {
    changelog = changelog.slice(0, insertPoint) + '\n' + versionHeader + '\n' + changelog.slice(insertPoint);
  }
}

// Adicionar nova entrada
const typeMap = {
  added: '### Adicionado',
  changed: '### Alterado',
  deprecated: '### Depreciado',
  removed: '### Removido',
  fixed: '### Corrigido',
  security: '### Segurança'
};

const typeHeader = typeMap[type.toLowerCase()];
if (!typeHeader) {
  console.error('Tipo inválido. Use: added, changed, deprecated, removed, fixed, security');
  process.exit(1);
}

// Encontrar onde inserir a nova entrada
const versionIndex = changelog.indexOf(versionHeader);
const nextVersionIndex = changelog.indexOf('\n## [', versionIndex + 1);
const versionSection = nextVersionIndex === -1 ?
  changelog.slice(versionIndex) :
  changelog.slice(versionIndex, nextVersionIndex);

let updatedSection = versionSection;

if (versionSection.includes(typeHeader)) {
  // Adicionar à seção existente
  const typeIndex = versionSection.indexOf(typeHeader);
  const nextTypeIndex = versionSection.indexOf('\n### ', typeIndex + 1);
  const insertPoint = nextTypeIndex === -1 ?
    versionSection.length :
    nextTypeIndex;

  updatedSection = versionSection.slice(0, insertPoint) +
    `- ${description}\n` +
    versionSection.slice(insertPoint);
} else {
  // Criar nova seção
  updatedSection = versionSection + `\n${typeHeader}\n- ${description}\n`;
}

// Reconstruir changelog
changelog = nextVersionIndex === -1 ?
  changelog.slice(0, versionIndex) + updatedSection :
  changelog.slice(0, versionIndex) + updatedSection + changelog.slice(nextVersionIndex);

// Salvar
fs.writeFileSync(changelogPath, changelog);
console.log(`✅ Changelog atualizado: ${version} - ${type} - ${description}`);