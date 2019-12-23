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
    "build-storybook": "build-storybook -c .storybook -o .storybook-dist",
    "start": "apr dev",
    "storybook": "start-storybook",
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
    "@babel/core": "^7.7.5",
    "@babel/plugin-transform-runtime": "^7.7.6",
    "@babel/polyfill": "^7.7.0",
    "@babel/preset-env": "^7.7.6",
    "@babel/preset-react": "^7.7.4",
    "@babel/preset-typescript": "^7.7.4",
    "@babel/runtime": "^7.7.6",
    "@storybook/addon-info": "^5.2.8",
    "@storybook/addon-storyshots": "^5.2.8",
    "@storybook/react": "^5.2.8",
    "@types/history": "^4.7.3",
    "@types/jest": "^24.0.23",
    "@types/node": "^12.12.17",
    "@types/react": "^16.9.15",
    "@types/react-dom": "^16.9.4",
    "@types/storybook__addon-storyshots": "^5.1.2",
    "@types/styled-components": "^4.4.0",
    "babel-jest": "^24.9.0",
    "babel-loader": "^8.0.6",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^24.9.0",
    "react-test-renderer": "^16.12.0",
    "require-context.macro": "^1.2.2",
    "ts-jest": "^24.2.0"
  }
}
