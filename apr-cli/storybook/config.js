import { configure } from '@storybook/react'

function loadStories () {
  const req = require.context('../src', true, /story\..*$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
