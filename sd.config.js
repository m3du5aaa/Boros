import StyleDictionary from 'style-dictionary';

const sd = new StyleDictionary({
  source: [
    'tokens/global.json',
    'tokens/Boros - Primitives/Mode 1.json',
    'tokens/Boros - Spacing + Density/Compact.json',
    'tokens/Boros - Layout + Device/Web.json',
    'tokens/Boros - Theme/Mode 1.json',
  ],
  parsers: [
    {
      pattern: /\.json$/,
      parser: ({ contents }) => {
        const obj = JSON.parse(contents);
        const convert = (node) => {
          if (node.$value !== undefined) {
            return { value: node.$value };
          }
          const result = {};
          for (const key in node) {
            if (!key.startsWith('$')) {
              result[key] = convert(node[key]);
            }
          }
          return result;
        };
        return convert(obj);
      },
    },
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'boros',
      buildPath: 'app/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
