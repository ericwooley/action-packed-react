# Action Packed React

## Config Files
The cli searches for config files using
[cosmiconfig](https://github.com/davidtheclark/cosmiconfig#cosmiconfig). It will
find config files in the following formats.

* `apr` property in a package.json file.
* `.aprrc` file with JSON or YAML syntax.
* `.aprrc.json` file.
* `.aprrc.yaml`, `.aprrc.yml`, or `.aprrc.js` file.
* `apr.config.js` which should be a CommonJS module.

### rc options
The options listed are the defaults.

```js
module.exports = {
  /* Webpack dev server options */
  // port: 8080,                         // Webpack dev server port
  // host: "localhost",                  // Webpack dev server host
}
```


## Initial Release
[See the initial release milestone](https://github.com/ericwooley/action-packed-react/milestone/1)

## Development

Packages or organized using yarn workspaces.
```bash
.
├── action-packed-react   # Library/framework
├── apr-cli               # CLI for running builds, development, and generation
├── apr-website           # Future home for the documentation
└── create-apr            # Boilerplate package, for easy setup.
```
