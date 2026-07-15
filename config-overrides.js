// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const webpack = require('webpack')
const {
  override,
  // fixBabelImports,
  addLessLoader,
  useEslintRc,
  addDecoratorsLegacy,
  useBabelRc,
} = require('customize-cra')

// Webpack 4 (react-scripts) — use ProvidePlugin + alias only (no resolve.fallback)
const addProcessPolyfill = () => config => {
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  )
  config.resolve.alias = {
    ...config.resolve.alias,
    process: 'process/browser',
  }
  return config
}

// eslint config
const eslintConfig = require('./.eslintrc.js');
const useEslintConfig = configRules => config => {
  const updatedRules = config.module.rules.map(
    rule => {
      // Only target rules that have defined a `useEslintrc` parameter in their options
      if (rule.use && rule.use.some(use => use.options && use.options.useEslintrc !== void 0)) {
        const ruleUse = rule.use[0]
        const baseOptions = ruleUse.options
        const baseConfig = baseOptions.baseConfig || {}
        const newOptions = {
          useEslintrc: false,
          ignore: true,
          baseConfig: { ...baseConfig, ...configRules },
        }
        ruleUse.options = newOptions
        return rule

        // Rule not using eslint. Do not modify.
      } else {
        return rule
      }
    }
  )

  config.module.rules = updatedRules;
  return config;
}

module.exports = override(
  addProcessPolyfill(),
  addDecoratorsLegacy(),
  useEslintRc(),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      'root-entry-name': 'variable'
    }
  }),
  useEslintConfig(eslintConfig),
  useBabelRc(),
)