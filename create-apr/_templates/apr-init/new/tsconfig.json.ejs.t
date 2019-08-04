---
to: tsconfig.json
---
{
  "compilerOptions": {
    "moduleResolution": "node",
    "target": "es5",
    "module": "esNext",
    "lib": ["es2015", "es2016", "es2017", "dom"],
    "strict": true,
    "sourceMap": true,
    "declaration": true,
    "noEmit": false,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declarationDir": "dist/types",
    "outDir": "dist/lib",
    "jsx": "react",
    "typeRoots": ["node_modules/@types", "../node_modules/@types", "src/types"],
    "rootDirs": ["src", "../action-packed-react"]
  },
  "include": [
    "src/*",
    "src/types/**/*",
    "../action-packed-react/**/*", "src/components/RootLayout/layout.tsx"
  ],
  "exclude": ["**/*.test.ts*", ""]
}
