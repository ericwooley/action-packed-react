---
to: package.json
---
{
  "name": "create-<%= name.toLowerCase() %>",
  "version": "1.0.0",
  "description": "action packed react starter",
  "main": "bin.js",
  "author": "Eric Wooley <ericwooley@gmail.com>",
  "license": "MIT",
  "private": false,
  "scripts": {
    "prebuild": "rm -rf dist",
    "build": "webpack --config ./webpack.config.js",
    "start": "webpack-dev-server --config ./webpack.config.js",
    "lint": "tslint"
  },
  "dependencies": {
    "@types/history": "^4.7.2",
    "@types/react": "^16.8.24",
    "@types/react-dom": "^16.8.5",
    "@types/styled-components": "^4.1.18",
    "file-loader": "^4.1.0",
    "history": "^4.9.0",
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^4.0.0-beta.2",
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "styled-components": "^4.3.2",
    "ts-loader": "^6.0.4",
    "typescript": "^3.5.3",
    "webpack": "^4.39.1",
    "webpack-cli": "^3.3.6",
    "webpack-dev-server": "^3.7.2"
  }
}