module.exports = {
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  semi: true,
  importOrder: [
    '^UnityEngine',
    '^ZEPETO',
    '^[^@./]',
    '^@shared/(.*)$',
    '^@client/(.*)$',
    '^@src/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};
