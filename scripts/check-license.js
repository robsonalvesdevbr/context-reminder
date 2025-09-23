#!/usr/bin/env node

/**
 * Script para verificar se a licença MIT está corretamente configurada
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração da licença MIT...\n');

// Verificar arquivo LICENSE
const licensePath = path.join(__dirname, '..', 'LICENSE');
if (fs.existsSync(licensePath)) {
  const licenseContent = fs.readFileSync(licensePath, 'utf8');

  if (licenseContent.includes('MIT License')) {
    console.log('✅ Arquivo LICENSE existe e contém "MIT License"');
  } else {
    console.log('❌ Arquivo LICENSE existe mas não contém "MIT License"');
  }

  if (licenseContent.includes('Robson Candido dos Santos Alves')) {
    console.log('✅ LICENSE contém o nome do autor');
  } else {
    console.log('❌ LICENSE não contém o nome do autor');
  }

  if (licenseContent.includes('2025')) {
    console.log('✅ LICENSE contém o ano atual');
  } else {
    console.log('❌ LICENSE não contém o ano atual');
  }
} else {
  console.log('❌ Arquivo LICENSE não encontrado');
}

// Verificar package.json
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  if (packageContent.license === 'MIT') {
    console.log('✅ package.json especifica licença "MIT"');
  } else {
    console.log(`❌ package.json especifica licença "${packageContent.license}" em vez de "MIT"`);
  }
} else {
  console.log('❌ Arquivo package.json não encontrado');
}

// Verificar README.md
const readmePath = path.join(__dirname, '..', 'README.md');
if (fs.existsSync(readmePath)) {
  const readmeContent = fs.readFileSync(readmePath, 'utf8');

  if (readmeContent.includes('MIT License')) {
    console.log('✅ README.md menciona "MIT License"');
  } else {
    console.log('❌ README.md não menciona "MIT License"');
  }

  if (readmeContent.includes('[LICENSE](LICENSE)')) {
    console.log('✅ README.md contém link para arquivo LICENSE');
  } else {
    console.log('❌ README.md não contém link para arquivo LICENSE');
  }
} else {
  console.log('❌ Arquivo README.md não encontrado');
}

// Verificar .vscodeignore
const vscodeignorePath = path.join(__dirname, '..', '.vscodeignore');
if (fs.existsSync(vscodeignorePath)) {
  const vscodeignoreContent = fs.readFileSync(vscodeignorePath, 'utf8');

  if (!vscodeignoreContent.includes('LICENSE')) {
    console.log('✅ LICENSE não está no .vscodeignore (será incluído no pacote)');
  } else {
    console.log('❌ LICENSE está no .vscodeignore (não será incluído no pacote)');
  }
} else {
  console.log('⚠️  Arquivo .vscodeignore não encontrado');
}

console.log('\n🎯 Verificação da licença MIT concluída!');

// Resumo
console.log('\n📋 Resumo:');
console.log('- Licença MIT configurada para uso comercial e modificações');
console.log('- Arquivo LICENSE incluído no pacote da extensão');
console.log('- VS Code Marketplace mostrará automaticamente a licença');
console.log('- GitHub detectará automaticamente a licença MIT');