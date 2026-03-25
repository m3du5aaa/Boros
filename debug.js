import { readFileSync } from 'fs';

const file = readFileSync('./tokens/Boros - Primitives/Mode 1.json', 'utf8');
const obj = JSON.parse(file);
console.log('Top level keys:', Object.keys(obj));
console.log('First entry:', JSON.stringify(obj[Object.keys(obj)[0]], null, 2).slice(0, 300));
