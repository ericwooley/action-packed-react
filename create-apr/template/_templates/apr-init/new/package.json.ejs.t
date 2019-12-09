---
to: package.json
---
{
  "name": "<%= h.inflection.transform(name, ['underscore','dasherize']) %>",
  "version": "1.0.0",
  "description": "My action-packed-react app",
  "main": "webpack.config.js",
  "scripts": {
    "prebuild": "rm -rf dist",
    "build": "apr build",
    "start": "apr dev",
    "lint": "tslint --project tsconfig.json",
    "test": "jest --passWithNoTests"
  },
  "author": "",
  "license": "MIT",
  "dependencies": {
    "history": "^4.10.1",
    "react": "^16.12.0",
    "react-dom": "^16.12.0",
    "styled-components": "^4.4.1"
  },
  "devDependencies": {
    "@storybook/addon-info": "^5.2.8",
    "@storybook/addon-storyshots": "^5.2.8",
    "@storybook/react": "^5.2.8",
    "@types/history": "^4.7.3",
    "@types/react": "^16.9.15",
    "@types/react-dom": "^16.9.4",
    "@types/styled-components": "^4.4.0",
    "babel-jest": "^24.9.0",
    "jest": "^24.9.0"
  }
}
