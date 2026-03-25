import { readFileSync, writeFileSync } from 'fs';

const files = [
  'tokens/Boros - Primitives/Mode 1.json',
  'tokens/Boros - Spacing + Density/Compact.json',
  'tokens/Boros - Layout + Device/Web.json',
  'tokens/Boros - Theme/Mode 1.json',
];

const allTokens = {};

for (const file of files) {
  const obj = JSON.parse(readFileSync(file, 'utf8'));
  Object.assign(allTokens, obj);
}

const cssVars = [];

function sanitize(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function flatten(obj, path = []) {
  for (const key in obj) {
    if (key.startsWith('$')) continue;
    const val = obj[key];
    if (val && typeof val === 'object' && '$value' in val) {
      const varName = '--boros-' + [...path, key].map(sanitize).join('-');
      const value = String(val.$value);
      if (!value.startsWith('{')) {
        cssVars.push(`  ${varName}: ${value};`);
      }
    } else if (val && typeof val === 'object') {
      flatten(val, [...path, key]);
    }
  }
}

flatten(allTokens);

const css = `:root {\n${cssVars.join('\n')}\n}\n`;
writeFileSync('app/tokens.css', css);
console.log(`✅ Generated ${cssVars.length} CSS variables → app/tokens.css`);
