---
to: tsconfig.json
---
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es2015", "es2016", "es2017", "dom"],
    "strict": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "jsx": "react",
    "typeRoots": ["node_modules/@types", "src/types"],
    "rootDirs": ["src"],
    "baseUrl": "src",
    "paths": {
      "app": ["index"],
      "app/*": ["*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "**/*.test.ts"]
}
