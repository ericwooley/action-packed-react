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

Packages or organized using yarn workspaces, so yarn is required.

First thing you should do is run `yarn install`


Next is to understand the organization of the project.
```bash
.
├── action-packed-react   # Libraries/framework
├── apr-cli               # CLI for running builds, development, and generation
├── apr-website           # Future home for the documentation
└── create-apr            # Boilerplate package, for easy setup.
```

There is another `package` named playground, that is git ignored. If you run `yarn playground-init`, it will wiped clean, and re-initialized with a fresh install of action packed react.

### Dev flow
1. Make any changes you want on a package.
2. from the root, run `yarn playground-init`
3. `cd playground`
4. the apr cli can be accessed by resolving it with yarn. `yarn apr g route` for example.
5. Generate some things with the cli.
6. Make sure things work as expected. Make sure storybooks `yarn apr s` and `yarn apr d` work as expected.