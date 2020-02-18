---
to: .storybook/config.js
---
const { configure } = require('@storybook/react')
const requireContext = require('require-context.macro');

function loadStories () {
  const req = requireContext('../src', true, /\.story.*/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
