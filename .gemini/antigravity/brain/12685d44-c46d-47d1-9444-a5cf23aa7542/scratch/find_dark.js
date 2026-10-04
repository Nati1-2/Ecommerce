const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('C:\\Users\\Win 10\\Desktop\\Ecomerce\\frontend\\src');
files.forEach(f => {
  if (f.includes('\\admin\\') || f.includes('\\components\\Admin')) {
    return; // Skip admin
  }
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('dark:')) {
    console.log('Found dark: in', f);
  }
});
console.log('Done searching.');
