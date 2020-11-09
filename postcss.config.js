const purgecss = [
  '@fullhuman/postcss-purgecss',
  {
    content: ['./components/**/*.js', './pages/**/*.js'],
    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
  }
]

module.exports = {
  plugins: [
    'postcss-import',
    'tailwindcss',
    'autoprefixer',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
          grid: 'autoplace'
        },
        stage: 3,
        features: {
          'custom-properties': false
        }
      }
    ],
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : [])
  ]
}
