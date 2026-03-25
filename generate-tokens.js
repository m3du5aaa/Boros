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

function sanitize(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Get raw value by dot-path like "primitive.colors.water.900"
function resolveRef(ref, tokens, depth = 0) {
  if (depth > 10) return null;
  const path = ref.replace(/^\{|\}$/g, '').split('.');
  let node = tokens;
  for (const key of path) {
    if (!node) return null;
    // find case-insensitive key match
    const match = Object.keys(node).find(k => k === key);
    node = match ? node[match] : null;
  }
  if (!node) return null;
  if (node.$value !== undefined) {
    const val = String(node.$value);
    if (val.startsWith('{')) return resolveRef(val, tokens, depth + 1);
    return val;
  }
  return null;
}

const primitiveCssVars = [];
const semanticCssVars = [];

function flatten(obj, path = [], isSemantic = false) {
  for (const key in obj) {
    if (key.startsWith('$')) continue;
    const val = obj[key];
    if (val && typeof val === 'object' && '$value' in val) {
      const varName = '--boros-' + [...path, key].map(sanitize).join('-');
      const raw = String(val.$value);
      if (raw.startsWith('{')) {
        const resolved = resolveRef(raw, allTokens);
        if (resolved) {
          (isSemantic ? semanticCssVars : primitiveCssVars).push(`  ${varName}: ${resolved};`);
        }
      } else {
        primitiveCssVars.push(`  ${varName}: ${raw};`);
      }
    } else if (val && typeof val === 'object') {
      flatten(val, [...path, key], isSemantic);
    }
  }
}

// Flatten primitives first (needed for resolution)
const { primitive, layout, spacing, ...semantic } = allTokens;
if (primitive) flatten({ primitive }, [], false);
if (layout) flatten({ layout }, [], false);
if (spacing) flatten({ spacing }, [], false);

// Then flatten semantic tokens
flatten(semantic, [], true);

const css = `:root {\n  /* Semantic tokens */\n${semanticCssVars.join('\n')}\n\n  /* Primitive tokens */\n${primitiveCssVars.join('\n')}\n}\n`;
writeFileSync('app/tokens.css', css);
console.log(`✅ Generated ${semanticCssVars.length} semantic + ${primitiveCssVars.length} primitive CSS variables → app/tokens.css`);
