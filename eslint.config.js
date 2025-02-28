const js = require('@eslint/js')

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        es6: true,
        node: true,
        browser: true,
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        chrome: 'readonly'
      }
    },
    env: {
      browser: true, // Enables browser global variables like setTimeout
      node: true // Enables Node.js global variables
    },
    rules: {
      semi: [ 'error', 'never' ],
      'comma-dangle': [ 'error', 'never' ],
      quotes: [ 'error', 'single' ],
      indent: [ 'error', 2 ],
      'arrow-parens': [ 'error', 'as-needed' ],
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ]
    }
  },
  {
    files: [ 'eslint.config.js' ],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
]