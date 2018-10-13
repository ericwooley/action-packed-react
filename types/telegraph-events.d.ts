declare namespace Telegraph {
  export interface Emitter<T> {
    on: (channel: T, listener: (data: any) => any) => Emitter<T>
    once: (channel: T, listener: (data: any) => any) => Emitter<T>
    off: (channel: T, listener: (data: any) => any) => Emitter<T>
    emit: (channel: T, data: any) => any
  }
}
declare module 'telegraph-events' {
  interface Telegraph {
    (): Telegraph.Emitter<any>
  }
  var telegraph: Telegraph
  export = telegraph
}
