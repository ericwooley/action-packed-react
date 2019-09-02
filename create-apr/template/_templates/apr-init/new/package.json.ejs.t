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
    "test": "echo 'test no yet defined'"
  },
  "dependencies":{
    "@types/history": "^4.7.2",
    "@types/react": "^16.8.24",
    "@types/react-dom": "^16.8.5",
    "@types/storybook__react": "^4.0.2",
    "@types/styled-components": "^4.1.18",
    "@storybook/addon-info": "^5.1.11",
    "@storybook/react": "^5.1.11",
    "action-packed-react": "0.0.0",
    "apr-cli": "0.0.0",
    "history": "^4.9.0",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "styled-components": "^4.3.2"
  },
  "author": "",
  "license": "MIT"
}
