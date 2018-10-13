```ts
// maintain keys while changing types
function funkTest<T extends { [key: string]: () => any }>(Obj: T) {
  const thing: any = {}
  return thing as { [K in keyof T]: ReturnType<typeof Obj[K]> }
}

const test = funkTest({
  bob: () => 'steve'
})
```
