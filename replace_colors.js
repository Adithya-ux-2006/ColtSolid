import fs from 'fs';
import path from 'path';

const directoryPath = path.join(process.cwd(), 'src');

const replacements = [
  { regex: /\bcoral\b/g, replacement: 'forest' },
  { regex: /\bteal\b/g, replacement: 'sage' },
  { regex: /\byellow\b/g, replacement: 'amber' },
  { regex: /\bcream\b/g, replacement: 'snow' },
  { regex: /\bcream-dark\b/g, replacement: 'gray-100' },
  { regex: /\bcoral-dark\b/g, replacement: 'forest-dark' },
  { regex: /\bteal-dark\b/g, replacement: 'sage-dark' },
  { regex: /\byellow-dark\b/g, replacement: 'amber-dark' },
  { regex: /\bcoral-light\b/g, replacement: 'forest-light' },
  { regex: /\bteal-light\b/g, replacement: 'sage-light' },
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated colors in ${fullPath}`);
      }
    }
  }
}

walk(directoryPath);
console.log("Done replacing colors.");
