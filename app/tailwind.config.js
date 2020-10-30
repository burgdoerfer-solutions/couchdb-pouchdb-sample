// tailwind.config.js
const { colors } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./lib/**/*'],
  theme: {
    extend: {
      colors: {
        blue: {
          ...colors.blue,
          // blue
          '400': '#3490dc',
          // blue-darker
          '900': '#1c3d5a',
        },
        gray: {
          ...colors.gray,
          // grey-lighter
          '200': '#f1f5f8',
          // grey
          '400': '#b8c2cc',
        },
        green: {
          ...colors.green,
          // green
          '500': '#38c172',
        },
        red: {
          ...colors.red,
          // red
          '500': '#e3342f',
        },
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'active'],
    textColor: ['responsive', 'hover', 'focus', 'active'],
  },
  plugin: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
}
