module.exports = {
  locales: ['en', 'am'], // Supported languages
  output: 'locales/$LOCALE/translation.json', // Output path for translation files
  defaultNamespace: 'translation',
  createOldCatalogs: false, // Do not keep old translation files
  lexers: {
    js: ['JavascriptLexer'], // Parse JavaScript/TypeScript files
    tsx: ['JavascriptLexer'], // Parse React TSX files
  },
  keySeparator: false, // Use flat keys (e.g., "welcome")
  namespaceSeparator: false, // Do not use namespace separators
  defaultValue: (lng, ns, key) => key, // Use the key as the default value
};