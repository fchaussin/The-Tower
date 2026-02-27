const fs = require('fs');
const path = require('path');

const enemiesDir = path.join(__dirname, 'src', 'game', 'enemies');

const shapes = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon'];
const styles = ['fill', 'stroke'];
const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#fff', '#f80', '#80f', '#08f', '#8f0', '#f08'];

function generateEnemy(index) {
  const num = String(index).padStart(3, '0');
  
  const shape = shapes[index % shapes.length];
  const style = styles[index % styles.length];
  const color = colors[index % colors.length];
  
  const size = 8 + (index % 15) * 2; 
  const speed = 20 + (index % 10) * 10; 
  const health = 10 + Math.floor(index * 2.5); 
  
  let nameParts = [];
  
  if (size < 12) nameParts.push('Tiny');
  else if (size < 18) nameParts.push('Small');
  else if (size > 30) nameParts.push('Giant');
  else if (size > 24) nameParts.push('Large');
  
  if (speed > 80) nameParts.push('Fast');
  else if (speed < 40) nameParts.push('Slow');
  
  if (style === 'stroke') nameParts.push('Hollow');
  else nameParts.push('Solid');
  
  nameParts.push(shape.charAt(0).toUpperCase() + shape.slice(1));
  
  const className = `E${num}_${nameParts.join('')}`;
  const fileName = `${className}.js`;
  
  const content = `import { Enemy } from './Enemy.js';

export class ${className} extends Enemy {
  constructor(x, y, targetX, targetY) {
    super(x, y, targetX, targetY, ${size}, ${health}, ${speed}, '${color}', '${shape}', '${style}');
  }
  
  getCurrencyValue() { return ${Math.max(1, Math.ceil(health / 10))}; }
  getScoreValue() { return ${health * 2}; }
}
`;

  fs.writeFileSync(path.join(enemiesDir, fileName), content);
  return className;
}

const generatedClasses = [];
for (let i = 8; i <= 57; i++) {
  generatedClasses.push(generateEnemy(i));
}

let indexContent = `export { E001_Swarm } from './E001_Swarm.js';
export { E002_Basic } from './E002_Basic.js';
export { E003_Fast } from './E003_Fast.js';
export { E004_Splitter } from './E004_Splitter.js';
export { E005_Rage } from './E005_Rage.js';
export { E006_Tank } from './E006_Tank.js';
export { E007_GiantHollowHexagon } from './E007_GiantHollowHexagon.js';\n`;

for (const cls of generatedClasses) {
  indexContent += `export { ${cls} } from './${cls}.js';\n`;
}

fs.writeFileSync(path.join(enemiesDir, 'index.js'), indexContent);

let listContent = `import * as Enemies from './index.js';

export const EnemyList = [
  Enemies.E001_Swarm,
  Enemies.E002_Basic,
  Enemies.E003_Fast,
  Enemies.E004_Splitter,
  Enemies.E005_Rage,
  Enemies.E006_Tank,
  Enemies.E007_GiantHollowHexagon,
`;
for (const cls of generatedClasses) {
  listContent += `  Enemies.${cls},\n`;
}
listContent += `];\n`;

fs.writeFileSync(path.join(enemiesDir, 'EnemyList.js'), listContent);

console.log('Generated 50 enemies and index files.');
