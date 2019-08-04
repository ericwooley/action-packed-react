---
to: hygen-create.json
---
{
  "about": "This is a hygen-create definitions file. The hygen-create utility creates generators that can be executed using hygen.",
  "hygen_create_version": "0.2.0",
  "name": "<%= name.toLowerCase() %>-init",
  "files_and_dirs": {
    "hygen-create.json": true,
    "src/index.tsx": true,
    "src/components/RootLayout/index.tsx": true,
    "src/redux/index.ts": true,
    "src/redux/reducers/index.ts": true,
    "src/redux/sagas/autoSaveState.ts": true,
    "src/redux/sagas/index.ts": true,
    "src/redux/selectors/index.ts": true,
    "package.json": true,
    "webpack.config.js": true,
    "tsconfig.json": true
  },
  "templatize_using_name": "<%= name.toLowerCase() %>",
  "gen_parent_dir": false
}